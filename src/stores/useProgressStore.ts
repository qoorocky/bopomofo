import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type SymbolStatus = 'new' | 'learning' | 'mastered';

interface ProgressState {
  symbolStatus: Record<string, SymbolStatus>;
  phonemeHeard: Record<string, boolean>;
  totalStars: number;
  gameScores: Record<string, number>;

  // Actions
  markLearning: (id: string) => void;
  markMastered: (id: string) => void;
  markPhonemeHeard: (id: string) => void;
  addStars: (count: number) => void;
  updateGameScore: (gameId: string, score: number) => void;
  resetProgress: () => void;
}

const initialState = {
  symbolStatus: {} as Record<string, SymbolStatus>,
  phonemeHeard: {} as Record<string, boolean>,
  totalStars: 0,
  gameScores: {} as Record<string, number>,
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      ...initialState,

      markPhonemeHeard: (id) =>
        set((state) => ({
          phonemeHeard: { ...state.phonemeHeard, [id]: true },
        })),

      markLearning: (id) =>
        set((state) => ({
          symbolStatus: {
            ...state.symbolStatus,
            [id]: state.symbolStatus[id] === 'mastered' ? 'mastered' : 'learning',
          },
        })),

      markMastered: (id) =>
        set((state) => ({
          symbolStatus: {
            ...state.symbolStatus,
            [id]: 'mastered',
          },
        })),

      addStars: (count) =>
        set((state) => ({
          totalStars: state.totalStars + count,
        })),

      updateGameScore: (gameId, score) =>
        set((state) => ({
          gameScores: {
            ...state.gameScores,
            [gameId]: Math.max(state.gameScores[gameId] ?? 0, score),
          },
        })),

      resetProgress: () => set({ ...initialState }),
    }),
    {
      name: 'bopomofo-progress',
    },
  ),
);
