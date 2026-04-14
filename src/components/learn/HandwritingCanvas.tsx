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

    const strokeIndex = strokesRef.current.length;
    const score = strokeIndex < refPaths.length
      ? scoreOneStroke(pts, refPaths[strokeIndex])
      : 0;
    strokesRef.current = [...strokesRef.current, pts];
    strokeScoresRef.current = [...strokeScoresRef.current, score];

    setStrokes([...strokesRef.current]);
    setStrokeScores([...strokeScoresRef.current]);

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

  const allDone = strokes.length >= refPaths.length && refPaths.length > 0;
  const stars = totalScore !== null ? scoreStars(totalScore) : 0;
  const scoreColor = totalScore === null ? accentColor
    : totalScore >= 85 ? '#27AE60'
    : totalScore >= 60 ? '#E67E22'
    : '#C0392B';

  // Label row — mirrors StrokeOrderDisplay's progress label
  const label = strokes.length === 0
    ? '開始練習吧'
    : allDone && totalScore !== null
    ? `${totalScore} 分 ${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}`
    : `第 ${strokes.length} / ${refPaths.length} 畫`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, width: '100%' }}>

      {/* Canvas — same 200×200 as the animation canvas */}
      <div style={{
        width: 200,
        height: 200,
        borderRadius: BORDER_RADIUS.lg,
        backgroundColor: '#F8F8F8',
        border: `2px solid ${allDone ? scoreColor : '#E8E8E8'}`,
        position: 'relative',
        boxShadow: SHADOW.sm,
        overflow: 'hidden',
        transition: 'border-color 0.3s',
        flexShrink: 0,
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
          <line x1="50" y1="5" x2="50" y2="95" stroke="#ECECEC" strokeWidth="0.6" />
          <line x1="5" y1="50" x2="95" y2="50" stroke="#ECECEC" strokeWidth="0.6" />

          {showRef && refPaths.map((d, i) => (
            <path key={i} d={d} stroke={accentColor} strokeWidth={8}
              strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={0.13} />
          ))}

          {strokes.map((pts, i) => (
            <polyline key={i} points={ptsToPolyline(pts)}
              stroke={strokeScoreColor(strokeScores[i] ?? 0)}
              strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={0.88} />
          ))}

          <polyline ref={livePolyRef} points=""
            stroke="#BBBBBB" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>

        {/* Hint overlay when nothing drawn */}
        {strokes.length === 0 && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none',
          }}>
            <span style={{ fontSize: '0.8rem', color: '#BBB', backgroundColor: 'rgba(255,255,255,0.85)', padding: '4px 10px', borderRadius: 20 }}>
              在此手寫
            </span>
          </div>
        )}
      </div>

      {/* Score dots + label — mirrors StrokeOrderDisplay's progress row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {refPaths.map((_, i) => (
            <div key={i} style={{
              width: 10, height: 10, borderRadius: '50%',
              backgroundColor: i < strokes.length
                ? strokeScoreColor(strokeScores[i] ?? 0)
                : '#DDDDDD',
              transition: 'background-color 0.2s',
            }} />
          ))}
        </div>
        <span style={{
          fontSize: '0.82rem',
          color: allDone && totalScore !== null ? scoreColor : '#999',
          fontWeight: allDone && totalScore !== null ? 700 : 400,
          transition: 'color 0.2s',
        }}>
          {label}
        </span>
      </div>

      {/* Action buttons — same height (48px) as watch mode's action button */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={clear}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            height: 48, padding: '0 24px',
            borderRadius: BORDER_RADIUS.md,
            backgroundColor: 'transparent',
            color: COLORS.textLight,
            border: '2px solid #DDD',
            fontSize: '0.95rem', fontWeight: 700,
            cursor: 'pointer', touchAction: 'manipulation',
            whiteSpace: 'nowrap', flexShrink: 0,
          }}
        >
          清除重寫
        </button>
        <button
          onClick={() => setShowRef(v => !v)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            height: 48, padding: '0 24px',
            borderRadius: BORDER_RADIUS.md,
            backgroundColor: showRef ? `${accentColor}22` : 'transparent',
            color: showRef ? accentColor : COLORS.textLight,
            border: `2px solid ${showRef ? accentColor : '#DDD'}`,
            fontSize: '0.95rem', fontWeight: 700,
            cursor: 'pointer', touchAction: 'manipulation',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap', flexShrink: 0,
          }}
        >
          {showRef ? '隱藏參考' : '顯示參考'}
        </button>
      </div>
    </div>
  );
}
