import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSymbolById } from '../../constants/bopomofo';
import { useProgressStore } from '../../stores/useProgressStore';
import { useAudio } from '../../hooks/useAudio';
import { COLORS, BORDER_RADIUS, SHADOW } from '../../styles/theme';
import { IconClose, IconSpeaker, IconStar } from '../common/SvgIcons';

interface BopomofoCardProps {
  symbolId: string;
  allSymbolIds: string[];
  onClose: () => void;
}

export default function BopomofoCard({ symbolId, allSymbolIds, onClose }: BopomofoCardProps) {
  const [currentSymbolId, setCurrentSymbolId] = useState(symbolId);
  const markLearning = useProgressStore((s) => s.markLearning);
  const markMastered = useProgressStore((s) => s.markMastered);
  const markPhonemeHeard = useProgressStore((s) => s.markPhonemeHeard);
  const phonemeHeard = useProgressStore((s) => s.phonemeHeard);
  const addStars = useProgressStore((s) => s.addStars);
  const { playWord, playPhoneme } = useAudio();

  const symbol = getSymbolById(currentSymbolId);
  const currentIndex = allSymbolIds.indexOf(currentSymbolId);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < allSymbolIds.length - 1;

  // Start at phoneme step unless already heard before
  const [step, setStep] = useState<'phoneme' | 'word'>(
    phonemeHeard[currentSymbolId] ? 'word' : 'phoneme'
  );

  // On symbol change: reset step, mark learning, auto-play phoneme
  useEffect(() => {
    const nextStep = phonemeHeard[currentSymbolId] ? 'word' : 'phoneme';
    setStep(nextStep);
    markLearning(currentSymbolId);
    const sym = getSymbolById(currentSymbolId);
    if (sym) {
      if (nextStep === 'phoneme') {
        setTimeout(() => playPhoneme(sym.symbol), 300);
      } else {
        setTimeout(() => playWord(sym.exampleWord), 300);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSymbolId]);

  function handleNextStep() {
    if (!symbol) return;
    markPhonemeHeard(symbol.id);
    setStep('word');
    setTimeout(() => playWord(symbol.exampleWord), 200);
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
        <motion.div
          key={`card-${currentSymbolId}`}
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: COLORS.white,
            borderRadius: 24,
            padding: 32,
            maxWidth: 360,
            width: '100%',
            position: 'relative',
            boxShadow: SHADOW.lg,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
          }}
        >
          {/* Close */}
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
              fontSize: '1.25rem',
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

          {/* Step indicator */}
          <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              backgroundColor: COLORS.primary,
            }} />
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              backgroundColor: step === 'word' ? COLORS.secondary : '#DDDDDD',
            }} />
          </div>

          <AnimatePresence mode="wait">
            {step === 'phoneme' ? (
              <motion.div
                key="phoneme"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: '100%' }}
              >
                {/* Step label */}
                <div style={{ fontSize: '0.85rem', color: '#999', fontWeight: 600 }}>
                  第一步：認識發音
                </div>

                {/* Large symbol */}
                <div style={{ fontSize: '7rem', fontWeight: 700, color: symbol.color, lineHeight: 1 }}>
                  {symbol.symbol}
                </div>

                {/* Hint */}
                <div style={{
                  fontSize: '1rem',
                  color: COLORS.text,
                  textAlign: 'center',
                  lineHeight: 1.5,
                  padding: '0 8px',
                }}>
                  這是 <strong style={{ color: symbol.color }}>{symbol.symbol}</strong> 的聲音，跟著唸唸看！
                </div>

                {/* Play phoneme button */}
                <button
                  onClick={() => playPhoneme(symbol.symbol)}
                  style={{
                    height: 80,
                    width: 80,
                    borderRadius: '50%',
                    backgroundColor: COLORS.primary,
                    color: COLORS.white,
                    border: 'none',
                    fontSize: '2.25rem',
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

                {/* Next step button — always enabled */}
                <button
                  onClick={handleNextStep}
                  style={{
                    height: 56,
                    minWidth: 180,
                    borderRadius: BORDER_RADIUS.lg,
                    backgroundColor: COLORS.secondary,
                    color: COLORS.white,
                    border: 'none',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    touchAction: 'manipulation',
                    boxShadow: SHADOW.sm,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  下一步 →
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="word"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: '100%' }}
              >
                {/* Step label */}
                <div style={{ fontSize: '0.85rem', color: '#999', fontWeight: 600 }}>
                  第二步：詞彙連結
                </div>

                {/* Symbol (smaller) + emoji + word */}
                <div style={{ fontSize: '3.5rem', fontWeight: 700, color: symbol.color, lineHeight: 1 }}>
                  {symbol.symbol}
                </div>
                <div style={{ fontSize: '4rem', lineHeight: 1 }}>{symbol.exampleEmoji}</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: COLORS.text }}>
                  {symbol.exampleWord}
                </div>

                {/* Hint */}
                <div style={{
                  fontSize: '0.95rem',
                  color: '#666',
                  textAlign: 'center',
                  lineHeight: 1.5,
                  padding: '0 8px',
                }}>
                  <strong style={{ color: symbol.color }}>{symbol.exampleWord}</strong> 的第一個音就是 <strong style={{ color: symbol.color }}>{symbol.symbol}</strong>！
                </div>

                {/* Play word button */}
                <button
                  onClick={() => playWord(symbol.exampleWord)}
                  style={{
                    height: 72,
                    minWidth: 160,
                    borderRadius: BORDER_RADIUS.lg,
                    backgroundColor: COLORS.primary,
                    color: COLORS.white,
                    border: 'none',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    touchAction: 'manipulation',
                    boxShadow: SHADOW.md,
                  }}
                >
                  <IconSpeaker size={24} color={COLORS.white} />
                  播放
                </button>

                {/* Mastered button */}
                <button
                  onClick={handleMastered}
                  style={{
                    height: 56,
                    minWidth: 160,
                    borderRadius: BORDER_RADIUS.lg,
                    backgroundColor: COLORS.accent,
                    color: COLORS.text,
                    border: 'none',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    touchAction: 'manipulation',
                    boxShadow: SHADOW.sm,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  已學會！
                  <IconStar size={20} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Symbol navigation */}
          {allSymbolIds.length > 1 && (
            <div style={{ display: 'flex', gap: 16, width: '100%', justifyContent: 'space-between', marginTop: 4 }}>
              <button
                onClick={handlePrev}
                disabled={!hasPrev}
                style={{
                  height: 48,
                  minWidth: 80,
                  borderRadius: BORDER_RADIUS.md,
                  border: '2px solid #E0E0E0',
                  backgroundColor: hasPrev ? '#F8F8F8' : '#F0F0F0',
                  color: hasPrev ? COLORS.text : '#CCCCCC',
                  fontSize: '1.5rem',
                  cursor: hasPrev ? 'pointer' : 'default',
                  touchAction: 'manipulation',
                  opacity: hasPrev ? 1 : 0.4,
                }}
                aria-label="Previous symbol"
              >
                ←
              </button>
              <span style={{ display: 'flex', alignItems: 'center', fontSize: '0.9rem', color: '#999' }}>
                {currentIndex + 1} / {allSymbolIds.length}
              </span>
              <button
                onClick={handleNext}
                disabled={!hasNext}
                style={{
                  height: 48,
                  minWidth: 80,
                  borderRadius: BORDER_RADIUS.md,
                  border: '2px solid #E0E0E0',
                  backgroundColor: hasNext ? '#F8F8F8' : '#F0F0F0',
                  color: hasNext ? COLORS.text : '#CCCCCC',
                  fontSize: '1.5rem',
                  cursor: hasNext ? 'pointer' : 'default',
                  touchAction: 'manipulation',
                  opacity: hasNext ? 1 : 0.4,
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
