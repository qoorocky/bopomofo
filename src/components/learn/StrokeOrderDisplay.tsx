import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { STROKE_DATA } from '../../constants/strokeData';
import { COLORS, BORDER_RADIUS, SHADOW } from '../../styles/theme';

interface Props {
  symbolId: string;
  symbol: string;
  color: string;
}

export default function StrokeOrderDisplay({ symbolId, symbol, color }: Props) {
  const strokes = STROKE_DATA[symbolId] ?? [];
  const [revealed, setRevealed] = useState(0);
  const [replayKey, setReplayKey] = useState(0);

  // Auto-reveal first stroke shortly after mount / replay
  useEffect(() => {
    if (strokes.length === 0) return;
    const t = setTimeout(() => setRevealed(1), 500);
    return () => clearTimeout(t);
  }, [replayKey, strokes.length]);

  function nextStroke() {
    if (revealed < strokes.length) setRevealed((n) => n + 1);
  }

  function replay() {
    setRevealed(0);
    setReplayKey((k) => k + 1);
  }

  const allDone = revealed >= strokes.length && strokes.length > 0;

  if (strokes.length === 0) {
    return (
      <div style={{ textAlign: 'center', color: '#AAA', padding: '20px 0', fontSize: '0.9rem' }}>
        此符號的筆畫資料準備中…
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, width: '100%' }}>

      {/* Canvas */}
      <div
        role="button"
        tabIndex={0}
        onClick={!allDone ? nextStroke : undefined}
        onKeyDown={(e) => { if (!allDone && (e.key === 'Enter' || e.key === ' ')) nextStroke(); }}
        style={{
          width: 200,
          height: 200,
          borderRadius: BORDER_RADIUS.lg,
          backgroundColor: '#F8F8F8',
          border: `2px solid ${allDone ? color : '#E8E8E8'}`,
          position: 'relative',
          cursor: allDone ? 'default' : 'pointer',
          transition: 'border-color 0.3s',
          boxShadow: SHADOW.sm,
          overflow: 'hidden',
          userSelect: 'none',
        }}
      >
        {/* Faint reference character */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '7.5rem',
          color: '#EBEBEB',
          fontWeight: 700,
          lineHeight: 1,
          pointerEvents: 'none',
        }}>
          {symbol}
        </div>

        {/* Animated strokes */}
        <svg
          viewBox="0 0 100 100"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        >
          {strokes.map((path, i) => {
            if (i >= revealed) return null;
            const isNewest = i === revealed - 1;
            return (
              <motion.path
                key={`${replayKey}-${i}`}
                d={path}
                stroke={isNewest ? color : `${color}66`}
                strokeWidth={8}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
              />
            );
          })}
        </svg>

        {/* Tap hint overlay when nothing is revealed yet */}
        {revealed === 0 && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{ fontSize: '0.8rem', color: '#BBB', backgroundColor: 'rgba(255,255,255,0.85)', padding: '4px 10px', borderRadius: 20 }}>
              點擊開始
            </span>
          </div>
        )}
      </div>

      {/* Progress dots + label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {strokes.map((_, i) => (
            <div
              key={i}
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: i < revealed ? color : '#DDDDDD',
                transition: 'background-color 0.2s',
              }}
            />
          ))}
        </div>
        <span style={{ fontSize: '0.82rem', color: '#999' }}>
          {revealed === 0
            ? '準備好了嗎？'
            : allDone
            ? `全 ${strokes.length} 畫完成！`
            : `第 ${revealed} / ${strokes.length} 畫`}
        </span>
      </div>

      {/* Action button */}
      {!allDone ? (
        <button
          onClick={nextStroke}
          style={{
            height: 48,
            minWidth: 148,
            borderRadius: BORDER_RADIUS.md,
            backgroundColor: revealed === 0 ? color : COLORS.secondary,
            color: COLORS.white,
            border: 'none',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: 'pointer',
            touchAction: 'manipulation',
            boxShadow: SHADOW.sm,
          }}
        >
          {revealed === 0 ? '開始練習' : '下一畫 →'}
        </button>
      ) : (
        <button
          onClick={replay}
          style={{
            height: 44,
            minWidth: 130,
            borderRadius: BORDER_RADIUS.md,
            backgroundColor: 'transparent',
            color: color,
            border: `2px solid ${color}`,
            fontSize: '0.95rem',
            fontWeight: 700,
            cursor: 'pointer',
            touchAction: 'manipulation',
          }}
        >
          重新播放
        </button>
      )}
    </div>
  );
}
