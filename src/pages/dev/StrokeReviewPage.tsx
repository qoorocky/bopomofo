// DEV ONLY — interactive stroke path editor
import { useState } from 'react';
import { BOPOMOFO_SYMBOLS } from '../../constants/bopomofo';
import type { BopomofoSymbol } from '../../constants/bopomofo';
import { STROKE_DATA } from '../../constants/strokeData';

// ── Types ─────────────────────────────────────────────────────────────────────

type Point = { x: number; y: number };
type Cmd = 'M' | 'L' | 'Q_ctrl' | 'Q_end';
type PtEntry = Point & { cmd: Cmd };

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Snap to nearest even integer for clean numbers */
function snap(v: number) {
  return Math.round(v / 2) * 2;
}

/** Convert SVG mouse event to 0-100 viewBox coordinates */
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
      // Skip incomplete Q_ctrl (no end yet)
    }
    i++;
  }
  return d;
}

/** Last non-Q_ctrl endpoint in the array */
function lastEndPoint(pts: PtEntry[]): Point | null {
  for (let i = pts.length - 1; i >= 0; i--) {
    const c = pts[i].cmd;
    if (c === 'M' || c === 'L' || c === 'Q_end') return pts[i];
  }
  return null;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function StrokeReviewPage() {
  const [selected, setSelected] = useState<BopomofoSymbol | null>(null);
  const [done, setDone] = useState<string[]>([]);   // completed stroke paths
  const [pts, setPts] = useState<PtEntry[]>([]);    // current stroke in progress
  const [curveMode, setCurveMode] = useState(false);
  const [hover, setHover] = useState<Point | null>(null);
  const [copyLabel, setCopyLabel] = useState('複製程式碼');

  // ── Derived ──────────────────────────────────────────────────────────────────
  const currentPath = buildPath(pts);
  const pendingCtrl = pts.at(-1)?.cmd === 'Q_ctrl' ? pts.at(-1)! : null;
  const lastPt = lastEndPoint(pts); // endpoint before any pending Q_ctrl

  // ── Handlers ─────────────────────────────────────────────────────────────────

  function openEditor(sym: BopomofoSymbol) {
    setSelected(sym);
    setDone(STROKE_DATA[sym.id] ?? []);
    setPts([]);
    setCurveMode(false);
    setHover(null);
  }

  function closeEditor() {
    setSelected(null);
    setDone([]);
    setPts([]);
    setHover(null);
  }

  function navigate(dir: -1 | 1) {
    if (!selected) return;
    const idx = BOPOMOFO_SYMBOLS.findIndex(s => s.id === selected.id);
    const next = BOPOMOFO_SYMBOLS[idx + dir];
    if (next) openEditor(next);
  }

  function handleClick(e: React.MouseEvent<SVGSVGElement>) {
    const pt = toViewBox(e);
    setPts(prev => {
      if (prev.length === 0) return [{ ...pt, cmd: 'M' }];
      const lastCmd = prev.at(-1)!.cmd;
      if (curveMode) {
        return lastCmd === 'Q_ctrl'
          ? [...prev, { ...pt, cmd: 'Q_end' }]
          : [...prev, { ...pt, cmd: 'Q_ctrl' }];
      }
      return [...prev, { ...pt, cmd: 'L' }];
    });
  }

  function endStroke() {
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
  }

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

  // ── Grid view ─────────────────────────────────────────────────────────────────

  return (
    <div style={{ padding: 20, backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: '1.3rem', margin: '0 0 4px' }}>注音符號筆順審校</h1>
        <p style={{ color: '#888', fontSize: '0.82rem', margin: 0 }}>點擊符號進入滑鼠繪制模式</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 10 }}>
        {BOPOMOFO_SYMBOLS.map(sym => {
          const strokes = STROKE_DATA[sym.id] ?? [];
          return (
            <button key={sym.id} onClick={() => openEditor(sym)} style={{
              background: '#fff', border: `2px solid ${sym.color}55`,
              borderRadius: 10, padding: '8px 8px 10px', cursor: 'pointer',
            }}>
              <div style={{ fontSize: '0.65rem', color: '#bbb', fontFamily: 'monospace', marginBottom: 4, textAlign: 'left' }}>
                {sym.id} · {strokes.length}畫
              </div>
              <div style={{ position: 'relative', width: '100%', paddingBottom: '100%' }}>
                <div style={{
                  position: 'absolute', inset: 0, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: '3rem', color: '#E8E8E8', fontWeight: 700, lineHeight: 1,
                }}>
                  {sym.symbol}
                </div>
                <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
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
          <div onClick={e => e.stopPropagation()} style={{
            backgroundColor: '#fff', borderRadius: 16, padding: 20,
            width: '100%', maxWidth: 700, boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
            maxHeight: '95vh', overflowY: 'auto',
          }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <button onClick={() => navigate(-1)} style={navBtn}>←</button>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <span style={{ fontSize: '2rem', fontWeight: 700, color: selected.color }}>{selected.symbol}</span>
                <span style={{ color: '#aaa', marginLeft: 8, fontSize: '0.85rem' }}>{selected.id}</span>
              </div>
              <button onClick={() => navigate(1)} style={navBtn}>→</button>
              <button onClick={closeEditor} style={{ ...navBtn, marginLeft: 8 }}>✕</button>
            </div>

            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>

              {/* ── Canvas column ── */}
              <div style={{ flex: '0 0 auto' }}>
                {/* Mode toggle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, fontSize: '0.78rem', color: '#888' }}>
                  模式：
                  <button
                    onClick={() => setCurveMode(false)}
                    style={modeBtn(!curveMode, selected.color)}
                  >直線 L</button>
                  <button
                    onClick={() => setCurveMode(true)}
                    style={modeBtn(curveMode, selected.color)}
                  >曲線 Q</button>
                  {curveMode && (
                    <span style={{ color: '#bbb', fontSize: '0.72rem' }}>
                      {pendingCtrl ? '→ 再點終點' : '→ 先點控制點'}
                    </span>
                  )}
                </div>

                {/* Drawing area */}
                <div style={{ position: 'relative', width: 360, height: 360 }}>
                  {/* Faint reference character (HTML layer behind SVG) */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '260px', color: '#EBEBEB', fontWeight: 700, lineHeight: 1,
                    pointerEvents: 'none', userSelect: 'none',
                  }}>
                    {selected.symbol}
                  </div>

                  {/* SVG canvas */}
                  <svg
                    viewBox="0 0 100 100"
                    width={360}
                    height={360}
                    style={{
                      position: 'absolute', inset: 0,
                      cursor: 'crosshair',
                      borderRadius: 12,
                      border: `2px solid ${selected.color}44`,
                      backgroundColor: 'transparent',
                    }}
                    onClick={handleClick}
                    onMouseMove={e => setHover(toViewBox(e))}
                    onMouseLeave={() => setHover(null)}
                  >
                    {/* Grid */}
                    {[20, 40, 60, 80].flatMap(v => [
                      <line key={`h${v}`} x1={0} y1={v} x2={100} y2={v} stroke="#DDD" strokeWidth={0.4} />,
                      <line key={`v${v}`} x1={v} y1={0} x2={v} y2={100} stroke="#DDD" strokeWidth={0.4} />,
                    ])}
                    <line x1={50} y1={0} x2={50} y2={100} stroke="#CCC" strokeWidth={0.6} />
                    <line x1={0} y1={50} x2={100} y2={50} stroke="#CCC" strokeWidth={0.6} />

                    {/* Completed strokes */}
                    {done.map((p, i) => (
                      <path key={`done-${i}`} d={p} stroke={selected.color} strokeWidth={7}
                        strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={0.65} />
                    ))}

                    {/* Current stroke */}
                    {currentPath && (
                      <path d={currentPath} stroke={selected.color} strokeWidth={7}
                        strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={1} />
                    )}

                    {/* Preview: Q curve when ctrl point is pending */}
                    {hover && pendingCtrl && lastPt && (
                      <path
                        d={`M ${lastPt.x},${lastPt.y} Q ${pendingCtrl.x},${pendingCtrl.y} ${hover.x},${hover.y}`}
                        stroke={selected.color} strokeWidth={2} strokeDasharray="4 3"
                        strokeLinecap="round" fill="none" opacity={0.45}
                      />
                    )}

                    {/* Preview: straight line in non-Q mode (or Q mode before ctrl) */}
                    {hover && lastPt && !pendingCtrl && pts.length > 0 && (
                      <line x1={lastPt.x} y1={lastPt.y} x2={hover.x} y2={hover.y}
                        stroke={selected.color} strokeWidth={2} strokeDasharray="4 3" opacity={0.45} />
                    )}

                    {/* Control point marker */}
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

                    {/* Point dots on current stroke */}
                    {pts.map((p, i) => (
                      <circle key={`pt-${i}`} cx={p.x} cy={p.y}
                        r={p.cmd === 'Q_ctrl' ? 3 : 3.5}
                        fill={p.cmd === 'Q_ctrl' ? 'transparent' : selected.color}
                        stroke={selected.color} strokeWidth={1.5} opacity={0.85}
                      />
                    ))}

                    {/* Hover dot */}
                    {hover && (
                      <circle cx={hover.x} cy={hover.y} r={3}
                        fill={selected.color} opacity={0.35} />
                    )}
                  </svg>
                </div>

                {/* Coordinate readout */}
                <div style={{ marginTop: 5, textAlign: 'center', fontFamily: 'monospace', fontSize: '0.72rem', color: '#bbb', height: 16 }}>
                  {hover ? `x:${hover.x}  y:${hover.y}` : ''}
                </div>

                {/* Toolbar */}
                <div style={{ display: 'flex', gap: 8, marginTop: 10, justifyContent: 'center' }}>
                  <button onClick={endStroke} disabled={pts.length < 2} style={toolBtn(pts.length >= 2, selected.color)}>
                    完成此畫 ({done.length + 1})
                  </button>
                  <button onClick={undo} style={toolBtn(pts.length > 0 || done.length > 0, '#777')}>
                    上一步
                  </button>
                  <button onClick={clearAll} style={toolBtn(pts.length > 0 || done.length > 0, '#d9534f')}>
                    全部清除
                  </button>
                </div>

                <div style={{ marginTop: 6, textAlign: 'center', fontSize: '0.72rem', color: '#bbb' }}>
                  已完成 {done.length} 畫 · 進行中 {pts.length} 點
                </div>
              </div>

              {/* ── Output column ── */}
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontSize: '0.78rem', color: '#888', marginBottom: 6 }}>
                  貼到 <code style={{ background: '#f0f0f0', padding: '1px 5px', borderRadius: 3 }}>strokeData.ts</code> 的 <code style={{ background: '#f0f0f0', padding: '1px 5px', borderRadius: 3 }}>{selected.id}:</code> 項目：
                </div>
                <textarea
                  readOnly
                  value={generateCode()}
                  style={{
                    width: '100%', height: 200, fontFamily: 'monospace', fontSize: '0.76rem',
                    backgroundColor: '#1e1e2e', color: '#cdd6f4',
                    border: 'none', borderRadius: 8, padding: '10px 12px',
                    resize: 'none', boxSizing: 'border-box', lineHeight: 1.7,
                  }}
                />
                <button onClick={copyCode} style={{
                  marginTop: 8, width: '100%', height: 38,
                  backgroundColor: selected.color, color: '#fff',
                  border: 'none', borderRadius: 8, cursor: 'pointer',
                  fontSize: '0.88rem', fontWeight: 700,
                }}>
                  {copyLabel}
                </button>

                <div style={{ marginTop: 14, fontSize: '0.74rem', color: '#aaa', lineHeight: 1.8 }}>
                  <div>● <strong>直線 L</strong>：點擊加入下一個端點</div>
                  <div>● <strong>曲線 Q</strong>：第1點=控制點（空心圓），第2點=終點</div>
                  <div>● <strong>完成此畫</strong>：結束目前這一畫，開始繪下一畫</div>
                  <div>● <strong>上一步</strong>：移除最後一個點或整畫</div>
                  <div>● 座標自動對齊偶數格，格線每 20 單位一條</div>
                  <div style={{ marginTop: 8, color: '#ccc' }}>
                    繪好後複製程式碼，手動貼入<br />
                    <code style={{ background: '#f0f0f0', color: '#555', padding: '1px 4px', borderRadius: 3 }}>
                      src/constants/strokeData.ts
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
