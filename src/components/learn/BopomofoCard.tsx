import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { getSymbolById } from '../../constants/bopomofo';
import { useProgressStore } from '../../stores/useProgressStore';
import { useAudio } from '../../hooks/useAudio';
import { COLORS, BORDER_RADIUS, SHADOW } from '../../styles/theme';
import { IconClose, IconSpeaker, IconStar, IconThumbUp, IconPencil, IconArrowRight } from '../common/SvgIcons';
import StrokeOrderDisplay from './StrokeOrderDisplay';

interface BopomofoCardProps {
  symbolId: string;
  allSymbolIds: string[];
  onClose: () => void;
  mode?: 'phoneme' | 'stroke';
}

export default function BopomofoCard({ symbolId, allSymbolIds, onClose, mode = 'phoneme' }: BopomofoCardProps) {
  const [currentSymbolId, setCurrentSymbolId] = useState(symbolId);
  const markLearning = useProgressStore((s) => s.markLearning);
  const markMastered = useProgressStore((s) => s.markMastered);
  const markPhonemeHeard = useProgressStore((s) => s.markPhonemeHeard);
  const phonemeHeard = useProgressStore((s) => s.phonemeHeard);
  const addStars = useProgressStore((s) => s.addStars);
  const recordReview = useProgressStore((s) => s.recordReview);
  const { playWord, playPhoneme, playSfx } = useAudio();

  const symbol = getSymbolById(currentSymbolId);
  const currentIndex = allSymbolIds.indexOf(currentSymbolId);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < allSymbolIds.length - 1;

  const [displaySide, setDisplaySide] = useState<'phoneme' | 'word' | 'stroke'>(
    mode === 'stroke' ? 'stroke' : (phonemeHeard[currentSymbolId] ? 'word' : 'phoneme'),
  );
  const flipControls = useAnimation();
  const isFlipping = useRef(false);

  // On symbol change: snap back to correct side, mark learning, record review, auto-play
  useEffect(() => {
    flipControls.set({ rotateY: 0 });
    isFlipping.current = false;
    const nextSide = mode === 'stroke' ? 'stroke' : (phonemeHeard[currentSymbolId] ? 'word' : 'phoneme');
    setDisplaySide(nextSide);
    markLearning(currentSymbolId);
    recordReview(currentSymbolId);
    const sym = getSymbolById(currentSymbolId);
    if (sym && nextSide !== 'stroke') {
      if (nextSide === 'phoneme') {
        setTimeout(() => playPhoneme(sym.symbol), 300);
      } else {
        setTimeout(() => playWord(sym.exampleWord), 300);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSymbolId]);

  async function handleFlip() {
    if (isFlipping.current || !symbol || displaySide === 'stroke') return;
    isFlipping.current = true;
    playSfx('flip');

    // Phase 1: fold away (0° → 90°)
    await flipControls.start({
      rotateY: 90,
      transition: { duration: 0.18, ease: 'easeIn' },
    });

    // Swap content at the invisible midpoint
    const nextSide = displaySide === 'phoneme' ? 'word' : 'phoneme';
    setDisplaySide(nextSide);
    if (nextSide === 'word') {
      markPhonemeHeard(symbol.id);
      setTimeout(() => playWord(symbol.exampleWord), 200);
    } else {
      setTimeout(() => playPhoneme(symbol.symbol), 200);
    }

    // Phase 2: unfold from the other side (−90° → 0°)
    flipControls.set({ rotateY: -90 });
    await flipControls.start({
      rotateY: 0,
      transition: { duration: 0.18, ease: 'easeOut' },
    });

    isFlipping.current = false;
  }

  function handlePrev() {
    if (hasPrev) setCurrentSymbolId(allSymbolIds[currentIndex - 1]);
  }

  function handleNext() {
    if (hasNext) setCurrentSymbolId(allSymbolIds[currentIndex + 1]);
  }

  function handleMastered() {
    if (symbol) {
      markMastered(symbol.id);
      addStars(2);
      playSfx('levelUp');
    }
    onClose();
  }

  function handlePhonemeComplete() {
    if (symbol) {
      addStars(1);
      playSfx('correct');
    }
    onClose();
  }

  if (!symbol) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
        }}
      >
        {/* Outer wrapper — entrance animation, stops backdrop click */}
        <motion.div
          key={`modal-${currentSymbolId}`}
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            maxWidth: 360,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
          }}
        >
          {/* Dot indicators — hidden in stroke mode */}
          {mode !== 'stroke' && (
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => {
                  if (displaySide !== 'phoneme') {
                    setDisplaySide('phoneme');
                    flipControls.set({ rotateY: 0 });
                    isFlipping.current = false;
                  }
                }}
                title="注音"
                style={{
                  width: 10, height: 10, borderRadius: '50%',
                  backgroundColor: displaySide === 'phoneme' ? COLORS.primary : 'rgba(255,255,255,0.4)',
                  border: 'none',
                  cursor: displaySide !== 'phoneme' ? 'pointer' : 'default',
                  padding: 0,
                  touchAction: 'manipulation',
                  transition: 'background-color 0.2s',
                }}
              />
              <button
                onClick={() => {
                  if (displaySide !== 'word') {
                    setDisplaySide('word');
                    flipControls.set({ rotateY: 0 });
                    isFlipping.current = false;
                  }
                }}
                title="詞彙"
                style={{
                  width: 10, height: 10, borderRadius: '50%',
                  backgroundColor: displaySide === 'word' ? COLORS.secondary : 'rgba(255,255,255,0.4)',
                  border: 'none',
                  cursor: displaySide !== 'word' ? 'pointer' : 'default',
                  padding: 0,
                  touchAction: 'manipulation',
                  transition: 'background-color 0.2s',
                }}
              />
              {/* stroke dot only in non-phoneme mode (legacy / full mode) */}
              {mode !== 'phoneme' && (
                <button
                  onClick={() => setDisplaySide('stroke')}
                  title="寫字練習"
                  style={{
                    width: 10, height: 10, borderRadius: '50%',
                    backgroundColor: displaySide === 'stroke' ? COLORS.accent : 'rgba(255,255,255,0.4)',
                    border: 'none',
                    cursor: displaySide !== 'stroke' ? 'pointer' : 'default',
                    padding: 0,
                    touchAction: 'manipulation',
                    transition: 'background-color 0.2s',
                  }}
                />
              )}
            </div>
          )}

          {/* Flip card (phoneme / word) or Stroke practice panel */}
          {displaySide !== 'stroke' ? (
            <div style={{ perspective: '1200px', width: '100%' }}>
              <motion.div
                animate={flipControls}
                onClick={handleFlip}
                style={{
                  background: COLORS.white,
                  borderRadius: 24,
                  padding: '40px 32px 28px',
                  width: '100%',
                  position: 'relative',
                  boxShadow: SHADOW.lg,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 16,
                  cursor: 'pointer',
                  transformOrigin: 'center center',
                  boxSizing: 'border-box',
                }}
              >
                {/* Close — stopPropagation so it never triggers flip */}
                <button
                  onClick={(e) => { e.stopPropagation(); onClose(); }}
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    width: 44,
                    height: 44,
                    borderRadius: BORDER_RADIUS.xl,
                    border: 'none',
                    backgroundColor: '#F0F0F0',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    touchAction: 'manipulation',
                  }}
                  aria-label="Close"
                >
                  <IconClose size={18} color="#666" />
                </button>

                {/* ── Front face: 認識發音 ── */}
                {displaySide === 'phoneme' && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, width: '100%' }}>
                    <div style={{ fontSize: '7rem', fontWeight: 700, color: symbol.color, lineHeight: 1 }}>
                      {symbol.symbol}
                    </div>

                    <button
                      onClick={(e) => { e.stopPropagation(); playPhoneme(symbol.symbol); }}
                      style={{
                        height: 80, width: 80,
                        borderRadius: '50%',
                        backgroundColor: COLORS.primary,
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        touchAction: 'manipulation',
                        boxShadow: SHADOW.md,
                      }}
                      aria-label="Play phoneme"
                    >
                      <IconSpeaker size={32} color={COLORS.white} />
                    </button>

                    <motion.div
                      animate={{ x: [0, 6, 0] }}
                      transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
                      style={{ color: '#C8C8C8' }}
                    >
                      <IconArrowRight size={28} color="#C8C8C8" />
                    </motion.div>
                  </div>
                )}

                {/* ── Back face: 詞彙連結 ── */}
                {displaySide === 'word' && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: '3rem', fontWeight: 700, color: symbol.color, lineHeight: 1 }}>
                        {symbol.symbol}
                      </span>
                      <IconArrowRight size={24} color="#CCC" />
                      <span style={{ fontSize: '3rem', lineHeight: 1 }}>{symbol.exampleEmoji}</span>
                      <span style={{ fontSize: '1.75rem', fontWeight: 700, color: COLORS.text }}>
                        {symbol.exampleWord}
                      </span>
                    </div>

                    <button
                      onClick={(e) => { e.stopPropagation(); playWord(symbol.exampleWord); }}
                      style={{
                        height: 72, width: 72,
                        borderRadius: '50%',
                        backgroundColor: COLORS.primary,
                        color: COLORS.white,
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        touchAction: 'manipulation',
                        boxShadow: SHADOW.md,
                      }}
                      aria-label="Play word"
                    >
                      <IconSpeaker size={28} color={COLORS.white} />
                    </button>

                    {mode === 'phoneme' ? (
                      <button
                        onClick={(e) => { e.stopPropagation(); handlePhonemeComplete(); }}
                        style={{
                          height: 64, width: 64,
                          borderRadius: '50%',
                          backgroundColor: COLORS.accent,
                          border: 'none',
                          cursor: 'pointer',
                          touchAction: 'manipulation',
                          boxShadow: SHADOW.sm,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        aria-label="完成"
                      >
                        <IconThumbUp size={30} color={COLORS.text} />
                      </button>
                    ) : (
                      <button
                        onClick={(e) => { e.stopPropagation(); setDisplaySide('stroke'); }}
                        style={{
                          height: 64, width: 64,
                          borderRadius: '50%',
                          backgroundColor: COLORS.accent,
                          border: 'none',
                          cursor: 'pointer',
                          touchAction: 'manipulation',
                          boxShadow: SHADOW.sm,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        aria-label="寫字練習"
                      >
                        <IconPencil size={30} color={COLORS.text} />
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            </div>
          ) : (
            /* ── Third step: 寫字練習 ── */
            <div
              style={{
                background: COLORS.white,
                borderRadius: 24,
                padding: '32px 28px 28px',
                width: '100%',
                position: 'relative',
                boxShadow: SHADOW.lg,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 16,
                boxSizing: 'border-box',
              }}
            >
              <button
                onClick={onClose}
                style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  width: 44,
                  height: 44,
                  borderRadius: BORDER_RADIUS.xl,
                  border: 'none',
                  backgroundColor: '#F0F0F0',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  touchAction: 'manipulation',
                }}
                aria-label="Close"
              >
                <IconClose size={18} color="#666" />
              </button>

              {mode === 'stroke' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 700, color: symbol.color, lineHeight: 1 }}>
                    {symbol.symbol}
                  </div>
                  <IconPencil size={22} color="#BBBBBB" />
                </div>
              ) : (
                <IconPencil size={22} color="#BBBBBB" />
              )}

              <StrokeOrderDisplay
                symbolId={symbol.id}
                symbol={symbol.symbol}
                color={symbol.color}
              />

              <button
                onClick={handleMastered}
                style={{
                  height: 72, width: 72,
                  borderRadius: '50%',
                  backgroundColor: COLORS.accent,
                  border: 'none',
                  cursor: 'pointer',
                  touchAction: 'manipulation',
                  boxShadow: SHADOW.sm,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                aria-label="我學會了"
              >
                <IconStar size={32} />
              </button>
            </div>
          )}

          {/* Symbol navigation — outside the card, on dark backdrop */}
          {allSymbolIds.length > 1 && (
            <div style={{ display: 'flex', gap: 16, width: '100%', justifyContent: 'space-between' }}>
              <button
                onClick={handlePrev}
                disabled={!hasPrev}
                style={{
                  height: 48, minWidth: 80,
                  borderRadius: BORDER_RADIUS.md,
                  border: '2px solid rgba(255,255,255,0.25)',
                  backgroundColor: hasPrev ? 'rgba(255,255,255,0.12)' : 'transparent',
                  color: hasPrev ? COLORS.white : 'rgba(255,255,255,0.25)',
                  fontSize: '1.5rem',
                  cursor: hasPrev ? 'pointer' : 'default',
                  touchAction: 'manipulation',
                }}
                aria-label="Previous symbol"
              >
                ←
              </button>
              <span style={{ display: 'flex', alignItems: 'center', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>
                {currentIndex + 1} / {allSymbolIds.length}
              </span>
              <button
                onClick={handleNext}
                disabled={!hasNext}
                style={{
                  height: 48, minWidth: 80,
                  borderRadius: BORDER_RADIUS.md,
                  border: '2px solid rgba(255,255,255,0.25)',
                  backgroundColor: hasNext ? 'rgba(255,255,255,0.12)' : 'transparent',
                  color: hasNext ? COLORS.white : 'rgba(255,255,255,0.25)',
                  fontSize: '1.5rem',
                  cursor: hasNext ? 'pointer' : 'default',
                  touchAction: 'manipulation',
                }}
                aria-label="Next symbol"
              >
                →
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
