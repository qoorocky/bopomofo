import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import AudioSettingsButton from '../common/AudioSettingsButton';
import { useBackgroundMusic, unlockAudio } from '../../hooks/useBackgroundMusic';

export default function AppShell() {
  useBackgroundMusic();

  // Unlock audio on first user gesture (required for mobile autoplay)
  useEffect(() => {
    function onFirstGesture() {
      unlockAudio();
      document.removeEventListener('pointerdown', onFirstGesture);
    }
    document.addEventListener('pointerdown', onFirstGesture);
    return () => document.removeEventListener('pointerdown', onFirstGesture);
  }, []);

  return (
    <>
      <main
        style={{
          maxWidth: 600,
          margin: '0 auto',
          minHeight: '100dvh',
          paddingBottom: 72,
          position: 'relative',
        }}
      >
        <Outlet />
      </main>
      <NavBar />
      <AudioSettingsButton />
      <span
        style={{
          position: 'fixed',
          bottom: 78,
          left: 10,
          fontSize: '0.65rem',
          color: 'rgba(0,0,0,0.28)',
          pointerEvents: 'none',
          userSelect: 'none',
          letterSpacing: '0.03em',
        }}
      >
        v{__APP_VERSION__}
      </span>
    </>
  );
}
