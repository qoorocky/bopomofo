import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { BOPOMOFO_SYMBOLS, getSymbolById } from '../../constants/bopomofo';
import { SYLLABLE_COMBOS, buildRound, type SyllableCombo } from '../../constants/combos';
import { useAudio } from '../../hooks/useAudio';
import { COLORS, BORDER_RADIUS, SHADOW, FONT_SIZE } from '../../styles/theme';
import { IconStar } from '../common/SvgIcons';

// ── Constants ─────────────────────────────────────────────────────────────────

const CONSONANTS = BOPOMOFO_SYMBOLS.filter((s) => s.group === 'consonant');
const VOWELS = BOPOMOFO_SYMBOLS.filter((s) => s.group === 'vowel');

type QuizPhase = 'idle' | 'playing' | 'feedback' | 'done';

interface Props {
  onComplete: (stars: number) => void;
}

// ── TabBar ────────────────────────────────────────────────────────────────────

function TabBar({
  active,
  onChange,
}: {
  active: 'learn' | 'quiz';
  onChange: (tab: 'learn' | 'quiz') => void;
}) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        padding: '4px',
        backgroundColor: '#F0F0F0',
        borderRadius: BORDER_RADIUS.lg,
        marginBottom: 20,
      }}
    >
      {(['learn', 'quiz'] as const).map((tab) => (
        <motion.button
          key={tab}
          onClick={() => onChange(tab)}
          whileTap={{ scale: 0.96 }}
          style={{
            flex: 1,
            padding: '10px 0',
            borderRadius: '12px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: FONT_SIZE.md,
            touchAction: 'manipulation',
            transition: 'background-color 0.2s, color 0.2s',
            backgroundColor: active === tab ? COLORS.white : 'transparent',
            color: active === tab ? COLORS.text : COLORS.textLight,
            boxShadow: active === tab ? SHADOW.sm : 'none',
          }}
          className="no-select"
        >
          {tab === 'learn' ? '📖 學習' : '🎯 練習'}
        </motion.button>
      ))}
    </div>
  );
}

// ── ProgressDots ──────────────────────────────────────────────────────────────

function ProgressDots({ total, current }: { total: number; current: number }) {
  return (
    <div style={{ display: 'flex', gap: 5, justifyContent: 'center' }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: i <= current ? COLORS.primary : '#DDD',
            transition: 'background-color 0.2s',
          }}
        />
      ))}
    </div>
  );
}

// ── LearnComboCard ────────────────────────────────────────────────────────────

