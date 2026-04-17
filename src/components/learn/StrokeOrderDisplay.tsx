import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { STROKE_DATA } from '../../constants/strokeData';
import { COLORS, BORDER_RADIUS, SHADOW } from '../../styles/theme';
import { IconEye, IconPencil, IconPlay, IconReplay } from '../common/SvgIcons';
import HandwritingCanvas from './HandwritingCanvas';

interface Props {
  symbolId: string;
  symbol: string;
  color: string;
}

export default function StrokeOrderDisplay({ symbolId, symbol, color }: Props) {
  const strokes = STROKE_DATA[symbolId] ?? [];
  const [revealed, setRevealed] = useState(0);
  const [replayKey, setReplayKey] = useState(0);
  const [mode, setMode] = useState<'watch' | 'practice'>('watch');

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

      {/* Mode tabs */}
      <div style={{
        display: 'flex',
        borderRadius: BORDER_RADIUS.md,
        backgroundColor: '#F0F0F0',
        padding: 3,
        gap: 2,
        width: '100%',
      }}>
        {(['watch', 'practice'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            aria-label={m === 'watch' ? '示範' : '練習'}
            style={{
              flex: 1,
              height: 40,
              borderRadius: '9px',
              border: 'none',
              backgroundColor: mode === m ? COLORS.white : 'transparent',
              cursor: 'pointer',
              touchAction: 'manipulation',
              boxShadow: mode === m ? SHADOW.sm : 'none',
              transition: 'all 0.18s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {m === 'watch'
              ? <IconEye size={22} color={mode === m ? COLORS.text : COLORS.textLight} />
              : <IconPencil size={22} color={mode === m ? COLORS.text : COLORS.textLight} />}
          </button>
        ))}
      </div>

      {mode === 'watch' ? (
        <>
          {/* Animation canvas */}
          <div
            role="button"
            tabIndex={0}
            onClick={!allDone ? nextStroke : undefined}
            onKeyDown={(e) => { if (!allDone && (e.key === 'Enter' || e.key === ' ')) nextStroke(); }}
            style={{
              width: '100%',
              aspectRatio: '1 / 1',
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

            {/* Tap hint overlay */}
            {revealed === 0 && (
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
              }}>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                >
                  <IconPlay size={48} color="rgba(180,180,180,0.7)" />
                </motion.div>
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
              aria-label={revealed === 0 ? '開始示範' : '繼續示範'}
              style={{
                width: 56, height: 56,
                borderRadius: '50%',
                backgroundColor: revealed === 0 ? color : COLORS.secondary,
                border: 'none',
                cursor: 'pointer',
                touchAction: 'manipulation',
                boxShadow: SHADOW.sm,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <IconPlay size={24} color={COLORS.white} />
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={replay}
                aria-label="重新播放"
                style={{
                  width: 52, height: 52,
                  borderRadius: '50%',
                  backgroundColor: 'transparent',
                  border: `2px solid ${color}`,
                  cursor: 'pointer',
                  touchAction: 'manipulation',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <IconReplay size={22} color={color} />
              </button>
              <button
                onClick={() => setMode('practice')}
                aria-label="開始練習"
                style={{
                  width: 52, height: 52,
                  borderRadius: '50%',
                  backgroundColor: color,
                  border: 'none',
                  cursor: 'pointer',
                  touchAction: 'manipulation',
                  boxShadow: SHADOW.sm,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <IconPencil size={22} color={COLORS.white} />
              </button>
            </div>
          )}
        </>
      ) : (
        <HandwritingCanvas refPaths={strokes} accentColor={color} />
      )}
    </div>
  );
}
