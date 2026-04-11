import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { BOPOMOFO_SYMBOLS, type BopomofoSymbol } from '../../constants/bopomofo';
import { useAudio } from '../../hooks/useAudio';
import StarBurst from '../common/StarBurst';
import { COLORS, BORDER_RADIUS, SHADOW } from '../../styles/theme';
import { IconCards, IconStar } from '../common/SvgIcons';

interface MemoryFlipProps {
  onComplete: (stars: number) => void;
}

interface MemoryCard {
  id: string;
  symbolId: string;
  type: 'symbol' | 'emoji';
  flipped: boolean;
  matched: boolean;
  symbol: BopomofoSymbol;
}

function createCards(symbols: BopomofoSymbol[]): MemoryCard[] {
  const cards: MemoryCard[] = [];
  symbols.forEach((sym) => {
    cards.push({
      id: `${sym.id}-symbol`,
      symbolId: sym.id,
      type: 'symbol',
      flipped: false,
      matched: false,
      symbol: sym,
    });
    cards.push({
      id: `${sym.id}-emoji`,
      symbolId: sym.id,
      type: 'emoji',
      flipped: false,
      matched: false,
      symbol: sym,
    });
  });
  return cards.sort(() => Math.random() - 0.5);
}

function pickRandomSymbols(count: number): BopomofoSymbol[] {
  return [...BOPOMOFO_SYMBOLS].sort(() => Math.random() - 0.5).slice(0, count);
}

interface FlipCardProps {
  card: MemoryCard;
  onClick: () => void;
  disabled: boolean;
}

