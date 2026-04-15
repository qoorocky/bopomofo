import { motion } from 'framer-motion';
import { BOPOMOFO_SYMBOLS } from '../constants/bopomofo';
import { useProgressStore } from '../stores/useProgressStore';
import { COLORS, BORDER_RADIUS, SHADOW } from '../styles/theme';
import { IconStar } from '../components/common/SvgIcons';

const STATUS_CONFIG = {
  new: { bg: '#E8E8E8', color: '#999999', label: '未學習' },
  learning: { bg: '#FFF3CD', color: '#856404', label: '學習中' },
  mastered: { bg: '#D1F2EB', color: '#0B7A5E', label: '已掌握' },
} as const;

export default function ProgressPage() {
  const totalStars = useProgressStore((s) => s.totalStars);
  const symbolStatus = useProgressStore((s) => s.symbolStatus);
  const gameScores = useProgressStore((s) => s.gameScores);
  const resetProgress = useProgressStore((s) => s.resetProgress);

  const masteredCount = Object.values(symbolStatus).filter((v) => v === 'mastered').length;
  const learningCount = Object.values(symbolStatus).filter((v) => v === 'learning').length;

  const handleReset = () => {
    if (window.confirm('確定要重置所有進度嗎？')) {
      resetProgress();
    }
  };

  return (
    <div style={{ padding: '24px 16px 16px' }}>
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          fontSize: '1.75rem',
          fontWeight: 700,
          color: COLORS.text,
          textAlign: 'center',
          marginBottom: 24,
        }}
      >
        我的成績
      </motion.h1>

      {/* Stars display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        style={{
          backgroundColor: COLORS.white,
          borderRadius: BORDER_RADIUS.xl,
          padding: '20px 24px',
          textAlign: 'center',
          boxShadow: SHADOW.md,
          marginBottom: 20,
        }}
      >
        <div style={{ lineHeight: 1, marginBottom: 8, display: 'flex', justifyContent: 'center' }}>
          <IconStar size={56} />
        </div>
        <div
          style={{
            fontSize: '3rem',
            fontWeight: 700,
            color: COLORS.accent,
            lineHeight: 1,
            marginBottom: 4,
          }}
        >
          {totalStars}
        </div>
        <div style={{ color: COLORS.textLight, fontSize: '0.95rem' }}>顆星星</div>
      </motion.div>

      {/* Summary stats */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 10,
          marginBottom: 24,
        }}
      >
        {[
          { label: '已掌握', count: masteredCount, color: '#0B7A5E', bg: '#D1F2EB' },
          { label: '學習中', count: learningCount, color: '#856404', bg: '#FFF3CD' },
          { label: '未學習', count: 37 - masteredCount - learningCount, color: '#666', bg: '#E8E8E8' },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              backgroundColor: stat.bg,
              borderRadius: BORDER_RADIUS.md,
              padding: '12px 8px',
              textAlign: 'center',
              boxShadow: SHADOW.sm,
            }}
          >
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: stat.color }}>
              {stat.count}
            </div>
            <div style={{ fontSize: '0.75rem', color: stat.color }}>{stat.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Game scores */}
      {Object.keys(gameScores).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          style={{ marginBottom: 24 }}
        >
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.text, marginBottom: 12 }}>
            遊戲最高分
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { id: 'listen', name: '聽音選字' },
              { id: 'drag',   name: '拖拉配對' },
              { id: 'memory', name: '翻牌記憶' },
              { id: 'tone',   name: '聲調練習' },
            ]
              .filter((g) => gameScores[g.id] !== undefined)
              .map((g) => (
                <div
                  key={g.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: COLORS.white,
                    borderRadius: BORDER_RADIUS.md,
                    padding: '10px 16px',
                    boxShadow: SHADOW.sm,
                  }}
                >
                  <span style={{ fontSize: '0.95rem', color: COLORS.text, fontWeight: 600 }}>
                    {g.name}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <IconStar size={18} />
                    <span style={{ fontSize: '1rem', fontWeight: 700, color: COLORS.accent }}>
                      {gameScores[g.id]}
                    </span>
                  </span>
                </div>
              ))}
          </div>
        </motion.div>
      )}

      {/* Symbol grid */}
      <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS.text, marginBottom: 12 }}>
        注音進度
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(64px, 1fr))',
          gap: 8,
          marginBottom: 32,
        }}
      >
        {BOPOMOFO_SYMBOLS.map((sym, i) => {
          const status = symbolStatus[sym.id] ?? 'new';
          const cfg = STATUS_CONFIG[status];
          return (
            <motion.div
              key={sym.id}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.02, duration: 0.25 }}
              title={`${sym.symbol} — ${cfg.label}`}
              style={{
                backgroundColor: cfg.bg,
                borderRadius: BORDER_RADIUS.sm,
                padding: '8px 4px',
                textAlign: 'center',
                boxShadow: SHADOW.sm,
              }}
              className="no-select"
            >
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: cfg.color, lineHeight: 1 }}>
                {sym.symbol}
              </div>
              <div style={{ fontSize: '0.6rem', color: cfg.color, marginTop: 2 }}>
                {sym.id}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Reset button */}
      <button
        onClick={handleReset}
        style={{
          display: 'block',
          width: '100%',
          padding: '14px',
          borderRadius: BORDER_RADIUS.lg,
          backgroundColor: 'transparent',
          border: `2px solid ${COLORS.primary}`,
          color: COLORS.primary,
          fontSize: '1rem',
          fontWeight: 700,
          cursor: 'pointer',
          touchAction: 'manipulation',
          transition: 'background-color 0.15s ease',
          marginBottom: 16,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = COLORS.primary;
          e.currentTarget.style.color = COLORS.white;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = COLORS.primary;
        }}
      >
        重置所有進度
      </button>
    </div>
  );
}
