// DEV ONLY — interactive stroke path editor
import { useState, useEffect, useRef } from 'react';
import { BOPOMOFO_SYMBOLS } from '../../constants/bopomofo';
import type { BopomofoSymbol } from '../../constants/bopomofo';
import { STROKE_DATA } from '../../constants/strokeData';

// ── Types ─────────────────────────────────────────────────────────────────────

type Point = { x: number; y: number };
type Cmd = 'M' | 'L' | 'Q_ctrl' | 'Q_end';
type PtEntry = Point & { cmd: Cmd };
type DrawMode = 'F' | 'L' | 'Q';

// ── Helpers ───────────────────────────────────────────────────────────────────

function snap(v: number) {
  return Math.round(v / 2) * 2;
}

function toViewBox(e: React.MouseEvent<SVGSVGElement>): Point {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = snap(((e.clientX - rect.left) / rect.width) * 100);
  const y = snap(((e.clientY - rect.top) / rect.height) * 100);
  return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
}

/** Build an SVG path `d` string from a PtEntry array */
function buildPath(pts: PtEntry[]): string {
  if (!pts.length) return '';
  let d = '';
  let cx = 0, cy = 0;
  let i = 0;
  while (i < pts.length) {
    const { cmd, x, y } = pts[i];
    if (cmd === 'M') {
      d += `M ${x},${y}`;
      cx = x; cy = y;
    } else if (cmd === 'L') {
      if (cy === y) { d += ` H ${x}`; cx = x; }
      else if (cx === x) { d += ` V ${y}`; cy = y; }
      else { d += ` L ${x},${y}`; cx = x; cy = y; }
    } else if (cmd === 'Q_ctrl') {
      const next = pts[i + 1];
      if (next?.cmd === 'Q_end') {
        d += ` Q ${x},${y} ${next.x},${next.y}`;
        cx = next.x; cy = next.y;
        i++;
      }
    }
    i++;
  }
  return d;
}

function lastEndPoint(pts: PtEntry[]): Point | null {
  for (let i = pts.length - 1; i >= 0; i--) {
    const c = pts[i].cmd;
    if (c === 'M' || c === 'L' || c === 'Q_end') return pts[i];
  }
  return null;
}

// ── Ramer-Douglas-Peucker simplification ─────────────────────────────────────

function perpDist(p: Point, a: Point, b: Point): number {
  const dx = b.x - a.x, dy = b.y - a.y;
  if (dx === 0 && dy === 0) return Math.hypot(p.x - a.x, p.y - a.y);
  const t = Math.max(0, Math.min(1,
    ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
}

function rdp(pts: Point[], eps: number): Point[] {
  if (pts.length <= 2) return pts.slice();
  let maxD = 0, maxI = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const d = perpDist(pts[i], pts[0], pts[pts.length - 1]);
    if (d > maxD) { maxD = d; maxI = i; }
  }
  if (maxD > eps) {
    const left = rdp(pts.slice(0, maxI + 1), eps);
    const right = rdp(pts.slice(maxI), eps);
    return [...left.slice(0, -1), ...right];
  }
  return [pts[0], pts[pts.length - 1]];
}

/** Convert a point array → compact SVG path (M + L/H/V segments) */
function pointsToPath(pts: Point[]): string {
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x},${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const { x, y } = pts[i];
    const prev = pts[i - 1];
    if (prev.y === y) d += ` H ${x}`;
    else if (prev.x === x) d += ` V ${y}`;
    else d += ` L ${x},${y}`;
  }
  return d;
}

