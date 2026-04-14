import { useState, useRef } from 'react';
import { type Point, scoreOneStroke, scoreStrokes, strokeScoreColor, scoreStars } from '../../utils/strokeScore';
import { BORDER_RADIUS, SHADOW, COLORS } from '../../styles/theme';

interface Props {
  refPaths: string[];
  accentColor: string;
}

function ptsToPolyline(pts: Point[]): string {
  return pts.map(p => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ');
}

export default function HandwritingCanvas({ refPaths, accentColor }: Props) {
  const [strokes, setStrokes] = useState<Point[][]>([]);
  const [strokeScores, setStrokeScores] = useState<number[]>([]);
  const [totalScore, setTotalScore] = useState<number | null>(null);
  const [showRef, setShowRef] = useState(false);

  // Refs for stable, closure-safe access in pointer handlers
  const svgRef = useRef<SVGSVGElement>(null);
  const livePolyRef = useRef<SVGPolylineElement>(null);
  const isDrawingRef = useRef(false);
  const currentPtsRef = useRef<Point[]>([]);
  const strokesRef = useRef<Point[][]>([]);
  const strokeScoresRef = useRef<number[]>([]);

  function toSvg(e: React.PointerEvent): Point {
    const rect = svgRef.current!.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)),
      y: Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100)),
    };
  }

  function handlePointerDown(e: React.PointerEvent<SVGSVGElement>) {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    isDrawingRef.current = true;
    const pt = toSvg(e);
    currentPtsRef.current = [pt];
    if (livePolyRef.current) {
      livePolyRef.current.setAttribute('points', `${pt.x.toFixed(2)},${pt.y.toFixed(2)}`);
    }
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!isDrawingRef.current) return;
    e.preventDefault();
    const pt = toSvg(e);
    const prev = currentPtsRef.current[currentPtsRef.current.length - 1];
    if (Math.hypot(pt.x - prev.x, pt.y - prev.y) < 0.8) return;
    currentPtsRef.current.push(pt);
    // Direct DOM update — avoids React re-render on every pointer move
    if (livePolyRef.current) {
      livePolyRef.current.setAttribute('points', ptsToPolyline(currentPtsRef.current));
    }
  }

  function finishStroke() {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;

    const pts = currentPtsRef.current.slice();
    currentPtsRef.current = [];
    if (livePolyRef.current) livePolyRef.current.setAttribute('points', '');

    if (pts.length < 2) return;

    // Sequential: match stroke[i] against refPaths[i] to respect stroke order
    const strokeIndex = strokesRef.current.length;
    const score = strokeIndex < refPaths.length
      ? scoreOneStroke(pts, refPaths[strokeIndex])
      : 0;
    strokesRef.current = [...strokesRef.current, pts];
    strokeScoresRef.current = [...strokeScoresRef.current, score];

    setStrokes([...strokesRef.current]);
    setStrokeScores([...strokeScoresRef.current]);

    // Auto-score when the drawn count reaches the reference count
    if (strokesRef.current.length >= refPaths.length && refPaths.length > 0) {
      setTotalScore(scoreStrokes(strokesRef.current, refPaths));
    }
  }

  function clear() {
    strokesRef.current = [];
    strokeScoresRef.current = [];
    currentPtsRef.current = [];
    isDrawingRef.current = false;
    if (livePolyRef.current) livePolyRef.current.setAttribute('points', '');
    setStrokes([]);
    setStrokeScores([]);
    setTotalScore(null);
  }

  const stars = totalScore !== null ? scoreStars(totalScore) : 0;
  const starBg = totalScore === null ? '' : totalScore >= 85 ? '#E8F8F0' : totalScore >= 60 ? '#FEF9E7' : '#FDEDEC';
  const starFg = totalScore === null ? '' : totalScore >= 85 ? '#27AE60' : totalScore >= 60 ? '#E67E22' : '#C0392B';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, width: '100%' }}>

      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, alignSelf: 'flex-start', paddingLeft: 2 }}>
        <span style={{ fontSize: '0.85rem', color: '#888' }}>✍️ 跟著寫寫看</span>
        <span style={{ fontSize: '0.75rem', color: '#BBB' }}>（{refPaths.length} 畫）</span>
      </div>

      {/* Drawing canvas */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: 240,
        aspectRatio: '1 / 1',
        borderRadius: BORDER_RADIUS.lg,
        backgroundColor: '#FAFAFA',
        border: `2px solid ${totalScore !== null ? starFg : '#E8E8E8'}`,
        boxShadow: SHADOW.sm,
        overflow: 'hidden',
        transition: 'border-color 0.3s',
      }}>
        <svg
          ref={svgRef}
          viewBox="0 0 100 100"
          style={{ display: 'block', width: '100%', height: '100%', touchAction: 'none', cursor: 'crosshair' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={finishStroke}
          onPointerLeave={finishStroke}
          onPointerCancel={finishStroke}
        >
          {/* Subtle grid */}
          <line x1="50" y1="5" x2="50" y2="95" stroke="#ECECEC" strokeWidth="0.6" />
          <line x1="5" y1="50" x2="95" y2="50" stroke="#ECECEC" strokeWidth="0.6" />

          {/* Reference strokes (faint overlay) */}
          {showRef && refPaths.map((d, i) => (
            <path
              key={i}
              d={d}
              stroke={accentColor}
              strokeWidth={8}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              opacity={0.13}
            />
          ))}

          {/* Completed strokes (color-coded by score) */}
          {strokes.map((pts, i) => (
            <polyline
              key={i}
              points={ptsToPolyline(pts)}
              stroke={strokeScoreColor(strokeScores[i] ?? 0)}
              strokeWidth={7}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              opacity={0.88}
            />
          ))}

          {/* Live stroke (updated directly via DOM ref, no re-render) */}
          <polyline
            ref={livePolyRef}
            points=""
            stroke="#BBBBBB"
            strokeWidth={7}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>

      {/* Total score badge */}
      {totalScore !== null && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          backgroundColor: starBg,
          borderRadius: BORDER_RADIUS.md,
          padding: '7px 18px',
          fontSize: '0.92rem',
          fontWeight: 700,
          color: starFg,
          letterSpacing: '0.02em',
        }}>
          <span style={{ fontSize: '1.1rem', letterSpacing: '0.05em' }}>
            {'★'.repeat(stars)}{'☆'.repeat(3 - stars)}
          </span>
          <span>{totalScore} 分</span>
        </div>
      )}

      {/* Per-stroke legend (only when strokes exist but total not yet shown) */}
      {strokes.length > 0 && totalScore === null && (
        <div style={{ display: 'flex', gap: 12, fontSize: '0.72rem', color: '#AAA' }}>
          <span style={{ color: '#2ECC71' }}>● 優秀 ≥75</span>
          <span style={{ color: '#F39C12' }}>● 還行 40–74</span>
          <span style={{ color: '#E74C3C' }}>● 再試試 &lt;40</span>
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={clear}
          style={{
            height: 36,
            padding: '0 14px',
            borderRadius: BORDER_RADIUS.md,
            backgroundColor: 'transparent',
            color: COLORS.textLight,
            border: '1.5px solid #DDD',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            touchAction: 'manipulation',
          }}
        >
          清除重寫
        </button>
        <button
          onClick={() => setShowRef(v => !v)}
          style={{
            height: 36,
            padding: '0 14px',
            borderRadius: BORDER_RADIUS.md,
            backgroundColor: showRef ? `${accentColor}22` : 'transparent',
            color: showRef ? accentColor : COLORS.textLight,
            border: `1.5px solid ${showRef ? accentColor : '#DDD'}`,
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            touchAction: 'manipulation',
            transition: 'all 0.2s',
          }}
        >
          {showRef ? '隱藏參考' : '顯示參考'}
        </button>
      </div>
    </div>
  );
}
