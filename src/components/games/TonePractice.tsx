import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TONES, getToneById, type ToneDefinition } from '../../constants/tones';
import ToneContourIcon from './ToneContourIcon';
import { useAudio } from '../../hooks/useAudio';
import { COLORS, BORDER_RADIUS, SHADOW, FONT_SIZE } from '../../styles/theme';
import { IconStar } from '../common/SvgIcons';

// ── Types ─────────────────────────────────────────────────────────────────────

interface QuizQuestion {
  toneId: 1 | 2 | 3 | 4 | 5;
  syllable: string;
  word: string;
  emoji: string;
}

type QuizPhase = 'idle' | 'playing' | 'feedback' | 'done';

interface Props {
  onComplete: (stars: number) => void;
}

// ── Quiz builder ──────────────────────────────────────────────────────────────

function buildQuiz(): QuizQuestion[] {
  const qs: QuizQuestion[] = [];
  for (const tone of TONES) {
    const shuffled = [...tone.examples].sort(() => Math.random() - 0.5);
    shuffled.slice(0, 2).forEach((ex) => {
      qs.push({
        toneId: tone.id,
        syllable: ex.syllable,
        word: ex.word,
        emoji: ex.emoji,
      });
    });
  }
  return qs.sort(() => Math.random() - 0.5);
}

// ── Sub-components ────────────────────────────────────────────────────────────

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