/** Parse the starting point M x,y from a path string */
function pathStart(d: string): Point | null {
  const m = d.match(/^M\s*([\d.]+)[,\s]([\d.]+)/);
  return m ? { x: parseFloat(m[1]), y: parseFloat(m[2]) } : null;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function StrokeReviewPage() {
  const [selected, setSelected] = useState<BopomofoSymbol | null>(null);
  const [done, setDone] = useState<string[]>([]);
  const [pts, setPts] = useState<PtEntry[]>([]);       // L/Q mode current stroke
  const [drawMode, setDrawMode] = useState<DrawMode>('F');
  const [hover, setHover] = useState<Point | null>(null);
  const [copyLabel, setCopyLabel] = useState('複製程式碼');

  // Freehand state — rawPts kept in a ref to avoid stale closure in window handler
  const [isDrawing, setIsDrawing] = useState(false);
  const [rawPtsDisplay, setRawPtsDisplay] = useState<Point[]>([]);
  const rawPtsRef = useRef<Point[]>([]);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // ── Derived ──────────────────────────────────────────────────────────────────
  const currentPath = buildPath(pts);
  const pendingCtrl = pts.at(-1)?.cmd === 'Q_ctrl' ? pts.at(-1)! : null;
  const lastPt = lastEndPoint(pts);
  // Preview while freehand drawing — no simplification so it tracks cursor
  const freehandPreview = isDrawing && rawPtsDisplay.length >= 2
    ? pointsToPath(rawPtsDisplay)
    : '';

  // ── Finish freehand stroke (called from SVG onMouseUp and window mouseup) ────

  function finishFreehand() {
    const raw = rawPtsRef.current;
    if (raw.length === 0) return;        // already handled (prevent double-fire)
    rawPtsRef.current = [];              // clear ref first (sync, prevents re-entry)
    setIsDrawing(false);
    setRawPtsDisplay([]);
    if (raw.length >= 2) {
      const simplified = rdp(raw, 2.5);
      const path = pointsToPath(simplified);
      if (path) setDone(prev => [...prev, path]);
    }
  }

  // ── Window mouseup listener — fires when cursor released outside SVG ─────────
  useEffect(() => {
    if (!isDrawing) return;
    const onUp = () => finishFreehand();
    window.addEventListener('mouseup', onUp);
    return () => window.removeEventListener('mouseup', onUp);
  }, [isDrawing]);

  // ── Editor open/close/navigate ────────────────────────────────────────────────

  function openEditor(sym: BopomofoSymbol) {
    setSelected(sym);
    setDone(STROKE_DATA[sym.id] ?? []);
    setPts([]);
    setDrawMode('F');
    setHover(null);
    setIsDrawing(false);
    setRawPtsDisplay([]);
    rawPtsRef.current = [];
  }

  function closeEditor() {
    setSelected(null);
    setDone([]);
    setPts([]);
    setHover(null);
    setIsDrawing(false);
    setRawPtsDisplay([]);
    rawPtsRef.current = [];
  }

  function navigate(dir: -1 | 1) {
    if (!selected) return;
    const idx = BOPOMOFO_SYMBOLS.findIndex(s => s.id === selected.id);
    const next = BOPOMOFO_SYMBOLS[idx + dir];
    if (next) openEditor(next);
  }

  // ── SVG mouse handlers ────────────────────────────────────────────────────────

  function handleSvgMouseDown(e: React.MouseEvent<SVGSVGElement>) {
    if (drawMode !== 'F') return;
    e.preventDefault();
    const pt = toViewBox(e);
    rawPtsRef.current = [pt];
    setRawPtsDisplay([pt]);
    setIsDrawing(true);
  }

  function handleSvgMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    const pt = toViewBox(e);
    setHover(pt);

    if (drawMode === 'F' && isDrawing) {
      const prev = rawPtsRef.current;
      const last = prev[prev.length - 1];
      if (!last || Math.hypot(pt.x - last.x, pt.y - last.y) >= 1) {
        const next = [...prev, pt];
        rawPtsRef.current = next;
        // Throttle display updates to every 3rd point for performance
        if (next.length % 3 === 0 || next.length <= 3) {
          setRawPtsDisplay(next);
        }
      }
    }
  }

  function handleSvgMouseUp(e: React.MouseEvent<SVGSVGElement>) {
    if (drawMode === 'F' && isDrawing) {
      // Sync final hover point before finishing
      const pt = toViewBox(e);
      const prev = rawPtsRef.current;
      const last = prev[prev.length - 1];
      if (!last || Math.hypot(pt.x - last.x, pt.y - last.y) >= 1) {
        rawPtsRef.current = [...prev, pt];
      }
      finishFreehand();
    }
  }

  function handleClick(e: React.MouseEvent<SVGSVGElement>) {
    if (drawMode === 'F') return;
    const pt = toViewBox(e);
    setPts(prev => {
      if (prev.length === 0) return [{ ...pt, cmd: 'M' }];
      const lastCmd = prev.at(-1)!.cmd;
      if (drawMode === 'Q') {
        return lastCmd === 'Q_ctrl'
          ? [...prev, { ...pt, cmd: 'Q_end' }]
          : [...prev, { ...pt, cmd: 'Q_ctrl' }];
      }
      return [...prev, { ...pt, cmd: 'L' }];
    });
  }

  // ── Stroke management ─────────────────────────────────────────────────────────

  function endStroke() {
    if (drawMode === 'F') return;
    if (pts.length < 2) return;
    const path = buildPath(pts);
    if (path) setDone(prev => [...prev, path]);
    setPts([]);
  }

  function undo() {
    if (pts.length > 0) {
      setPts(prev => {
        const last = prev.at(-1)!;
        return last.cmd === 'Q_end' ? prev.slice(0, -2) : prev.slice(0, -1);
      });
    } else if (done.length > 0) {
      setDone(prev => prev.slice(0, -1));
    }
  }

  function clearAll() {
    setPts([]);
    setDone([]);
    setIsDrawing(false);
    setRawPtsDisplay([]);
    rawPtsRef.current = [];
  }

  function moveStroke(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= done.length) return;
    setDone(prev => {
      const arr = [...prev];
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return arr;
    });
  }

  function deleteStroke(i: number) {
    setDone(prev => prev.filter((_, idx) => idx !== i));
  }

  // ── Code generation ───────────────────────────────────────────────────────────

  function generateCode(): string {
    const all = [...done];
    if (pts.length >= 2) all.push(buildPath(pts));
    if (!all.length) return '// (尚未繪製任何筆畫)';
    return all.map(p => `    '${p}',`).join('\n');
  }

  async function copyCode() {
    await navigator.clipboard.writeText(generateCode());
    setCopyLabel('已複製！');
    setTimeout(() => setCopyLabel('複製程式碼'), 2000);
  }

  // ── Keyboard shortcuts (after all function declarations) ─────────────────────
  useEffect(() => {
    if (!selected) return;
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      switch (e.key) {
        case 'Enter': endStroke(); break;
        case 'Backspace': e.preventDefault(); undo(); break;
        case 'f': case 'F': setDrawMode('F'); break;
        case 'l': case 'L': setDrawMode('L'); break;
        case 'q': case 'Q': setDrawMode('Q'); break;
        case 'ArrowLeft':  navigate(-1); break;
        case 'ArrowRight': navigate(1); break;
        case 'Escape':     closeEditor(); break;
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // ── Grid view ─────────────────────────────────────────────────────────────────

  return (
    <div style={{ padding: 20, backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: '1.3rem', margin: '0 0 4px' }}>注音符號筆順審校</h1>
        <p style={{ color: '#888', fontSize: '0.82rem', margin: 0 }}>點擊符號進入繪制模式 · 參考：教育部國語小字典</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 10 }}>
        {BOPOMOFO_SYMBOLS.map(sym => {
          const strokes = STROKE_DATA[sym.id] ?? [];
          return (
            <button
              key={sym.id}
              data-symbol-id={sym.id}
              onClick={() => openEditor(sym)}
              style={{
                background: '#fff', border: `2px solid ${sym.color}55`,
                borderRadius: 10, padding: '8px 8px 10px', cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: '0.65rem', color: '#bbb', fontFamily: 'monospace', marginBottom: 4, textAlign: 'left' }}>
                {sym.id} · {strokes.length}畫
              </div>
              <div style={{ position: 'relative', width: '100%', paddingBottom: '100%' }}>
                <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                  {/* Ghost using SVG text — aligned to viewBox center */}
                  <text
                    x="50" y="50" fontSize="85" textAnchor="middle" dominantBaseline="central"
                    fill="#E8E8E8" fontWeight="700" style={{ userSelect: 'none', pointerEvents: 'none' }}
                  >
                    {sym.symbol}
                  </text>
                  {strokes.map((p, i) => (
                    <path key={i} d={p} stroke={sym.color} strokeWidth={8}
                      strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={0.75} />
                  ))}
                </svg>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Editor modal ── */}
      {selected && (
        <div
          onClick={closeEditor}
          style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: 12,
          }}
        >
          <div
            data-editor-modal
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: '#fff', borderRadius: 16, padding: 20,
              width: '100%', maxWidth: 750, boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
              maxHeight: '95vh', overflowY: 'auto',
            }}
          >

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <button onClick={() => navigate(-1)} style={navBtn} data-nav="prev">←</button>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <span style={{ fontSize: '2rem', fontWeight: 700, color: selected.color }}
                  data-current-symbol>{selected.symbol}</span>
                <span style={{ color: '#aaa', marginLeft: 8, fontSize: '0.85rem' }}>{selected.id}</span>
              </div>
              <button onClick={() => navigate(1)} style={navBtn} data-nav="next">→</button>
              <button onClick={closeEditor} style={{ ...navBtn, marginLeft: 8 }}>✕</button>
            </div>

            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>

              {/* ── Canvas column ── */}
              <div style={{ flex: '0 0 auto' }}>

                {/* Mode toggle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, fontSize: '0.78rem', color: '#888' }}>
                  模式：
                  <button onClick={() => setDrawMode('F')} style={modeBtn(drawMode === 'F', selected.color)} data-mode="F">徒手 F</button>
                  <button onClick={() => setDrawMode('L')} style={modeBtn(drawMode === 'L', selected.color)} data-mode="L">直線 L</button>
                  <button onClick={() => setDrawMode('Q')} style={modeBtn(drawMode === 'Q', selected.color)} data-mode="Q">曲線 Q</button>
                  <span style={{ color: '#bbb', fontSize: '0.72rem' }}>
                    {drawMode === 'F' && (isDrawing ? '繪制中…' : '按住拖曳')}
                    {drawMode === 'Q' && (pendingCtrl ? '→ 再點終點' : '→ 先點控制點')}
                  </span>
                </div>

                {/* Drawing canvas */}
                <div style={{ position: 'relative', width: 360, height: 360 }}>
                  <svg
                    ref={svgRef}
                    data-drawing-canvas
                    viewBox="0 0 100 100"
                    width={360}
                    height={360}
                    style={{
                      position: 'absolute', inset: 0,
                      cursor: drawMode === 'F' ? (isDrawing ? 'crosshair' : 'cell') : 'crosshair',
                      borderRadius: 12,
                      border: `2px solid ${selected.color}44`,
                      backgroundColor: '#FAFAFA',
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                    }}
                    onClick={handleClick}
                    onMouseDown={handleSvgMouseDown}
                    onMouseMove={handleSvgMouseMove}
                    onMouseUp={handleSvgMouseUp}
                    onMouseLeave={() => { setHover(null); }}
                  >
                    {/* Ghost character — SVG text centered in viewBox */}
                    <text
                      x="50" y="50" fontSize="85" textAnchor="middle" dominantBaseline="central"
                      fill="#EBEBEB" fontWeight="700"
                      style={{ userSelect: 'none', pointerEvents: 'none' }}
                    >
                      {selected.symbol}
                    </text>

                    {/* Grid */}
                    {[20, 40, 60, 80].flatMap(v => [
                      <line key={`h${v}`} x1={0} y1={v} x2={100} y2={v} stroke="#DDD" strokeWidth={0.4} />,
                      <line key={`v${v}`} x1={v} y1={0} x2={v} y2={100} stroke="#DDD" strokeWidth={0.4} />,
                    ])}
                    <line x1={50} y1={0} x2={50} y2={100} stroke="#CCC" strokeWidth={0.6} />
                    <line x1={0} y1={50} x2={100} y2={50} stroke="#CCC" strokeWidth={0.6} />

                    {/* Completed strokes with sequence number badges */}
                    {done.map((p, i) => {
                      const sp = pathStart(p);
                      return (
                        <g key={`done-${i}`} data-stroke={i}>
                          <path d={p} stroke={selected.color} strokeWidth={7}
                            strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={0.65} />
                          {sp && (
                            <>
                              <circle cx={sp.x} cy={sp.y} r={7} fill={selected.color} opacity={0.9} />
                              <text
                                x={sp.x} y={sp.y} textAnchor="middle" dominantBaseline="central"
                                fontSize="7" fill="#fff" fontWeight="700"
                                style={{ pointerEvents: 'none', userSelect: 'none' }}
                              >
                                {i + 1}
                              </text>
                            </>
                          )}
                        </g>
                      );
                    })}

                    {/* Current stroke in L/Q mode */}
                    {currentPath && (
                      <path d={currentPath} stroke={selected.color} strokeWidth={7}
                        strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={1} />
                    )}

                    {/* Freehand preview while dragging */}
                    {freehandPreview && (
                      <path d={freehandPreview} stroke={selected.color} strokeWidth={7}
                        strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={0.9} />
                    )}

                    {/* Q-mode curve preview */}
                    {hover && pendingCtrl && lastPt && (
                      <path
                        d={`M ${lastPt.x},${lastPt.y} Q ${pendingCtrl.x},${pendingCtrl.y} ${hover.x},${hover.y}`}
                        stroke={selected.color} strokeWidth={2} strokeDasharray="4 3"
                        strokeLinecap="round" fill="none" opacity={0.45}
                      />
                    )}

                    {/* Straight-line preview in L/Q mode */}
                    {hover && lastPt && !pendingCtrl && pts.length > 0 && drawMode !== 'F' && (
                      <line x1={lastPt.x} y1={lastPt.y} x2={hover.x} y2={hover.y}
                        stroke={selected.color} strokeWidth={2} strokeDasharray="4 3" opacity={0.45} />
                    )}

                    {/* Q-mode control point indicator */}
                    {pendingCtrl && (
                      <>
                        <circle cx={pendingCtrl.x} cy={pendingCtrl.y} r={4}
                          fill="none" stroke={selected.color} strokeWidth={1.5} strokeDasharray="2 2" />
                        {lastPt && (
                          <line x1={lastPt.x} y1={lastPt.y} x2={pendingCtrl.x} y2={pendingCtrl.y}
                            stroke={selected.color} strokeWidth={1} strokeDasharray="2 2" opacity={0.5} />
                        )}
                      </>
                    )}

                    {/* L/Q mode point dots */}
                    {pts.map((p, i) => (
                      <circle key={`pt-${i}`} cx={p.x} cy={p.y}
                        r={p.cmd === 'Q_ctrl' ? 3 : 3.5}
                        fill={p.cmd === 'Q_ctrl' ? 'transparent' : selected.color}
                        stroke={selected.color} strokeWidth={1.5} opacity={0.85}
                      />
                    ))}

                    {/* Hover dot */}
                    {hover && (
                      <circle cx={hover.x} cy={hover.y} r={3} fill={selected.color} opacity={0.35} />
                    )}
                  </svg>
                </div>

                {/* Coordinate readout */}
                <div style={{ marginTop: 5, textAlign: 'center', fontFamily: 'monospace', fontSize: '0.72rem', color: '#bbb', height: 16 }}>
                  {hover ? `x:${hover.x}  y:${hover.y}` : ''}
                </div>

                {/* Toolbar */}
                <div style={{ display: 'flex', gap: 8, marginTop: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                  {drawMode !== 'F' && (
                    <button onClick={endStroke} disabled={pts.length < 2}
                      style={toolBtn(pts.length >= 2, selected.color)} data-action="end-stroke">
                      完成此畫 ({done.length + 1})
                    </button>
                  )}
                  <button onClick={undo} style={toolBtn(pts.length > 0 || done.length > 0, '#777')} data-action="undo">
                    上一步 ⌫
                  </button>
                  <button onClick={clearAll} style={toolBtn(pts.length > 0 || done.length > 0, '#d9534f')} data-action="clear">
                    全部清除
                  </button>
                </div>

                <div style={{ marginTop: 6, textAlign: 'center', fontSize: '0.72rem', color: '#bbb' }}>
                  已完成 <span data-done-count>{done.length}</span> 畫
                </div>

                {/* Keyboard shortcut hint */}
                <div style={{ marginTop: 8, fontSize: '0.68rem', color: '#ccc', textAlign: 'center', lineHeight: 1.8 }}>
                  <kbd style={kbdStyle}>F</kbd>/<kbd style={kbdStyle}>L</kbd>/<kbd style={kbdStyle}>Q</kbd> 切模式 ·{' '}
                  <kbd style={kbdStyle}>Enter</kbd> 完成畫 ·{' '}
                  <kbd style={kbdStyle}>⌫</kbd> 上一步 ·{' '}
                  <kbd style={kbdStyle}>←</kbd>/<kbd style={kbdStyle}>→</kbd> 換字 ·{' '}
                  <kbd style={kbdStyle}>Esc</kbd> 關閉
                </div>
              </div>

              {/* ── Right column ── */}
              <div style={{ flex: 1, minWidth: 200, display: 'flex', flexDirection: 'column', gap: 12 }}>

                {/* Stroke reorder / delete list */}
                {done.length > 0 && (
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#aaa', marginBottom: 6, fontWeight: 600 }}>
                      筆畫清單（可調順序或刪除）
                    </div>
                    <div data-stroke-list>
                      {done.map((p, i) => (
                        <div key={i} style={{
                          display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4,
                          background: '#f8f8f8', borderRadius: 6, padding: '4px 6px',
                        }}>
                          <span style={{
                            width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                            backgroundColor: selected.color, color: '#fff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.68rem', fontWeight: 700,
                          }}>{i + 1}</span>
                          <span style={{
                            flex: 1, fontFamily: 'monospace', fontSize: '0.65rem', color: '#999',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}>
                            {p}
                          </span>
                          <button onClick={() => moveStroke(i, -1)} disabled={i === 0}
                            style={smallBtn(i > 0)}>↑</button>
                          <button onClick={() => moveStroke(i, 1)} disabled={i === done.length - 1}
                            style={smallBtn(i < done.length - 1)}>↓</button>
                          <button onClick={() => deleteStroke(i)}
                            style={smallBtn(true, '#d9534f')}>✕</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Code output */}
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#888', marginBottom: 6 }}>
                    貼到{' '}
                    <code style={{ background: '#f0f0f0', padding: '1px 5px', borderRadius: 3 }}>strokeData.ts</code>{' '}
                    的{' '}
                    <code style={{ background: '#f0f0f0', padding: '1px 5px', borderRadius: 3 }}>{selected.id}:</code>{' '}
                    項目：
                  </div>
                  <textarea
                    readOnly
                    value={generateCode()}
                    data-code-output
                    style={{
                      width: '100%', height: 160, fontFamily: 'monospace', fontSize: '0.76rem',
                      backgroundColor: '#1e1e2e', color: '#cdd6f4',
                      border: 'none', borderRadius: 8, padding: '10px 12px',
                      resize: 'none', boxSizing: 'border-box', lineHeight: 1.7,
                    }}
                  />
                  <button onClick={copyCode} data-action="copy" style={{
                    marginTop: 8, width: '100%', height: 38,
                    backgroundColor: selected.color, color: '#fff',
                    border: 'none', borderRadius: 8, cursor: 'pointer',
                    fontSize: '0.88rem', fontWeight: 700,
                  }}>
                    {copyLabel}
                  </button>
                </div>

                {/* Usage hints */}
                <div style={{ fontSize: '0.74rem', color: '#aaa', lineHeight: 2 }}>
                  <div>● <strong>徒手 F</strong>：按住滑鼠拖曳，放開自動完成一畫（自動簡化）</div>
                  <div>● <strong>直線 L</strong>：點擊加入端點，Enter 完成一畫</div>
                  <div>● <strong>曲線 Q</strong>：第1點=控制點（空心圓），第2點=終點</div>
                  <div>● 完成後複製程式碼，貼入{' '}
                    <code style={{ background: '#f0f0f0', color: '#555', padding: '1px 4px', borderRadius: 3 }}>
                      strokeData.ts
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Style helpers ─────────────────────────────────────────────────────────────

const navBtn: React.CSSProperties = {
  width: 34, height: 34, borderRadius: 8,
  border: '1px solid #ddd', backgroundColor: '#f5f5f5',
  cursor: 'pointer', fontSize: '1rem', flexShrink: 0,
};

const kbdStyle: React.CSSProperties = {
  display: 'inline-block', background: '#eee', border: '1px solid #ccc',
  borderRadius: 3, padding: '0 4px', fontSize: '0.65rem', color: '#777',
};

function modeBtn(active: boolean, color: string): React.CSSProperties {
  return {
    padding: '3px 12px', borderRadius: 6, border: 'none', cursor: 'pointer',
    fontSize: '0.78rem', fontWeight: 600,
    backgroundColor: active ? color : '#eee',
    color: active ? '#fff' : '#666',
  };
}

function toolBtn(enabled: boolean, color: string): React.CSSProperties {
  return {
    padding: '7px 16px', borderRadius: 8, border: 'none',
    backgroundColor: enabled ? color : '#eee',
    color: enabled ? '#fff' : '#ccc',
    cursor: enabled ? 'pointer' : 'default',
    fontSize: '0.82rem', fontWeight: 600,
  };
}

function smallBtn(enabled: boolean, color = '#888'): React.CSSProperties {
  return {
    width: 22, height: 22, borderRadius: 4, border: 'none', padding: 0,
    backgroundColor: enabled ? color : '#eee',
    color: enabled ? '#fff' : '#ccc',
    cursor: enabled ? 'pointer' : 'default',
    fontSize: '0.68rem', fontWeight: 700, flexShrink: 0,
  };
}
