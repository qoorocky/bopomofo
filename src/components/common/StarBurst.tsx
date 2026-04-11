import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StarBurstProps {
  active: boolean;
  onComplete?: () => void;
}

const STAR_COUNT = 8;
const stars = Array.from({ length: STAR_COUNT }, (_, i) => ({
  id: i,
  angle: (i * 360 / STAR_COUNT) * (Math.PI / 180),
  distance: 60 + Math.random() * 30,
}));

export default function StarBurst({ active, onComplete }: StarBurstProps) {
  useEffect(() => {
    if (active && onComplete) {
      const timer = setTimeout(onComplete, 800);
      return () => clearTimeout(timer);
    }
  }, [active, onComplete]);

  return (
    <AnimatePresence>
      {active && (
        <div
          style={{
            position: 'fixed',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 9999,
            width: 0,
            height: 0,
          }}
        >
          {stars.map((star) => (
            <motion.span
              key={star.id}
              initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }}
              animate={{
                x: Math.cos(star.angle) * star.distance,
                y: Math.sin(star.angle) * star.distance,
                opacity: 0,
                scale: 1.5,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                display: 'inline-block',
                lineHeight: 1,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
                <polygon
                  points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                  fill={star.id % 2 === 0 ? '#FFC851' : '#FF6B6B'}
                />
              </svg>
            </motion.span>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