function LearnCard({ tone, index }: { tone: ToneDefinition; index: number }) {
  const { playWord } = useAudio();

  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      style={{
        backgroundColor: tone.bgColor,
        borderRadius: BORDER_RADIUS.lg,
        padding: '16px',
        boxShadow: SHADOW.md,
        marginBottom: 12,
        border: `2px solid ${tone.color}22`,
      }}
    >
      {/* Header: contour + mark + name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <ToneContourIcon contour={tone.contour} size={72} color={tone.color} />
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span
              style={{
                fontSize: '2rem',
                fontWeight: 900,
                color: tone.color,
                lineHeight: 1,
              }}
            >
              {tone.mark}
            </span>
            <span
              style={{
                fontSize: FONT_SIZE.xl,
                fontWeight: 700,
                color: tone.color,
              }}
            >
              {tone.name}
            </span>
          </div>
          <div
            style={{
              fontSize: FONT_SIZE.sm,
              color: COLORS.textLight,
              marginTop: 2,
            }}
          >
            {tone.description}
          </div>
        </div>
      </div>

      {/* Example buttons */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {tone.examples.map((ex) => (
          <motion.button
            key={ex.word}
            whileTap={{ scale: 0.9 }}
            onClick={() => playWord(ex.syllable)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '6px 12px',
              borderRadius: BORDER_RADIUS.md,
              border: `1.5px solid ${tone.color}55`,
              backgroundColor: COLORS.white,
              color: COLORS.text,
              fontSize: FONT_SIZE.md,
              fontWeight: 600,
              cursor: 'pointer',
              touchAction: 'manipulation',
              minHeight: 40,
            }}
            className="no-select"
          >
            <span style={{ fontSize: '1.1rem' }}>{ex.emoji}</span>
            <span>{ex.word}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

// ── Progress dots ─────────────────────────────────────────────────────────────

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

// ── Tone option button ────────────────────────────────────────────────────────

function ToneOptionButton({
  tone,
  state,
  onClick,
}: {
  tone: ToneDefinition;
  state: 'idle' | 'correct' | 'wrong' | 'disabled';
  onClick: () => void;
}) {
  const bgMap = {
    idle: COLORS.white,
    correct: '#D1F2EB',
    wrong: '#FDECEA',
    disabled: '#F5F5F5',
  };
  const borderMap = {
    idle: '#E0E0E0',
    correct: '#27AE60',
    wrong: '#E74C3C',
    disabled: '#E0E0E0',
  };

  return (
    <motion.button
      whileTap={state === 'idle' ? { scale: 0.95 } : undefined}
      onClick={state === 'idle' ? onClick : undefined}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        padding: '10px 4px',
        borderRadius: BORDER_RADIUS.md,
        border: `2px solid ${borderMap[state]}`,
        backgroundColor: bgMap[state],
        cursor: state === 'idle' ? 'pointer' : 'default',
        touchAction: 'manipulation',
        flex: 1,
        minHeight: 72,
        transition: 'background-color 0.15s, border-color 0.15s',
      }}
      className="no-select"
    >
      <ToneContourIcon
        contour={tone.contour}
        size={44}
        color={state === 'idle' ? tone.color : state === 'correct' ? '#27AE60' : state === 'wrong' ? '#E74C3C' : '#AAA'}
      />
      <span
        style={{
          fontSize: FONT_SIZE.sm,
          fontWeight: 700,
          color:
            state === 'correct' ? '#27AE60' : state === 'wrong' ? '#E74C3C' : state === 'idle' ? tone.color : '#AAA',
        }}
      >
        {tone.mark}
      </span>
      <span
        style={{
          fontSize: '0.65rem',
          color: COLORS.textLight,
          fontWeight: 600,
        }}
      >
        {tone.name}
      </span>
    </motion.button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function TonePractice({ onComplete }: Props) {
  const { playWord, playEffect } = useAudio();
  const [tab, setTab] = useState<'learn' | 'quiz'>('learn');

  // Quiz state
  const [phase, setPhase] = useState<QuizPhase>('idle');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedToneId, setSelectedToneId] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [showWord, setShowWord] = useState(true);

  const ttsAvailable = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const currentQ = questions[currentIndex];

  // Auto-advance after feedback
  useEffect(() => {
    if (phase !== 'feedback') return;
    const timer = setTimeout(() => {
      if (currentIndex + 1 >= questions.length) {
        setPhase('done');
      } else {
        setCurrentIndex((i) => i + 1);
        setSelectedToneId(null);
        setPhase('playing');
      }
    }, 1400);
    return () => clearTimeout(timer);
  }, [phase, currentIndex, questions.length]);

  const startQuiz = useCallback(() => {
    setQuestions(buildQuiz());
    setCurrentIndex(0);
    setSelectedToneId(null);
    setCorrectCount(0);
    setPhase('playing');
  }, []);

  const handleAnswer = useCallback(
    (toneId: number) => {
      if (phase !== 'playing' || !currentQ) return;
      setSelectedToneId(toneId);
      const correct = toneId === currentQ.toneId;
      if (correct) {
        playEffect('correct');
        setCorrectCount((c) => c + 1);
      } else {
        playEffect('wrong');
      }
      setPhase('feedback');
    },
    [phase, currentQ, playEffect],
  );

  const handlePlayAudio = useCallback(() => {
    if (currentQ) playWord(currentQ.syllable);
  }, [currentQ, playWord]);

  const earnedStars =
    phase === 'done'
      ? correctCount + (correctCount === questions.length ? 2 : 0)
      : 0;

  // ── Learn mode ──────────────────────────────────────────────────────────────

  const renderLearn = () => (
    <div>
      {TONES.map((tone, i) => (
        <LearnCard key={tone.id} tone={tone} index={i} />
      ))}
    </div>
  );

  // ── Quiz — idle ─────────────────────────────────────────────────────────────

  const renderIdle = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ textAlign: 'center', padding: '32px 0' }}
    >
      <div style={{ fontSize: '4rem', marginBottom: 16 }}>🎵</div>
      <div
        style={{
          fontSize: FONT_SIZE['2xl'],
          fontWeight: 700,
          color: COLORS.text,
          marginBottom: 8,
        }}
      >
        聲調練習
      </div>
      <div
        style={{
          fontSize: FONT_SIZE.md,
          color: COLORS.textLight,
          marginBottom: 32,
          lineHeight: 1.6,
        }}
      >
        聽一聽，選出正確的聲調
        <br />
        共 10 題，答對越多、星星越多！
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
          ⚠️ 此裝置不支援語音播放，部分功能可能受限
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

  // ── Quiz — playing / feedback ───────────────────────────────────────────────

  const renderQuestion = () => {
    if (!currentQ) return null;
    const correctTone = getToneById(currentQ.toneId)!;

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
          <button
            onClick={() => setShowWord((v) => !v)}
            style={{
              padding: '4px 10px',
              borderRadius: BORDER_RADIUS.sm,
              border: `1.5px solid ${COLORS.textLight}55`,
              backgroundColor: showWord ? COLORS.secondary + '22' : 'transparent',
              color: COLORS.textLight,
              fontSize: FONT_SIZE.xs,
              fontWeight: 600,
              cursor: 'pointer',
              touchAction: 'manipulation',
            }}
            className="no-select"
          >
            {showWord ? '隱藏字' : '顯示字'}
          </button>
        </div>

        <ProgressDots total={questions.length} current={currentIndex} />

        {/* Play button + word display */}
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <motion.button
            whileTap={phase === 'playing' ? { scale: 0.93 } : undefined}
            onClick={phase === 'playing' ? handlePlayAudio : undefined}
            style={{
              width: 88,
              height: 88,
              borderRadius: '50%',
              border: 'none',
              backgroundColor: COLORS.primary,
              color: COLORS.white,
              fontSize: '2.5rem',
              cursor: phase === 'playing' ? 'pointer' : 'default',
              touchAction: 'manipulation',
              boxShadow: SHADOW.lg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
            className="no-select"
          >
            ▶
          </motion.button>

          <AnimatePresence mode="wait">
            {showWord && (
              <motion.div
                key={currentQ.word}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 700,
                  color: COLORS.text,
                  lineHeight: 1.2,
                }}
              >
                {currentQ.emoji} {currentQ.word}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Feedback banner */}
        <AnimatePresence>
          {phase === 'feedback' && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                textAlign: 'center',
                padding: '10px',
                borderRadius: BORDER_RADIUS.md,
                backgroundColor:
                  selectedToneId === currentQ.toneId ? '#D1F2EB' : '#FDECEA',
                color:
                  selectedToneId === currentQ.toneId ? '#27AE60' : '#E74C3C',
                fontWeight: 700,
                fontSize: FONT_SIZE.md,
                marginBottom: 12,
              }}
            >
              {selectedToneId === currentQ.toneId
                ? `✓ 答對了！`
                : `✗ 正確答案是 ${correctTone.name}（${correctTone.mark}）`}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tone option buttons */}
        <div style={{ display: 'flex', gap: 6 }}>
          {TONES.map((tone) => {
            let state: 'idle' | 'correct' | 'wrong' | 'disabled' = 'idle';
            if (phase === 'feedback') {
              if (tone.id === currentQ.toneId) state = 'correct';
              else if (tone.id === selectedToneId) state = 'wrong';
              else state = 'disabled';
            }
            return (
              <ToneOptionButton
                key={tone.id}
                tone={tone}
                state={state}
                onClick={() => handleAnswer(tone.id)}
              />
            );
          })}
        </div>
      </div>
    );
  };

  // ── Quiz — done ─────────────────────────────────────────────────────────────

  const renderDone = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{ textAlign: 'center', padding: '24px 0' }}
    >
      <div style={{ fontSize: '3.5rem', marginBottom: 12 }}>
        {correctCount === questions.length ? '🎉' : correctCount >= 7 ? '🌟' : '💪'}
      </div>
      <div
        style={{
          fontSize: FONT_SIZE['2xl'],
          fontWeight: 700,
          color: COLORS.text,
          marginBottom: 8,
        }}
      >
        {correctCount === questions.length ? '完美！' : '完成！'}
      </div>
      <div style={{ fontSize: FONT_SIZE.lg, color: COLORS.textLight, marginBottom: 20 }}>
        答對 {correctCount} / {questions.length} 題
      </div>

      {/* Stars display */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          backgroundColor: '#FFF9E8',
          borderRadius: BORDER_RADIUS.lg,
          padding: '16px 24px',
          marginBottom: 28,
          boxShadow: SHADOW.sm,
        }}
      >
        <IconStar size={32} />
        <span
          style={{ fontSize: FONT_SIZE['2xl'], fontWeight: 700, color: COLORS.accent }}
        >
          +{earnedStars}
        </span>
        <span style={{ fontSize: FONT_SIZE.md, color: COLORS.textLight }}>
          顆星星
          {correctCount === questions.length && (
            <span style={{ color: COLORS.primary }}> (全對獎勵 +2！)</span>
          )}
        </span>
      </div>

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

  // ── Render ──────────────────────────────────────────────────────────────────

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
        聲調練習
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
