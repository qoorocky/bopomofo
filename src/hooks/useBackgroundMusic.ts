import { useEffect } from 'react';
import { Howl } from 'howler';
import { BGM_TRACKS } from '../constants/audioAssets';
import { useAudioSettingsStore } from '../stores/useAudioSettingsStore';

// Module-level singleton so the Howl instance survives route changes
let bgmHowl: Howl | null = null;
let audioUnlocked = false;
let pendingPlay = false;

function effectiveBgmVolume(): number {
  const { masterVolume, bgmVolume } = useAudioSettingsStore.getState();
  return Math.min(1, masterVolume * bgmVolume * BGM_TRACKS.main.volume);
}

function ensureHowl(): Howl {
  if (bgmHowl) return bgmHowl;
  bgmHowl = new Howl({
    src: BGM_TRACKS.main.src,
    volume: 0,
    loop: true,
    preload: true,
    onloaderror: () => {
      bgmHowl = null;
    },
  });
  return bgmHowl;
}

function startBgm(): void {
  if (!audioUnlocked) {
    pendingPlay = true;
    return;
  }
  const { bgmEnabled } = useAudioSettingsStore.getState();
  if (!bgmEnabled) return;
  const howl = ensureHowl();
  if (!howl) return;
  if (!howl.playing()) {
    howl.volume(0);
    howl.play();
    howl.fade(0, effectiveBgmVolume(), 600);
  }
}

function stopBgm(): void {
  if (!bgmHowl || !bgmHowl.playing()) return;
  const vol = bgmHowl.volume();
  bgmHowl.fade(vol, 0, 300);
  setTimeout(() => bgmHowl?.pause(), 320);
}

function resumeBgm(): void {
  if (!audioUnlocked) return;
  const { bgmEnabled } = useAudioSettingsStore.getState();
  if (!bgmEnabled || !bgmHowl) return;
  if (!bgmHowl.playing()) {
    bgmHowl.volume(0);
    bgmHowl.play();
    bgmHowl.fade(0, effectiveBgmVolume(), 400);
  }
}

// Called once on first user gesture in AppShell
export function unlockAudio(): void {
  if (audioUnlocked) return;
  audioUnlocked = true;
  if (pendingPlay) {
    pendingPlay = false;
    startBgm();
  }
}

export function useBackgroundMusic() {
  useEffect(() => {
    // Kick off BGM (may be deferred until unlock)
    startBgm();

    // React to settings changes
    const unsub = useAudioSettingsStore.subscribe((state, prev) => {
      if (!bgmHowl) return;

      if (state.bgmEnabled !== prev.bgmEnabled) {
        if (state.bgmEnabled) {
          resumeBgm();
        } else {
          stopBgm();
        }
        return;
      }

      // Volume changed
      if (
        state.masterVolume !== prev.masterVolume ||
        state.bgmVolume !== prev.bgmVolume
      ) {
        if (state.bgmEnabled && bgmHowl.playing()) {
          bgmHowl.volume(effectiveBgmVolume());
        }
      }
    });

    // Pause on tab hide, resume on tab show
    function onVisibilityChange() {
      if (document.hidden) {
        bgmHowl?.pause();
      } else {
        resumeBgm();
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      unsub();
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);
}
