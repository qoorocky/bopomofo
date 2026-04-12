import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AudioSettingsState {
  bgmEnabled: boolean;
  sfxEnabled: boolean;
  masterVolume: number;
  bgmVolume: number;
  sfxVolume: number;
  toggleBgm: () => void;
  toggleSfx: () => void;
  setMasterVolume: (v: number) => void;
  setBgmVolume: (v: number) => void;
  setSfxVolume: (v: number) => void;
}

export const useAudioSettingsStore = create<AudioSettingsState>()(
  persist(
    (set) => ({
      bgmEnabled: true,
      sfxEnabled: true,
      masterVolume: 0.7,
      bgmVolume: 0.4,
      sfxVolume: 0.8,
      toggleBgm: () => set((s) => ({ bgmEnabled: !s.bgmEnabled })),
      toggleSfx: () => set((s) => ({ sfxEnabled: !s.sfxEnabled })),
      setMasterVolume: (v) => set({ masterVolume: v }),
      setBgmVolume: (v) => set({ bgmVolume: v }),
      setSfxVolume: (v) => set({ sfxVolume: v }),
    }),
    { name: 'bopomoo-audio-settings' },
  ),
);
