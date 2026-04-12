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
    </>
  );
}
