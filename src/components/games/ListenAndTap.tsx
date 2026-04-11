import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { BOPOMOFO_SYMBOLS, type BopomofoSymbol } from '../../constants/bopomofo';
import { useAudio } from '../../hooks/useAudio';
import StarBurst from '../common/StarBurst';
import { COLORS, BORDER_RADIUS, SHADOW } from '../../styles/theme';
import { IconSpeaker, IconTrophy, IconCelebration, IconMuscle, IconStar, IconStarOutline } from '../common/SvgIcons';

interface ListenAndTapProps {
  onComplete: (stars: number) => void;
}

const TOTAL_QUESTIONS = 5;

function pickRandom<T>(arr: T[], count: number, exclude?: T): T[] {
  const pool = exclude !== undefined ? arr.filter((x) => x !== exclude) : arr;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function generateOptions(correct: BopomofoSymbol): BopomofoSymbol[] {
  const sameGroup = BOPOMOFO_SYMBOLS.filter(
    (s) => s.group === correct.group && s.id !== correct.id,
  );
  const pool = sameGroup.length >= 3 ? sameGroup : BOPOMOFO_SYMBOLS.filter((s) => s.id !== correct.id);
  const distractors = pickRandom(pool, 3);
  return [correct, ...distractors].sort(() => Math.random() - 0.5);
}

type QuestionMode = 'phoneme' | 'word';

function pickQuestion(qIndex: number): { correct: BopomofoSymbol; options: BopomofoSymbol[]; mode: QuestionMode } {
  const correct = BOPOMOFO_SYMBOLS[Math.floor(Math.random() * BOPOMOFO_SYMBOLS.length)];
  const options = generateOptions(correct);
  // First 2 questions use phoneme mode, remaining use word mode
  const mode: QuestionMode = qIndex < 2 ? 'phoneme' : 'word';
  return { correct, options, mode };
}

export default function ListenAndTap({ onComplete }: ListenAndTapProps) {
  const { playWord, playPhoneme, playEffect } = useAudio();
  const [phase, setPhase] = useState<'playing' | 'result'>('playing');
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<string | null>(null);
  const [showBurst, setShowBurst] = useState(false);
  const [question, setQuestion] = useState(() => pickQuestion(0));

  function playQuestion(q: typeof question) {
    if (q.mode === 'phoneme') {
      playPhoneme(q.correct.symbol);
    } else {
      playWord(q.correct.exampleWord);
    }
  }

  const loadNewQuestion = useCallback((nextIndex: number) => {
    const q = pickQuestion(nextIndex);
    setQuestion(q);
    setAnswered(null);
    setTimeout(() => playQuestion(q), 300);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playWord, playPhoneme]);

  useEffect(() => {
    setTimeout(() => playQuestion(question), 300);
    // Only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleAnswer(sym: BopomofoSymbol) {
    if (answered !== null) return;
    setAnswered(sym.id);

    const isCorrect = sym.id === question.correct.id;
    if (isCorrect) {
      playEffect('correct');
      setScore((s) => s + 1);
      setShowBurst(true);
    } else {
      playEffect('wrong');
    }

    setTimeout(() => {
      setShowBurst(false);
      const nextQ = currentQ + 1;
      if (nextQ >= TOTAL_QUESTIONS) {
        setPhase('result');
      } else {
        setCurrentQ(nextQ);
        loadNewQuestion(nextQ);
      }
    }, 1200);
  }

  function handleReset() {
    setPhase('playing');
    setCurrentQ(0);
    setScore(0);
    setAnswered(null);
    setShowBurst(false);
    const q = pickQuestion(0);
    setQuestion(q);
    setTimeout(() => playQuestion(q), 300);
  }

  if (phase === 'result') {
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
        }}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          style={{ textAlign: 'center' }}
        >
          <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'center' }}>
            {score >= 4
              ? <IconTrophy size={56} color="#FFC851" />
              : score >= 2
                ? <IconCelebration size={56} />
                : <IconMuscle size={56} color="#FF6B6B" />}
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: COLORS.text, marginBottom: 8 }}>
            遊戲結束！
          </h2>
          <p style={{ fontSize: '1.25rem', color: COLORS.text }}>
            答對 {score} / {TOTAL_QUESTIONS} 題
          </p>
          <div style={{ display: 'flex', gap: 4, marginTop: 8, justifyContent: 'center' }}>
            {Array.from({ length: TOTAL_QUESTIONS }, (_, i) =>
              i < score
                ? <IconStar key={i} size={28} />
                : <IconStarOutline key={i} size={28} />
            )}
          </div>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 280 }}>
          <button
            onClick={handleReset}
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
            onClick={() => onComplete(score)}
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

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: COLORS.text, marginBottom: 8 }}>
          {question.mode === 'phoneme' ? '聽注音，點選正確符號' : '聽詞語，找第一個音'}
        </h2>
        <p style={{ color: '#999', fontSize: '0.9rem' }}>
          第 {currentQ + 1} / {TOTAL_QUESTIONS} 題
        </p>
        {/* Progress bar */}
        <div
          style={{
            height: 8,
            borderRadius: 4,
            backgroundColor: '#E0E0E0',
            marginTop: 8,
            overflow: 'hidden',
          }}
        >
          <motion.div
            animate={{ width: `${((currentQ) / TOTAL_QUESTIONS) * 100}%` }}
            style={{ height: '100%', backgroundColor: COLORS.primary, borderRadius: 4 }}
          />
        </div>
      </div>

      {/* Replay button */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <button
          onClick={() => playQuestion(question)}
          style={{
            height: 80,
            width: 80,
            borderRadius: '50%',
            backgroundColor: COLORS.primary,
            color: COLORS.white,
            border: 'none',
            fontSize: '2rem',
            cursor: 'pointer',
            touchAction: 'manipulation',
            boxShadow: SHADOW.md,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Play sound"
        >
          <IconSpeaker size={36} color={COLORS.white} />
        </button>
      </div>

      {/* Options grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
        }}
      >
        {question.options.map((opt) => {
          let bgColor = opt.color;
          let borderColor = 'transparent';
          let shake = false;

          if (answered !== null) {
            if (opt.id === question.correct.id) {
              borderColor = '#2ECC71';
              bgColor = '#D5F5E3';
            } else if (opt.id === answered && opt.id !== question.correct.id) {
              borderColor = '#E74C3C';
              bgColor = '#FADBD8';
              shake = true;
            } else {
              bgColor = '#F0F0F0';
            }
          }

          return (
            <motion.button
              key={opt.id}
              onClick={() => handleAnswer(opt)}
              whileTap={answered === null ? { scale: 0.95 } : {}}
              animate={shake ? { x: [0, -8, 8, -8, 8, 0] } : {}}
              transition={shake ? { duration: 0.4 } : {}}
              style={{
                minHeight: 100,
                borderRadius: 16,
                backgroundColor: bgColor,
                border: `3px solid ${borderColor}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                cursor: answered === null ? 'pointer' : 'default',
                touchAction: 'manipulation',
                boxShadow: SHADOW.sm,
                padding: 8,
                transition: 'background-color 0.2s',
              }}
            >
              <span style={{ fontSize: '2.5rem', fontWeight: 700, color: answered !== null ? COLORS.text : COLORS.white, lineHeight: 1 }}>
                {opt.symbol}
              </span>
              <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>{opt.exampleEmoji}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
