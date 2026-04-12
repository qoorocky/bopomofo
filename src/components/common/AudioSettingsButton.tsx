import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAudioSettingsStore } from '../../stores/useAudioSettingsStore';
import { IconSpeakerOn, IconSpeakerOff } from './SvgIcons';
import AudioSettingsPanel from './AudioSettingsPanel';

export default function AudioSettingsButton() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const bgmEnabled = useAudioSettingsStore((s) => s.bgmEnabled);
  const sfxEnabled = useAudioSettingsStore((s) => s.sfxEnabled);
  const audioOn = bgmEnabled || sfxEnabled;

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  return (
    <div
      ref={containerRef}
      style={{ position: 'fixed', top: 12, right: 12, zIndex: 150 }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close audio settings' : 'Open audio settings'}
        style={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          border: 'none',
          backgroundColor: open ? '#2D3436' : 'rgba(255,255,255,0.9)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          touchAction: 'manipulation',
          transition: 'background-color 0.15s',
          backdropFilter: 'blur(4px)',
        }}
      >
        {audioOn
          ? <IconSpeakerOn size={22} color={open ? '#FFFFFF' : '#FF6B6B'} />
          : <IconSpeakerOff size={22} color={open ? '#FFFFFF' : '#B2BEC3'} />
        }
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{ position: 'absolute', top: 52, right: 0 }}
          >
            <AudioSettingsPanel />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
