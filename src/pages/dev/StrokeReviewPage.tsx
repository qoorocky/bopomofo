// DEV ONLY — not included in production builds (route is gated behind import.meta.env.DEV)
import { BOPOMOFO_SYMBOLS } from '../../constants/bopomofo';
import { STROKE_DATA } from '../../constants/strokeData';

export default function StrokeReviewPage() {
  return (
    <div style={{ padding: 24, backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: '1.4rem', margin: '0 0 6px' }}>注音符號筆順審校</h1>
        <p style={{ color: '#888', fontSize: '0.85rem', margin: 0 }}>
          DEV ONLY — 底圖為字形（灰色），彩色線條為 SVG 路徑。路徑應與字形重疊。
        </p>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))',
          gap: 14,
        }}
      >
        {BOPOMOFO_SYMBOLS.map((sym) => {
          const strokes = STROKE_DATA[sym.id] ?? [];
          return (
            <div
              key={sym.id}
              style={{
                backgroundColor: '#fff',
                borderRadius: 10,
                padding: '10px 12px 12px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
              }}
            >
              <div style={{ fontSize: '0.72rem', color: '#aaa', marginBottom: 6, fontFamily: 'monospace' }}>
                {sym.id} · {sym.symbol} · {strokes.length} 畫
              </div>

              {/* Canvas */}
              <div
                style={{
                  position: 'relative',
                  width: 130,
                  height: 130,
                  margin: '0 auto',
                  backgroundColor: '#f8f8f8',
                  borderRadius: 8,
                  overflow: 'hidden',
                  border: `2px solid ${sym.color}33`,
                }}
              >
                {/* Faint reference character */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '5.5rem',
                    color: '#E0E0E0',
                    fontWeight: 700,
                    lineHeight: 1,
                    pointerEvents: 'none',
                  }}
                >
                  {sym.symbol}
                </div>

                {/* SVG stroke paths — all shown simultaneously for review */}
                <svg
                  viewBox="0 0 100 100"
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                >
                  {strokes.map((path, i) => (
                    <path
                      key={i}
                      d={path}
                      stroke={sym.color}
                      strokeWidth={8}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                      opacity={0.8}
                    />
                  ))}
                </svg>

                {/* Stroke number labels */}
                {strokes.length === 0 && (
                  <div style={{
                    position: 'absolute', inset: 0, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', color: '#ccc',
                  }}>
                    無資料
                  </div>
                )}
              </div>

              {/* Per-stroke path preview */}
              <div style={{ marginTop: 8 }}>
                {strokes.map((path, i) => (
                  <div
                    key={i}
                    style={{
                      fontSize: '0.6rem',
                      color: '#bbb',
                      fontFamily: 'monospace',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      lineHeight: 1.4,
                    }}
                  >
                    {i + 1}. {path.substring(0, 30)}{path.length > 30 ? '…' : ''}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
