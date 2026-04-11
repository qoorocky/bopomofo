import { useState } from 'react';
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { BOPOMOFO_SYMBOLS, type BopomofoSymbol } from '../../constants/bopomofo';
import { useAudio } from '../../hooks/useAudio';
import StarBurst from '../common/StarBurst';
import { COLORS, BORDER_RADIUS, SHADOW } from '../../styles/theme';
import { IconCheck, IconCelebration, IconStar } from '../common/SvgIcons';

interface DragAndMatchProps {
  onComplete: (stars: number) => void;
}

function pickRandomSymbols(count: number): BopomofoSymbol[] {
  const shuffled = [...BOPOMOFO_SYMBOLS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

interface DraggableCardProps {
  symbol: BopomofoSymbol;
  matched: boolean;
}

function DraggableCard({ symbol, matched }: DraggableCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: symbol.id,
    disabled: matched,
  });

  const style: React.CSSProperties = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    zIndex: isDragging ? 1000 : 1,
    opacity: matched ? 0.3 : 1,
    cursor: matched ? 'default' : isDragging ? 'grabbing' : 'grab',
    touchAction: 'none',
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: matched ? '#D5F5E3' : symbol.color,
    border: `3px solid ${matched ? '#2ECC71' : 'transparent'}`,
    padding: '12px 8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    boxShadow: isDragging ? SHADOW.lg : SHADOW.sm,
    minHeight: 80,
    userSelect: 'none',
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <span style={{ fontSize: '2rem', fontWeight: 700, color: COLORS.white, lineHeight: 1 }}>
        {symbol.symbol}
      </span>
      <span style={{ fontSize: '0.85rem', color: COLORS.white, fontWeight: 600 }}>
        {symbol.exampleWord}
      </span>
    </div>
  );
}

interface DroppableTargetProps {
  symbol: BopomofoSymbol;
  matched: boolean;
}

function DroppableTarget({ symbol, matched }: DroppableTargetProps) {
  const { setNodeRef, isOver } = useDroppable({ id: symbol.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        minHeight: 80,
        borderRadius: BORDER_RADIUS.md,
        border: `3px dashed ${matched ? '#2ECC71' : isOver ? COLORS.primary : '#CCCCCC'}`,
        backgroundColor: matched ? '#D5F5E3' : isOver ? '#FFF0F0' : '#F8F8F8',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        transition: 'all 0.2s',
        padding: 8,
      }}
    >
      <span style={{ fontSize: '2rem', lineHeight: 1 }}>{symbol.exampleEmoji}</span>
      {matched && (
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <IconCheck size={14} color="#2ECC71" />
        </span>
      )}
    </div>
  );
}

function initRound() {
  const symbols = pickRandomSymbols(4);
  return { symbols, targets: [...symbols].sort(() => Math.random() - 0.5) };
}

export default function DragAndMatch({ onComplete }: DragAndMatchProps) {
  const { playEffect } = useAudio();
  const [{ symbols, targets }, setRound] = useState(initRound);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [showBurst, setShowBurst] = useState(false);
  const [done, setDone] = useState(false);

  function handleReset() {
    setRound(initRound());
    setMatched(new Set());
    setShowBurst(false);
    setDone(false);
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { distance: 8 } }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const draggedId = active.id as string;
    const droppedOnId = over.id as string;

    if (draggedId === droppedOnId) {
      playEffect('correct');
      setShowBurst(true);
      const newMatched = new Set(matched);
      newMatched.add(draggedId);
      setMatched(newMatched);
      if (newMatched.size === symbols.length) {
        setTimeout(() => setDone(true), 600);
      }
    } else {
      playEffect('wrong');
    }
  }

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
            <IconCelebration size={56} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: COLORS.text, marginBottom: 8 }}>
            全部配對成功！
          </h2>
          <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
            {Array.from({ length: matched.size }, (_, i) => (
              <IconStar key={i} size={28} />
            ))}
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
            onClick={() => onComplete(matched.size)}
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
          marginBottom: 8,
        }}
      >
        拖拉配對
      </h2>
      <p style={{ textAlign: 'center', color: '#999', fontSize: '0.9rem', marginBottom: 24 }}>
        把注音拖到正確的圖片上！
      </p>

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
          }}
        >
          {/* Left column: draggable symbols */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ textAlign: 'center', fontSize: '0.85rem', color: '#999', marginBottom: 4, fontWeight: 600 }}>
              注音
            </div>
            {symbols.map((sym) => (
              <DraggableCard key={sym.id} symbol={sym} matched={matched.has(sym.id)} />
            ))}
          </div>

          {/* Right column: droppable targets */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ textAlign: 'center', fontSize: '0.85rem', color: '#999', marginBottom: 4, fontWeight: 600 }}>
              圖片
            </div>
            {targets.map((sym) => (
              <DroppableTarget key={sym.id} symbol={sym} matched={matched.has(sym.id)} />
            ))}
          </div>
        </div>
      </DndContext>

      <div style={{ textAlign: 'center', marginTop: 16, color: '#999', fontSize: '0.9rem' }}>
        已配對 {matched.size} / {symbols.length}
      </div>
    </div>
  );
}
