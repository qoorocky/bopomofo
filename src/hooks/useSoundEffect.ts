import { Howl } from 'howler';
import { SFX_LIBRARY, type SfxId } from '../constants/audioAssets';
import { useAudioSettingsStore } from '../stores/useAudioSettingsStore';

// Module-level Howl cache — one instance per effect id, persists across renders
const howlCache = new Map<SfxId, Howl>();
const failedSet = new Set<SfxId>();
const lastPlayTime = new Map<SfxId, number>();
const THROTTLE_MS = 50;

function getHowl(id: SfxId): Howl | null {
  if (failedSet.has(id)) return null;
  if (howlCache.has(id)) return howlCache.get(id)!;

  const def = SFX_LIBRARY[id];
  const howl = new Howl({
    src: def.src,
    volume: def.volume,
    preload: true,
    pool: def.pool ?? 1,
    onloaderror: () => {
      failedSet.add(id);
    },
  });
  howlCache.set(id, howl);
  return howl;
}

/** Returns true after a load failure so callers can use a fallback. */
export function isSfxMissing(id: SfxId): boolean {
  return failedSet.has(id);
}

// Exported as a plain function so it can be used in callbacks without stale refs
export function playSfx(id: SfxId): void {
  const { sfxEnabled, masterVolume, sfxVolume } = useAudioSettingsStore.getState();
  if (!sfxEnabled) return;

  // Throttle rapid-fire sounds (e.g. pop during drag)
  const now = Date.now();
  const last = lastPlayTime.get(id) ?? 0;
  if (now - last < THROTTLE_MS) return;
  lastPlayTime.set(id, now);

  const howl = getHowl(id);
  if (!howl) return; // file missing — sine-wave fallback handled by useAudio.playEffect

  const effectiveVolume = Math.min(1, masterVolume * sfxVolume * SFX_LIBRARY[id].volume);
  const soundId = howl.play();
  howl.volume(effectiveVolume, soundId);
}

// Hook wrapper — components can call useSoundEffect() to get a stable playSfx ref
export function useSoundEffect() {
  return { playSfx };
}
