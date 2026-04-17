import { useState } from 'react';
import { motion } from 'framer-motion';
import { BOPOMOFO_SYMBOLS, type BopomofoSymbol } from '../constants/bopomofo';
import { useProgressStore } from '../stores/useProgressStore';
import { COLORS, BORDER_RADIUS, SHADOW } from '../styles/theme';
import BopomofoCard from '../components/learn/BopomofoCard';

type LearnMode = 'phoneme' | 'stroke';

const STATUS_BORDER: Record<string, string> = {
  new: '#CCCCCC',
  learning: '#FFC851',
  mastered: '#4ECDC4',
};

function SymbolTile({ symbol, status, onClick }: {
  symbol: BopomofoSymbol;
  status: 'new' | 'learning' | 'mastered';
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.92 }}
      style={{
        minWidth: 72,
        minHeight: 72,
        borderRadius: BORDER_RADIUS.md,
        backgroundColor: symbol.color,
        border: `3px solid ${STATUS_BORDER[status]}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        cursor: 'pointer',
        touchAction: 'manipulation',
        boxShadow: SHADOW.sm,
        padding: 4,
      }}
      className="no-select"
    >
      <span style={{ fontSize: '1.75rem', fontWeight: 700, color: COLORS.white, lineHeight: 1 }}>
        {symbol.symbol}
      </span>
      <span style={{ fontSize: '1rem', lineHeight: 1 }}>{symbol.exampleEmoji}</span>
    </motion.button>
  );
}

function SymbolSection({
  title,
  symbols,
  onTileClick,
}: {
  title: string;
  symbols: BopomofoSymbol[];
  onTileClick: (sym: BopomofoSymbol) => void;
}) {
  const symbolStatus = useProgressStore((s) => s.symbolStatus);

  const handleTileClick = (sym: BopomofoSymbol) => {
    onTileClick(sym);
  };

  return (
    <section style={{ marginBottom: 32 }}>
      <h2
        style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          color: COLORS.text,
          marginBottom: 12,
          paddingLeft: 4,
        }}
      >
        {title}
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))',
          gap: 10,
        }}
      >
        {symbols.map((sym, i) => (
          <motion.div
            key={sym.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.3 }}
          >
            <SymbolTile
              symbol={sym}
              status={symbolStatus[sym.id] ?? 'new'}
              onClick={() => handleTileClick(sym)}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default function LearnPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [learnMode, setLearnMode] = useState<LearnMode>('phoneme');
  const markLearning = useProgressStore((s) => s.markLearning);

  const consonants = BOPOMOFO_SYMBOLS.filter((s) => s.group === 'consonant');
  const vowels = BOPOMOFO_SYMBOLS.filter((s) => s.group === 'vowel');
  const allIds = BOPOMOFO_SYMBOLS.map((s) => s.id);

  function handleTileClick(sym: BopomofoSymbol) {
    markLearning(sym.id);
    setSelectedId(sym.id);
  }

  return (
    <div style={{ padding: '24px 16px 16px' }}>
      <motion.h1
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          fontSize: '1.75rem',
          fontWeight: 700,
          color: COLORS.text,
          textAlign: 'center',
          marginBottom: 16,
        }}
      >
        學習注音
      </motion.h1>

      {/* Mode toggle */}
      <div style={{
        display: 'flex',
        borderRadius: BORDER_RADIUS.md,
        backgroundColor: '#F0F0F0',
        padding: 3,
        gap: 2,
        marginBottom: 24,
      }}>
        {(['phoneme', 'stroke'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setLearnMode(m)}
            style={{
              flex: 1,
              height: 42,
              borderRadius: '9px',
              border: 'none',
              backgroundColor: learnMode === m ? COLORS.white : 'transparent',
              color: learnMode === m ? COLORS.text : COLORS.textLight,
              fontWeight: learnMode === m ? 700 : 500,
              fontSize: '1rem',
              cursor: 'pointer',
              touchAction: 'manipulation',
              boxShadow: learnMode === m ? SHADOW.sm : 'none',
              transition: 'all 0.18s',
            }}
          >
            {m === 'phoneme' ? '🔊 發音練習' : '✏️ 寫字練習'}
          </button>
        ))}
      </div>

      <SymbolSection title="聲母（子音）" symbols={consonants} onTileClick={handleTileClick} />
      <SymbolSection title="韻母（母音）" symbols={vowels} onTileClick={handleTileClick} />

      {selectedId && (
        <BopomofoCard
          symbolId={selectedId}
          allSymbolIds={allIds}
          onClose={() => setSelectedId(null)}
          mode={learnMode}
        />
      )}
    </div>
  );
}
