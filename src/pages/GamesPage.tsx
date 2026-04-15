import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { COLORS, BORDER_RADIUS, SHADOW } from '../styles/theme';
import { IconSpeaker, IconPuzzle, IconCards, IconTone } from '../components/common/SvgIcons';

interface GameItem {
  id: string;
  icon: ReactNode;
  name: string;
  description: string;
  bg: string;
  color: string;
}

const GAMES: GameItem[] = [
  {
    id: 'listen',
    icon: <IconSpeaker size={40} color="#FFFFFF" />,
    name: '聽音選字',
    description: '聽發音，選出正確的注音！',
    bg: '#FF6B6B',
    color: '#FFFFFF',
  },
  {
    id: 'drag',
    icon: <IconPuzzle size={40} color="#FFFFFF" />,
    name: '拖拉配對',
    description: '把注音拖到正確的圖片上！',
    bg: '#4ECDC4',
    color: '#FFFFFF',
  },
  {
    id: 'memory',
    icon: <IconCards size={40} color="#2D3436" />,
    name: '翻牌記憶',
    description: '找出配對的注音和圖片！',
    bg: '#FFC851',
    color: '#2D3436',
  },
  {
    id: 'tone',
    icon: <IconTone size={40} color="#FFFFFF" />,
    name: '聲調練習',
    description: '學會一二三四聲和輕聲！',
    bg: '#A78BFA',
    color: '#FFFFFF',
  },
];

export default function GamesPage() {
  const navigate = useNavigate();
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
          marginBottom: 24,
        }}
      >
        趣味遊戲
      </motion.h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {GAMES.map((game, i) => (
          <motion.button
            key={game.id}
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12, duration: 0.4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/games/' + game.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              minHeight: 100,
              borderRadius: BORDER_RADIUS.lg,
              backgroundColor: game.bg,
              color: game.color,
              padding: '16px 20px',
              boxShadow: SHADOW.md,
              textAlign: 'left',
              cursor: 'pointer',
              touchAction: 'manipulation',
              border: 'none',
              width: '100%',
            }}
            className="no-select"
          >
            <span style={{ flexShrink: 0, lineHeight: 1, display: 'flex', alignItems: 'center' }}>
              {game.icon}
            </span>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 4 }}>
                {game.name}
              </div>
              <div style={{ fontSize: '0.95rem', opacity: 0.9 }}>{game.description}</div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