function FlipCard({ card, onClick, disabled }: FlipCardProps) {
  return (
    <div
      onClick={disabled || card.flipped || card.matched ? undefined : onClick}
      style={{
        width: '100%',
        aspectRatio: '1',
        perspective: 600,
        cursor: disabled || card.flipped || card.matched ? 'default' : 'pointer',
        position: 'relative',
        minHeight: 80,
      }}
    >
      <motion.div
        animate={{ rotateY: card.flipped || card.matched ? 180 : 0 }}
        transition={{ duration: 0.4 }}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Back face */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            borderRadius: BORDER_RADIUS.md,
            backgroundColor: card.matched ? '#D5F5E3' : COLORS.primary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: SHADOW.sm,
          }}
        >
          <span style={{ fontSize: '1.75rem', color: COLORS.white, fontWeight: 700 }}>？</span>
        </div>

        {/* Front face */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            borderRadius: BORDER_RADIUS.md,
            backgroundColor: card.matched ? '#D5F5E3' : COLORS.white,
            border: `2px solid ${card.matched ? '#2ECC71' : '#E0E0E0'}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            boxShadow: SHADOW.sm,
            padding: 4,
          }}
        >
          {card.type === 'symbol' ? (
            <>
              <span style={{ fontSize: '2.25rem', fontWeight: 700, color: card.symbol.color, lineHeight: 1 }}>
                {card.symbol.symbol}
              </span>
              <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>{card.symbol.exampleEmoji}</span>
            </>
          ) : (
            <>
              <span style={{ fontSize: '2.25rem', lineHeight: 1 }}>{card.symbol.exampleEmoji}</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: COLORS.text, lineHeight: 1.2, textAlign: 'center' }}>
                {card.symbol.exampleWord}
              </span>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function MemoryFlip({ onComplete }: MemoryFlipProps) {
  const { playEffect, playPhoneme, playWord } = useAudio();
  const [cards, setCards] = useState<MemoryCard[]>(() => createCards(pickRandomSymbols(6)));
  const [firstFlipped, setFirstFlipped] = useState<string | null>(null);
  const [canFlip, setCanFlip] = useState(true);
  const [wrongPairs, setWrongPairs] = useState(0);
  const [showBurst, setShowBurst] = useState(false);
  const [done, setDone] = useState(false);

  const handleCardClick = useCallback(
    (cardId: string) => {
      if (!canFlip) return;

      const card = cards.find((c) => c.id === cardId);
      if (!card || card.flipped || card.matched) return;

      // Play audio on flip
      if (card.type === 'symbol') {
        playPhoneme(card.symbol.symbol);
      } else {
        playWord(card.symbol.exampleWord);
      }

      if (firstFlipped === null) {
        setCards(cards.map((c) => (c.id === cardId ? { ...c, flipped: true } : c)));
        setFirstFlipped(cardId);
      } else {
        setCanFlip(false);
        const first = cards.find((c) => c.id === firstFlipped);
        if (!first) return;

        const flippedCards = cards.map((c) =>
          c.id === cardId ? { ...c, flipped: true } : c,
        );

        if (first.symbolId === card.symbolId) {
          // Match!
          const matchedCards = flippedCards.map((c) =>
            c.id === firstFlipped || c.id === cardId ? { ...c, flipped: true, matched: true } : c,
          );
          setCards(matchedCards);
          setFirstFlipped(null);
          setCanFlip(true);
          playEffect('correct');
          setShowBurst(true);
          if (matchedCards.every((c) => c.matched)) {
            setTimeout(() => setDone(true), 600);
          }
        } else {
          // No match
          setCards(flippedCards);
          playEffect('wrong');
          setWrongPairs((w) => w + 1);
          setTimeout(() => {
            setCards((c) =>
              c.map((card) =>
                card.id === firstFlipped || card.id === cardId
                  ? { ...card, flipped: false }
                  : card,
              ),
            );
            setFirstFlipped(null);
            setCanFlip(true);
          }, 1000);
        }
      }
    },
    [canFlip, cards, firstFlipped, playEffect, playPhoneme, playWord],
  );

  const finalScore = Math.max(1, 6 - wrongPairs);

  if (done) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          padding: 24,
          gap: 24,
          textAlign: 'center',
        }}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'center' }}>
            <IconCards size={56} color="#FFC851" />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: COLORS.text, marginBottom: 8 }}>
            全部配對成功！
          </h2>
          <p style={{ color: '#999', marginBottom: 8 }}>
            錯誤 {wrongPairs} 次
          </p>
          <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
            {Array.from({ length: finalScore }, (_, i) => (
              <IconStar key={i} size={28} />
            ))}
          </div>
        </motion.div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 280 }}>
          <button
            onClick={() => {
              setCards(createCards(pickRandomSymbols(6)));
              setFirstFlipped(null);
              setCanFlip(true);
              setWrongPairs(0);
              setDone(false);
              setShowBurst(false);
            }}
            style={{
              height: 56,
              borderRadius: BORDER_RADIUS.lg,
              backgroundColor: COLORS.primary,
              color: COLORS.white,
              border: 'none',
              fontSize: '1.1rem',
              fontWeight: 700,
              cursor: 'pointer',
              touchAction: 'manipulation',
              boxShadow: SHADOW.md,
            }}
          >
            再玩一次
          </button>
          <button
            onClick={() => onComplete(finalScore)}
            style={{
              height: 56,
              borderRadius: BORDER_RADIUS.lg,
              backgroundColor: COLORS.secondary,
              color: COLORS.white,
              border: 'none',
              fontSize: '1.1rem',
              fontWeight: 700,
              cursor: 'pointer',
              touchAction: 'manipulation',
              boxShadow: SHADOW.md,
            }}
          >
            回遊戲
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px 16px', maxWidth: 480, margin: '0 auto' }}>
      <StarBurst active={showBurst} onComplete={() => setShowBurst(false)} />

      <h2
        style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          color: COLORS.text,
          textAlign: 'center',
          marginBottom: 4,
        }}
      >
        翻牌記憶
      </h2>
      <p style={{ textAlign: 'center', color: '#999', fontSize: '0.9rem', marginBottom: 16 }}>
        找出配對的注音和圖片！
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 10,
        }}
      >
        {cards.map((card) => (
          <FlipCard
            key={card.id}
            card={card}
            onClick={() => handleCardClick(card.id)}
            disabled={!canFlip}
          />
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: 16, color: '#999', fontSize: '0.9rem' }}>
        已配對 {cards.filter((c) => c.matched).length / 2} / 6 對 · 錯誤 {wrongPairs} 次
      </div>
    </div>
  );
}
