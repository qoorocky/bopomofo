import { getSymbolById } from './bopomofo';

export interface SyllableCombo {
  id: string;
  symbol: string;       // e.g. 'ㄅㄚ'
  tileIds: string[];    // ordered ids referencing BOPOMOFO_SYMBOLS
  exampleWord: string;
  exampleEmoji: string;
  difficulty: 1 | 2 | 3;
}

export const SYLLABLE_COMBOS: SyllableCombo[] = [
  // ── Difficulty 1: single vowel (4) ──────────────────────────────────────────
  { id: 'a_solo',  symbol: 'ㄚ',   tileIds: ['a'],          exampleWord: '啊',   exampleEmoji: '😮', difficulty: 1 },
  { id: 'yi_solo', symbol: 'ㄧ',   tileIds: ['yi'],         exampleWord: '一',   exampleEmoji: '☝️', difficulty: 1 },
  { id: 'wu_solo', symbol: 'ㄨ',   tileIds: ['wu'],         exampleWord: '五',   exampleEmoji: '✋', difficulty: 1 },
  { id: 'yu_solo', symbol: 'ㄩ',   tileIds: ['yu'],         exampleWord: '魚',   exampleEmoji: '🐟', difficulty: 1 },

  // ── Difficulty 2: consonant + vowel (10) ────────────────────────────────────
  { id: 'ba',  symbol: 'ㄅㄚ',  tileIds: ['b', 'a'],    exampleWord: '爸爸', exampleEmoji: '👨', difficulty: 2 },
  { id: 'ma',  symbol: 'ㄇㄚ',  tileIds: ['m', 'a'],    exampleWord: '媽媽', exampleEmoji: '👩', difficulty: 2 },
  { id: 'da',  symbol: 'ㄉㄚ',  tileIds: ['d', 'a'],    exampleWord: '大',   exampleEmoji: '👍', difficulty: 2 },
  { id: 'he',  symbol: 'ㄏㄜ',  tileIds: ['h', 'e'],    exampleWord: '喝',   exampleEmoji: '🥤', difficulty: 2 },
  { id: 'hao', symbol: 'ㄏㄠ',  tileIds: ['h', 'ao'],   exampleWord: '好',   exampleEmoji: '😊', difficulty: 2 },
  { id: 'gou', symbol: 'ㄍㄡ',  tileIds: ['g', 'ou'],   exampleWord: '狗',   exampleEmoji: '🐶', difficulty: 2 },
  { id: 'san', symbol: 'ㄙㄢ',  tileIds: ['s', 'an'],   exampleWord: '三',   exampleEmoji: '3️⃣', difficulty: 2 },
  { id: 'fei', symbol: 'ㄈㄟ',  tileIds: ['f', 'ei'],   exampleWord: '飛',   exampleEmoji: '✈️', difficulty: 2 },
  { id: 'ni',  symbol: 'ㄋㄧ',  tileIds: ['n', 'yi'],   exampleWord: '你',   exampleEmoji: '👉', difficulty: 2 },
  { id: 'ke',  symbol: 'ㄎㄜ',  tileIds: ['k', 'e'],    exampleWord: '可以', exampleEmoji: '✅', difficulty: 2 },

  // ── Difficulty 3: medial+final (VV) or three-tile (C+M+F) (10) ─────────────
  { id: 'yao',   symbol: 'ㄧㄠ',   tileIds: ['yi', 'ao'],          exampleWord: '要',  exampleEmoji: '💪', difficulty: 3 },
  { id: 'wo',    symbol: 'ㄨㄛ',   tileIds: ['wu', 'o'],           exampleWord: '我',  exampleEmoji: '🙋', difficulty: 3 },
  { id: 'yue',   symbol: 'ㄩㄝ',   tileIds: ['yu', 'eh'],          exampleWord: '月',  exampleEmoji: '🌙', difficulty: 3 },
  { id: 'wei',   symbol: 'ㄨㄟ',   tileIds: ['wu', 'ei'],          exampleWord: '為',  exampleEmoji: '❓', difficulty: 3 },
  { id: 'bian',  symbol: 'ㄅㄧㄢ', tileIds: ['b', 'yi', 'an'],     exampleWord: '變',  exampleEmoji: '✨', difficulty: 3 },
  { id: 'guan',  symbol: 'ㄍㄨㄢ', tileIds: ['g', 'wu', 'an'],     exampleWord: '關',  exampleEmoji: '🚪', difficulty: 3 },
  { id: 'xue',   symbol: 'ㄒㄩㄝ', tileIds: ['x', 'yu', 'eh'],     exampleWord: '學',  exampleEmoji: '📚', difficulty: 3 },
  { id: 'liang', symbol: 'ㄌㄧㄤ', tileIds: ['l', 'yi', 'ang'],    exampleWord: '亮',  exampleEmoji: '💡', difficulty: 3 },
  { id: 'jia',   symbol: 'ㄐㄧㄚ', tileIds: ['j', 'yi', 'a'],      exampleWord: '家',  exampleEmoji: '🏠', difficulty: 3 },
  { id: 'dui',   symbol: 'ㄉㄨㄟ', tileIds: ['d', 'wu', 'ei'],     exampleWord: '對',  exampleEmoji: '✅', difficulty: 3 },
];

// Runtime sanity check — throws at import time in dev if a tileId is invalid
if (import.meta.env.DEV) {
  SYLLABLE_COMBOS.forEach((c) => {
    c.tileIds.forEach((id) => {
      if (!getSymbolById(id)) {
        throw new Error(`[combos] invalid tileId "${id}" in combo "${c.id}"`);
      }
    });
  });
}

function pickRandom<T>(arr: T[], n: number): T[] {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n);
}

export function buildRound(size = 8): SyllableCombo[] {
  const easy   = pickRandom(SYLLABLE_COMBOS.filter((c) => c.difficulty === 1), 2);
  const medium = pickRandom(SYLLABLE_COMBOS.filter((c) => c.difficulty === 2), 4);
  const hard   = pickRandom(SYLLABLE_COMBOS.filter((c) => c.difficulty === 3), size - easy.length - medium.length);
  return [...easy, ...medium, ...hard].sort(() => Math.random() - 0.5);
}