function LearnComboCard({ combo }: { combo: SyllableCombo }) {
  const { playWord } = useAudio();
  const firstTile = getSymbolById(combo.tileIds[0]);
  const accentColor = firstTile?.color ?? COLORS.primary;

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={() => playWord(combo.exampleWord)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 14px',
        borderRadius: BORDER_RADIUS.md,
        border: `1.5px solid ${accentColor}33`,
        backgroundColor: accentColor + '11',
        cursor: 'pointer',
        touchAction: 'manipulation',
        textAlign: 'left',
        width: '100%',
        minHeight: 60,
        boxSizing: 'border-box',
      }}
      className="no-select"
    >
      <span
        style={{
          fontSize: '1.6rem',
          fontWeight: 700,
          color: accentColor,
          minWidth: 56,
          letterSpacing: '-0.02em',
        }}
      >
        {combo.symbol}
      </span>
      <span style={{ fontSize: '1.3rem' }}>{combo.exampleEmoji}</span>
      <span style={{ fontSize: FONT_SIZE.md, fontWeight: 600, color: COLORS.text }}>
        {combo.exampleWord}
      </span>
      <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: COLORS.textLight }}>▶</span>
    </motion.button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ComboPractice({ onComplete }: Props) {
  const { playWord, playEffect } = useAudio();

  const [tab, setTab] = useState<'learn' | 'quiz'>('learn');
  const [phase, setPhase] = useState<QuizPhase>('idle');
  const [questions, setQuestions] = useState<SyllableCombo[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selection, setSelection] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hintActive, setHintActive] = useState(false);

  const shakeControls = useAnimation();
  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const ttsAvailable = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const currentQ = questions[currentIndex];

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
      if (ttsAvailable) window.speechSynthesis.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-play when new question appears
  useEffect(() => {
    if (phase !== 'playing' || !currentQ) return;
    const timer = setTimeout(() => playWord(currentQ.exampleWord), 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, phase]);

  // Auto-advance after feedback
  useEffect(() => {
    if (phase !== 'feedback') return;
    const delay = isCorrect ? 1400 : 1900;
    const timer = setTimeout(() => {
      if (currentIndex + 1 >= questions.length) {
        setPhase('done');
      } else {
        setCurrentIndex((i) => i + 1);
        setSelection([]);
        setIsCorrect(null);
        setHintActive(false);
        setPhase('playing');
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [phase, isCorrect, currentIndex, questions.length]);

  const startQuiz = useCallback(() => {
    setQuestions(buildRound());
    setCurrentIndex(0);
    setSelection([]);
    setIsCorrect(null);
    setCorrectCount(0);
    setHintsUsed(0);
    setHintActive(false);
    setPhase('playing');
  }, []);

  const handleTileTap = useCallback(
    (id: string) => {
      if (phase !== 'playing' || !currentQ) return;
      if (selection.length >= currentQ.tileIds.length) return;

      const newSel = [...selection, id];
      setSelection(newSel);

      if (newSel.length === currentQ.tileIds.length) {
        const correct = newSel.every((sid, i) => sid === currentQ.tileIds[i]);
        setIsCorrect(correct);
        if (correct) {
          playEffect('correct');
          setCorrectCount((c) => c + 1);
          setTimeout(() => playWord(currentQ.exampleWord), 350);
        } else {
          playEffect('wrong');
          shakeControls.start({
            x: [0, -8, 8, -8, 8, -4, 4, 0],
            transition: { duration: 0.45 },
          });
        }
        setPhase('feedback');
      }
    },
    [phase, currentQ, selection, playEffect, playWord, shakeControls],
  );

  const handleSlotTap = useCallback(
    (slotIndex: number) => {
      if (phase !== 'playing') return;
      setSelection((sel) => sel.slice(0, slotIndex));
      setHintActive(false);
    },
    [phase],
  );

  const handleHint = useCallback(() => {
    if (phase !== 'playing' || !currentQ) return;
    if (hintActive || selection.length >= currentQ.tileIds.length) return;
    setHintsUsed((h) => h + 1);
    setHintActive(true);
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    hintTimerRef.current = setTimeout(() => setHintActive(false), 1100);
  }, [phase, currentQ, hintActive, selection.length]);

  const earnedStars =
    phase === 'done'
      ? Math.max(0, correctCount + (correctCount === questions.length ? 2 : 0) - hintsUsed)
      : 0;

  const hintTileId =
    hintActive && currentQ ? currentQ.tileIds[selection.length] : null;

  // ── Learn mode ───────────────────────────────────────────────────────────────

  const LEARN_GROUPS = [
    { label: '初級：單音節', combos: SYLLABLE_COMBOS.filter((c) => c.difficulty === 1) },
    { label: '中級：聲母 + 韻母', combos: SYLLABLE_COMBOS.filter((c) => c.difficulty === 2) },
    { label: '進階：三拼', combos: SYLLABLE_COMBOS.filter((c) => c.difficulty === 3) },
  ];

  const renderLearn = () => (
    <div>
      {LEARN_GROUPS.map((group) => (
        <div key={group.label} style={{ marginBottom: 24 }}>
          <div
            style={{
              fontSize: FONT_SIZE.sm,
              fontWeight: 700,
              color: COLORS.textLight,
              marginBottom: 10,
              letterSpacing: '0.04em',
            }}
          >
            {group.label}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {group.combos.map((combo) => (
              <LearnComboCard key={combo.id} combo={combo} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  // ── Quiz — idle ──────────────────────────────────────────────────────────────

  const renderIdle = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ textAlign: 'center', padding: '32px 0' }}
    >
      <div style={{ fontSize: '4rem', marginBottom: 16 }}>🔤</div>
      <div style={{ fontSize: FONT_SIZE['2xl'], fontWeight: 700, color: COLORS.text, marginBottom: 8 }}>
        拼音組合
      </div>
      <div style={{ fontSize: FONT_SIZE.md, color: COLORS.textLight, marginBottom: 32, lineHeight: 1.6 }}>
        把聲母和韻母拼在一起
        <br />
        共 8 題，可用提示但會扣星！
      </div>
      {!ttsAvailable && (
        <div
          style={{
            backgroundColor: '#FFF3CD',
            borderRadius: BORDER_RADIUS.md,
            padding: '12px 16px',
            marginBottom: 24,
            color: '#856404',
            fontSize: FONT_SIZE.sm,
          }}
        >
          ⚠️ 此裝置不支援語音播放
        </div>
      )}
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={startQuiz}
        style={{
          padding: '16px 48px',
          borderRadius: BORDER_RADIUS.lg,
          border: 'none',
          backgroundColor: COLORS.primary,
          color: COLORS.white,
          fontSize: FONT_SIZE.xl,
          fontWeight: 700,
          cursor: 'pointer',
          touchAction: 'manipulation',
          boxShadow: SHADOW.md,
          minHeight: 56,
        }}
        className="no-select"
      >
        開始練習
      </motion.button>
    </motion.div>
  );

  // ── Quiz — playing / feedback ─────────────────────────────────────────────────

  const renderQuestion = () => {
    if (!currentQ) return null;
    const isFull = selection.length >= currentQ.tileIds.length;

    return (
      <div>
        {/* Progress row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <span style={{ fontSize: FONT_SIZE.sm, color: COLORS.textLight, fontWeight: 600 }}>
            第 {currentIndex + 1} / {questions.length} 題
          </span>
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={handleHint}
            disabled={phase !== 'playing' || hintActive || isFull}
            style={{
              padding: '4px 12px',
              borderRadius: BORDER_RADIUS.sm,
              border: `1.5px solid ${COLORS.accent}`,
              backgroundColor: hintActive ? COLORS.accent + '33' : 'transparent',
              color: COLORS.text,
              fontSize: FONT_SIZE.xs,
              fontWeight: 700,
              cursor: phase === 'playing' && !isFull ? 'pointer' : 'default',
              touchAction: 'manipulation',
              opacity: phase === 'playing' && !isFull ? 1 : 0.4,
            }}
            className="no-select"
          >
            💡 提示 (−1⭐)
          </motion.button>
        </div>

        <ProgressDots total={questions.length} current={currentIndex} />

        {/* Target card */}
        <div
          style={{
            backgroundColor: COLORS.white,
            borderRadius: BORDER_RADIUS.lg,
            padding: '16px',
            boxShadow: SHADOW.md,
            textAlign: 'center',
            margin: '14px 0 12px',
          }}
        >
          <div style={{ fontSize: '2.8rem', fontWeight: 700, color: COLORS.text, letterSpacing: '-0.02em', lineHeight: 1 }}>
            {currentQ.symbol}
          </div>
          <div style={{ fontSize: '1.5rem', marginTop: 8 }}>
            {currentQ.exampleEmoji}{' '}
            <span style={{ fontSize: FONT_SIZE.lg, fontWeight: 700, color: COLORS.text }}>
              {currentQ.exampleWord}
            </span>
          </div>
          <button
            onClick={() => playWord(currentQ.exampleWord)}
            style={{
              marginTop: 10,
              padding: '6px 18px',
              borderRadius: BORDER_RADIUS.md,
              border: `1.5px solid ${COLORS.primary}55`,
              backgroundColor: 'transparent',
              color: COLORS.primary,
              fontSize: FONT_SIZE.sm,
              fontWeight: 700,
              cursor: 'pointer',
              touchAction: 'manipulation',
            }}
            className="no-select"
          >
            ▶ 播放
          </button>
        </div>

        {/* Answer slots */}
        <motion.div
          animate={shakeControls}
          style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 14 }}
        >
          {currentQ.tileIds.map((expectedId, slotIdx) => {
            const filledId = selection[slotIdx];
            const filledSym = filledId ? getSymbolById(filledId) : null;
            let borderColor: string = '#DDD';
            let bgColor: string = 'transparent';
            let textColor: string = COLORS.text;

            if (filledId) {
              if (phase === 'feedback') {
                const correct = filledId === expectedId;
                borderColor = correct ? '#27AE60' : '#E74C3C';
                bgColor = correct ? '#D1F2EB' : '#FDECEA';
                textColor = correct ? '#27AE60' : '#E74C3C';
              } else {
                borderColor = filledSym?.color ?? COLORS.primary;
                bgColor = (filledSym?.color ?? COLORS.primary) + '22';
                textColor = filledSym?.color ?? COLORS.text;
              }
            }

            return (
              <motion.button
                key={slotIdx}
                whileTap={phase === 'playing' && !!filledId ? { scale: 0.92 } : undefined}
                onClick={() => filledId && handleSlotTap(slotIdx)}
                style={{
                  width: 56,
                  height: 64,
                  borderRadius: BORDER_RADIUS.md,
                  border: `2px ${filledId ? 'solid' : 'dashed'} ${borderColor}`,
                  backgroundColor: bgColor,
                  color: textColor,
                  fontSize: '1.7rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: phase === 'playing' && !!filledId ? 'pointer' : 'default',
                  touchAction: 'manipulation',
                  transition: 'border-color 0.2s, background-color 0.2s',
                }}
                className="no-select"
              >
                {filledSym?.symbol ?? ''}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Feedback banner */}
        <AnimatePresence>
          {phase === 'feedback' && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                textAlign: 'center',
                padding: '10px',
                borderRadius: BORDER_RADIUS.md,
                backgroundColor: isCorrect ? '#D1F2EB' : '#FDECEA',
                color: isCorrect ? '#27AE60' : '#E74C3C',
                fontWeight: 700,
                fontSize: FONT_SIZE.md,
                marginBottom: 12,
              }}
            >
              {isCorrect
                ? '✓ 答對了！'
                : `✗ 正確答案是 ${currentQ.symbol}（${currentQ.exampleWord}）`}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tile grids */}
        <TileGrid
          tiles={CONSONANTS}
          label="聲母"
          disabled={phase === 'feedback' || isFull}
          hintTileId={hintTileId}
          onTap={handleTileTap}
        />
        <TileGrid
          tiles={VOWELS}
          label="韻母"
          disabled={phase === 'feedback' || isFull}
          hintTileId={hintTileId}
          onTap={handleTileTap}
        />
      </div>
    );
  };

  // ── Quiz — done ───────────────────────────────────────────────────────────────

  const renderDone = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{ textAlign: 'center', padding: '24px 0' }}
    >
      <div style={{ fontSize: '3.5rem', marginBottom: 12 }}>
        {correctCount === questions.length ? '🎉' : correctCount >= 6 ? '🌟' : '💪'}
      </div>
      <div style={{ fontSize: FONT_SIZE['2xl'], fontWeight: 700, color: COLORS.text, marginBottom: 8 }}>
        {correctCount === questions.length ? '完美！' : '完成！'}
      </div>
      <div style={{ fontSize: FONT_SIZE.lg, color: COLORS.textLight, marginBottom: 20 }}>
        答對 {correctCount} / {questions.length} 題
      </div>

      {/* Stars */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          backgroundColor: '#FFF9E8',
          borderRadius: BORDER_RADIUS.lg,
          padding: '16px 24px',
          marginBottom: hintsUsed > 0 ? 8 : 28,
          boxShadow: SHADOW.sm,
        }}
      >
        <IconStar size={32} />
        <span style={{ fontSize: FONT_SIZE['2xl'], fontWeight: 700, color: COLORS.accent }}>
          +{earnedStars}
        </span>
        <span style={{ fontSize: FONT_SIZE.md, color: COLORS.textLight }}>
          顆星星
          {correctCount === questions.length && (
            <span style={{ color: COLORS.primary }}> (全對 +2！)</span>
          )}
        </span>
      </div>
      {hintsUsed > 0 && (
        <div style={{ fontSize: FONT_SIZE.sm, color: COLORS.textLight, marginBottom: 24 }}>
          使用 {hintsUsed} 次提示 (−{hintsUsed} ⭐)
        </div>
      )}

      <div style={{ display: 'flex', gap: 12 }}>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={startQuiz}
          style={{
            flex: 1,
            padding: '14px',
            borderRadius: BORDER_RADIUS.lg,
            border: `2px solid ${COLORS.primary}`,
            backgroundColor: 'transparent',
            color: COLORS.primary,
            fontSize: FONT_SIZE.md,
            fontWeight: 700,
            cursor: 'pointer',
            touchAction: 'manipulation',
            minHeight: 52,
          }}
          className="no-select"
        >
          再玩一次
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => onComplete(earnedStars)}
          style={{
            flex: 1,
            padding: '14px',
            borderRadius: BORDER_RADIUS.lg,
            border: 'none',
            backgroundColor: COLORS.primary,
            color: COLORS.white,
            fontSize: FONT_SIZE.md,
            fontWeight: 700,
            cursor: 'pointer',
            touchAction: 'manipulation',
            minHeight: 52,
            boxShadow: SHADOW.md,
          }}
          className="no-select"
        >
          回遊戲列表
        </motion.button>
      </div>
    </motion.div>
  );

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div style={{ padding: '20px 16px 24px' }}>
      <motion.h1
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          fontSize: '1.75rem',
          fontWeight: 700,
          color: COLORS.text,
          textAlign: 'center',
          marginBottom: 20,
        }}
      >
        拼音組合
      </motion.h1>

      <TabBar active={tab} onChange={setTab} />

      <AnimatePresence mode="wait">
        {tab === 'learn' ? (
          <motion.div
            key="learn"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {renderLearn()}
          </motion.div>
        ) : (
          <motion.div
            key="quiz"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {phase === 'idle' && renderIdle()}
            {(phase === 'playing' || phase === 'feedback') && renderQuestion()}
            {phase === 'done' && renderDone()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── TileGrid ───────────────────────────────────────────────────────────────────

function TileGrid({
  tiles,
  label,
  disabled,
  hintTileId,
  onTap,
}: {
  tiles: typeof BOPOMOFO_SYMBOLS;
  label: string;
  disabled: boolean;
  hintTileId: string | null;
  onTap: (id: string) => void;
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div
        style={{
          fontSize: FONT_SIZE.xs,
          fontWeight: 700,
          color: COLORS.textLight,
          marginBottom: 6,
          letterSpacing: '0.05em',
        }}
      >
        {label}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {tiles.map((sym) => {
          const isHinted = sym.id === hintTileId;
          return (
            <motion.button
              key={sym.id}
              animate={isHinted ? { scale: [1, 1.15, 1, 1.15, 1] } : { scale: 1 }}
              transition={isHinted ? { duration: 0.9 } : {}}
              whileTap={!disabled ? { scale: 0.9 } : undefined}
              onClick={() => !disabled && onTap(sym.id)}
              style={{
                width: 44,
                height: 44,
                borderRadius: BORDER_RADIUS.md,
                border: `2px solid ${isHinted ? sym.color : sym.color + '55'}`,
                backgroundColor: isHinted ? sym.color + '33' : sym.color + '11',
                color: sym.color,
                fontSize: '1.3rem',
                fontWeight: 700,
                cursor: disabled ? 'default' : 'pointer',
                touchAction: 'manipulation',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: disabled ? 0.4 : 1,
                transition: 'opacity 0.2s, border-color 0.2s, background-color 0.2s',
                boxShadow: isHinted ? `0 0 0 3px ${sym.color}44` : 'none',
              }}
              className="no-select"
            >
              {sym.symbol}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
