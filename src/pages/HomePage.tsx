import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProgressStore } from '../stores/useProgressStore';
import { COLORS, BORDER_RADIUS, SHADOW } from '../styles/theme';
import {
  MascotOwl,
  IconStar,
  IconBook,
  IconGame,
  IconTrophy,
  BgCloud,
} from '../components/common/SvgIcons';
import DailyReviewCard from '../components/home/DailyReviewCard';
import BopomofoCard from '../components/learn/BopomofoCard';
import { BOPOMOFO_SYMBOLS } from '../constants/bopomofo';

const ALL_SYMBOL_IDS = BOPOMOFO_SYMBOLS.map((s) => s.id);

interface ButtonConfig {
  label: string;
  to: string;
  bg: string;
  color: string;
  Icon: React.ComponentType<{ size?: number; color?: string }>;
}

const BUTTONS: ButtonConfig[] = [
  { label: '開始學習', to: '/learn',    bg: COLORS.white,     color: COLORS.primary, Icon: IconBook },
  { label: '玩遊戲',   to: '/games',    bg: COLORS.accent,    color: COLORS.text,    Icon: IconGame },
  { label: '我的成績', to: '/progress', bg: COLORS.secondary, color: COLORS.white,   Icon: IconTrophy },
];

// Background decoration positions
const CLOUDS = [
  { left: '-8%',  top: '4%',  width: 110, opacity: 0.9 },
  { left: '58%',  top: '1%',  width: 90,  opacity: 0.85 },
  { left: '12%',  top: '28%', width: 70,  opacity: 0.75 },
  { left: '70%',  top: '26%', width: 95,  opacity: 0.8  },
  { left: '-4%',  top: '63%', width: 80,  opacity: 0.75 },
  { left: '63%',  top: '58%', width: 88,  opacity: 0.7  },
];

// Colorful dot decorations
const DOTS = [
  { left: '8%',  top: '8%',  size: 18, color: '#FF6B6B' },
  { left: '85%', top: '10%', size: 22, color: '#FFC851' },
  { left: '15%', top: '22%', size: 14, color: '#4ECDC4' },
  { left: '78%', top: '22%', size: 16, color: '#FF6B6B' },
  { left: '5%',  top: '50%', size: 20, color: '#FFC851' },
  { left: '90%', top: '48%', size: 14, color: '#4ECDC4' },
  { left: '50%', top: '13%', size: 12, color: '#FF8E53' },
  { left: '40%', top: '76%', size: 18, color: '#FF6B6B' },
  { left: '20%', top: '80%', size: 14, color: '#FFC851' },
  { left: '80%', top: '78%', size: 20, color: '#4ECDC4' },
  { left: '92%', top: '30%', size: 12, color: '#FF8E53' },
  { left: '3%',  top: '75%', size: 10, color: '#FF6B6B' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const totalStars = useProgressStore((s) => s.totalStars);
  const markLearning = useProgressStore((s) => s.markLearning);
  const [reviewSymbolId, setReviewSymbolId] = useState<string | null>(null);

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: 'linear-gradient(175deg, #89D4F5 0%, #B8E8FF 35%, #FFE5A0 75%, #FFCC70 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 24px 96px',
        gap: 24,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decorations — single composited layer, no JS animation */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          contain: 'strict',
        }}
      >
        {CLOUDS.map((c, i) => (
          <div
            key={i}
            style={{ position: 'absolute', left: c.left, top: c.top, transform: 'translateZ(0)' }}
          >
            <BgCloud width={c.width} opacity={c.opacity} />
          </div>
        ))}
        {DOTS.map((d, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: d.left,
              top: d.top,
              width: d.size,
              height: d.size,
              borderRadius: '50%',
              backgroundColor: d.color,
              opacity: 0.55,
              transform: 'translateZ(0)',
            }}
          />
        ))}
      </div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          color: '#2272A8',
          fontSize: '2.5rem',
          fontWeight: 700,
          textAlign: 'center',
          letterSpacing: '0.05em',
          textShadow: '0 2px 0px rgba(255,255,255,0.8)',
          position: 'relative',
          willChange: 'transform, opacity',
        }}
      >
        ㄅㄆㄇ學習
      </motion.h1>

      {/* Mascot */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
        style={{ lineHeight: 1, userSelect: 'none', position: 'relative', willChange: 'transform' }}
        aria-hidden="true"
      >
        <MascotOwl />
      </motion.div>

      {/* Stars */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        style={{
          backgroundColor: 'rgba(255,255,255,0.65)',
          borderRadius: BORDER_RADIUS.xl,
          padding: '8px 24px',
          color: COLORS.text,
          fontSize: '1.1rem',
          fontWeight: 700,
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          position: 'relative',
          willChange: 'transform, opacity',
        }}
      >
        <IconStar size={20} />
        {totalStars} 顆星星
      </motion.div>

      {/* Daily Review */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.45 }}
        style={{ width: '100%', maxWidth: 360, position: 'relative', willChange: 'transform, opacity' }}
      >
        <DailyReviewCard
          onSelect={(id) => {
            markLearning(id);
            setReviewSymbolId(id);
          }}
        />
      </motion.div>

      {/* Navigation buttons */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          width: '100%',
          maxWidth: 360,
          position: 'relative',
          willChange: 'transform, opacity',
        }}
      >
        {BUTTONS.map(({ label, to, bg, color, Icon }) => (
          <button
            key={to}
            onClick={() => navigate(to)}
            style={{
              minHeight: 64,
              borderRadius: BORDER_RADIUS.lg,
              backgroundColor: bg,
              color,
              fontSize: '1.2rem',
              fontWeight: 700,
              boxShadow: SHADOW.md,
              border: 'none',
              cursor: 'pointer',
              touchAction: 'manipulation',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = SHADOW.lg;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = SHADOW.md;
            }}
          >
            <Icon size={22} color={color} />
            {label}
          </button>
        ))}
      </motion.div>

      {/* Daily review overlay */}
      {reviewSymbolId && (
        <BopomofoCard
          symbolId={reviewSymbolId}
          allSymbolIds={ALL_SYMBOL_IDS}
          onClose={() => setReviewSymbolId(null)}
        />
      )}

      {/* DEV ONLY — stroke review shortcut */}
      {import.meta.env.DEV && (
        <button
          onClick={() => navigate('/dev/strokes')}
          style={{
            position: 'fixed',
            bottom: 80,
            right: 12,
            padding: '4px 10px',
            fontSize: '0.72rem',
            fontWeight: 600,
            backgroundColor: 'rgba(0,0,0,0.55)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            zIndex: 999,
            opacity: 0.7,
          }}
        >
          DEV 筆順審校
        </button>
      )}
    </div>
  );
}
