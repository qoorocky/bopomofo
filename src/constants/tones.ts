export type ToneContour = 'flat' | 'rising' | 'dipping' | 'falling' | 'neutral';

export interface ToneExample {
  syllable: string; // TTS input
  word: string;     // display text (may equal syllable)
  emoji: string;
}

export interface ToneDefinition {
  id: 1 | 2 | 3 | 4 | 5;
  mark: string;
  name: string;
  description: string;
  color: string;
  bgColor: string;
  contour: ToneContour;
  examples: ToneExample[];
}

export const TONES: ToneDefinition[] = [
  {
    id: 1,
    mark: 'ˉ',
    name: '一聲',
    description: '高平調，一直高高的',
    color: '#FF6B6B',
    bgColor: '#FFE8E8',
    contour: 'flat',
    examples: [
      { syllable: '媽', word: '媽媽', emoji: '👩' },
      { syllable: '花', word: '花朵', emoji: '🌸' },
      { syllable: '書', word: '書包', emoji: '📚' },
      { syllable: '天', word: '天空', emoji: '🌤' },
      { syllable: '風', word: '風箏', emoji: '🪁' },
    ],
  },
  {
    id: 2,
    mark: 'ˊ',
    name: '二聲',
    description: '上揚調，像在問問題',
    color: '#FF8E53',
    bgColor: '#FFF0E8',
    contour: 'rising',
    examples: [
      { syllable: '魚', word: '魚缸', emoji: '🐟' },
      { syllable: '糖', word: '糖果', emoji: '🍬' },
      { syllable: '橋', word: '橋梁', emoji: '🌉' },
      { syllable: '蟲', word: '蟲子', emoji: '🐛' },
      { syllable: '門', word: '大門', emoji: '🚪' },
    ],
  },
  {
    id: 3,
    mark: 'ˇ',
    name: '三聲',
    description: '降升調，先低後高',
    color: '#4ECDC4',
    bgColor: '#E8F8F7',
    contour: 'dipping',
    examples: [
      { syllable: '馬', word: '馬匹', emoji: '🐴' },
      { syllable: '水', word: '水果', emoji: '💧' },
      { syllable: '狗', word: '小狗', emoji: '🐶' },
      { syllable: '米', word: '白米', emoji: '🍚' },
      { syllable: '手', word: '手指', emoji: '✋' },
    ],
  },
  {
    id: 4,
    mark: 'ˋ',
    name: '四聲',
    description: '下降調，像在命令',
    color: '#A78BFA',
    bgColor: '#EDE9FE',
    contour: 'falling',
    examples: [
      { syllable: '樹', word: '大樹', emoji: '🌳' },
      { syllable: '月', word: '月亮', emoji: '🌙' },
      { syllable: '兔', word: '兔子', emoji: '🐰' },
      { syllable: '帽', word: '帽子', emoji: '🎩' },
      { syllable: '豹', word: '花豹', emoji: '🐆' },
    ],
  },
  {
    id: 5,
    mark: '˙',
    name: '輕聲',
    description: '短輕聲，輕輕地說',
    color: '#52BE80',
    bgColor: '#E9F7EF',
    contour: 'neutral',
    examples: [
      { syllable: '媽媽', word: '媽媽', emoji: '👩' },
      { syllable: '爸爸', word: '爸爸', emoji: '👨' },
      { syllable: '哥哥', word: '哥哥', emoji: '👦' },
      { syllable: '弟弟', word: '弟弟', emoji: '👶' },
      { syllable: '姐姐', word: '姐姐', emoji: '👧' },
    ],
  },
];

export function getToneById(id: number): ToneDefinition | undefined {
  return TONES.find((t) => t.id === id);
}
