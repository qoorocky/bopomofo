import { useMemo, useState } from 'react';
import { useProgressStore } from '../../stores/useProgressStore';
import { getDueSymbolIds } from '../../lib/spacedRepetition';
import { BOPOMOFO_SYMBOLS, getSymbolById } from '../../constants/bopomofo';
import { COLORS, BORDER_RADIUS, SHADOW } from '../../styles/theme';

const ALL_IDS = BOPOMOFO_SYMBOLS.map((s) => s.id);
const MAX_VISIBLE = 12;

interface DailyReviewCardProps {
  onSelect: (id: string) => void;
}

export default function DailyReviewCard({ onSelect }: DailyReviewCardProps) {
  const lastReviewedAt = useProgressStore((s) => s.lastReviewedAt);
  const reviewCount = useProgressStore((s) => s.reviewCount);
  const symbolStatus = useProgressStore((s) => s.symbolStatus);

  // Capture `now` once per mount so useMemo stays stable across renders
  const [now] = useState(() => Date.now());

  const dueIds = useMemo(
    () => getDueSymbolIds(ALL_IDS, { lastReviewedAt, reviewCount, symbolStatus }, now),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lastReviewedAt, reviewCount, symbolStatus],
  );

  const visibleIds = dueIds.slice(0, MAX_VISIBLE);
  const remaining = dueIds.length - visibleIds.length;

  return (
    <div
      style={{
        backgroundColor: 'rgba(255,255,255,0.72)',
        borderRadius: BORDER_RADIUS.lg,
        padding: '16px 16px 14px',
        boxShadow: SHADOW.md,
        backdropFilter: 'blur(6px)',
        width: '100%',
        maxWidth: 360,
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 12,
        }}
      >
        <span style={{ fontSize: '1.1rem' }}>📅</span>
        <span
          style={{
            fontWeight: 700,
            fontSize: '1rem',
            color: COLORS.text,
          }}
        >
          今日複習
        </span>
        <span
          style={{
            marginLeft: 'auto',
            backgroundColor: dueIds.length === 0 ? '#4ECDC4' : COLORS.primary,
            color: COLORS.white,
            borderRadius: 99,
            padding: '2px 10px',
            fontSize: '0.82rem',
            fontWeight: 700,
            minWidth: 24,
            textAlign: 'center',
          }}
        >
          {dueIds.length}
        </span>
      </div>

      {/* Symbol tiles or empty state */}
      {dueIds.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            color: COLORS.textLight,
            fontSize: '0.9rem',
            padding: '8px 0 4px',
          }}
        >
          今天沒有要複習的注音 🎉
        </div>
      ) : (
        <>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
            }}
          >
            {visibleIds.map((id) => {
              const sym = getSymbolById(id);
              if (!sym) return null;
              return (
                <button
                  key={id}
                  onClick={() => onSelect(id)}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: BORDER_RADIUS.md,
                    backgroundColor: sym.color + '22',
                    border: `2px solid ${sym.color}66`,
                    color: sym.color,
                    fontSize: '1.4rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    touchAction: 'manipulation',
                    transition: 'transform 0.12s ease',
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  aria-label={`複習 ${sym.symbol}`}
                >
                  {sym.symbol}
                </button>
              );
            })}

            {remaining > 0 && (
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: BORDER_RADIUS.md,
                  backgroundColor: 'rgba(0,0,0,0.05)',
                  color: COLORS.textLight,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                +{remaining}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
