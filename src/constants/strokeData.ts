// SVG stroke paths for all 37 Bopomofo symbols.
// ViewBox: 0 0 100 100. Each string is one stroke's SVG path `d` attribute.
// Strokes are ordered first-to-last following standard writing order.

export const STROKE_DATA: Record<string, string[]> = {
  // ───── Consonants ─────

  // ㄅ (b) — 3 strokes
  b: [
    'M 14,28 H 86',
    'M 72,28 C 90,44 86,70 66,80 Q 44,90 14,84',
    'M 14,56 H 70',
  ],

  // ㄆ (p) — 3 strokes
  p: [
    'M 20,14 V 86',
    'M 20,46 H 82',
    'M 82,46 Q 96,62 78,76 Q 60,90 36,84',
  ],

  // ㄇ (m) — 3 strokes (open on the right)
  m: [
    'M 14,24 H 86',
    'M 14,24 V 84',
    'M 14,84 H 80',
  ],

  // ㄈ (f) — 2 strokes (⌐ shape)
  f: [
    'M 14,26 H 86',
    'M 14,26 V 82',
  ],

  // ㄉ (d) — 2 strokes (knife-blade curve + horizontal)
  d: [
    'M 46,12 Q 78,28 74,54 Q 66,74 34,84',
    'M 12,52 H 86',
  ],

  // ㄊ (t) — 3 strokes (T with small top serif)
  t: [
    'M 50,12 V 36',
    'M 14,36 H 86',
    'M 50,36 V 88',
  ],

  // ㄋ (n) — 2 strokes
  n: [
    'M 14,28 H 78',
    'M 68,28 Q 92,46 76,68 Q 58,90 20,86',
  ],

  // ㄌ (l) — 2 strokes (person-walking shape)
  l: [
    'M 46,12 Q 62,32 54,56 Q 46,72 18,86',
    'M 54,56 Q 72,64 88,84',
  ],

  // ㄍ (g) — 3 strokes (⊏ shape)
  g: [
    'M 20,26 H 82',
    'M 20,26 V 80',
    'M 20,80 H 82',
  ],

  // ㄎ (k) — 3 strokes (vertical + two right branches)
  k: [
    'M 18,14 V 86',
    'M 18,40 Q 56,26 80,38',
    'M 18,58 Q 56,72 82,86',
  ],

  // ㄏ (h) — 2 strokes (厂 shape)
  h: [
    'M 12,28 H 88',
    'M 26,28 Q 38,50 40,70 Q 40,84 30,90',
  ],

  // ㄐ (j) — 2 strokes (cross with bottom hook)
  j: [
    'M 14,30 H 86',
    'M 50,30 V 76 Q 48,90 32,90 Q 16,90 14,78',
  ],

  // ㄑ (q) — 3 strokes
  q: [
    'M 16,28 H 84',
    'M 84,28 Q 96,48 80,66 Q 62,82 40,78',
    'M 40,78 V 94',
  ],

  // ㄒ (x) — 3 strokes (two horizontals, one vertical)
  x: [
    'M 50,14 V 86',
    'M 12,36 H 88',
    'M 12,64 H 88',
  ],

  // ㄓ (zh) — 2 strokes (之-like curve + horizontal)
  zh: [
    'M 50,12 Q 78,28 74,54 Q 66,74 46,82 Q 26,90 12,80',
    'M 12,54 H 74',
  ],

  // ㄔ (ch) — 3 strokes (彳-like, three short strokes)
  ch: [
    'M 28,14 Q 22,28 24,50',
    'M 24,54 Q 18,68 22,82',
    'M 56,14 Q 50,34 52,58 Q 52,74 44,86',
  ],

  // ㄕ (sh) — 4 strokes (尸-like)
  sh: [
    'M 18,22 H 80',
    'M 18,22 Q 14,48 18,78',
    'M 18,52 H 76',
    'M 76,22 V 88',
  ],

  // ㄖ (r) — 2 strokes (日-like: outer frame + middle bar)
  r: [
    'M 18,18 H 82 V 82 H 18 V 18',
    'M 18,50 H 82',
  ],

  // ㄗ (z) — 2 strokes
  z: [
    'M 18,22 H 82',
    'M 82,22 V 60 Q 80,76 62,84 Q 44,90 26,82',
  ],

  // ㄘ (c) — 2 strokes
  c: [
    'M 22,24 Q 74,20 80,38 Q 84,56 70,68',
    'M 14,56 H 70',
  ],

  // ㄙ (s) — 1 stroke (closed loop)
  s: [
    'M 50,18 Q 80,16 84,42 Q 88,62 68,74 Q 48,86 28,78 Q 12,68 12,52 Q 14,36 34,28 Q 50,22 50,18',
  ],

  // ───── Vowels ─────

  // ㄚ (a) — 2 strokes
  a: [
    'M 40,12 V 80 Q 38,90 28,92',
    'M 64,30 Q 80,44 80,62 Q 80,78 66,86 Q 50,92 38,86',
  ],

  // ㄛ (o) — 2 strokes
  o: [
    'M 36,12 V 84',
    'M 36,46 Q 62,36 72,52 Q 80,66 68,78 Q 54,88 38,86',
  ],

  // ㄜ (e) — 2 strokes
  e: [
    'M 12,46 H 88',
    'M 50,14 V 86',
  ],

  // ㄝ (eh) — 3 strokes
  eh: [
    'M 12,46 H 88',
    'M 50,14 V 46',
    'M 50,46 Q 46,70 38,86',
  ],

  // ㄞ (ai) — 3 strokes
  ai: [
    'M 46,12 V 88',
    'M 12,42 H 46',
    'M 46,42 Q 74,38 82,52 Q 88,68 74,80 Q 58,90 46,86',
  ],

  // ㄟ (ei) — 3 strokes
  ei: [
    'M 50,12 V 50',
    'M 12,50 H 88',
    'M 50,50 Q 46,72 38,88',
  ],

  // ㄠ (ao) — 3 strokes (凹-like)
  ao: [
    'M 14,24 V 82 H 50',
    'M 50,24 V 62',
    'M 50,62 H 86 V 24',
  ],

  // ㄡ (ou) — 2 strokes
  ou: [
    'M 36,14 Q 16,28 16,50 Q 16,74 36,84 Q 58,94 72,82',
    'M 72,26 Q 86,42 84,62 Q 80,78 64,86',
  ],

  // ㄢ (an) — 3 strokes
  an: [
    'M 12,46 H 88',
    'M 46,12 Q 44,28 38,46',
    'M 46,46 Q 70,58 76,76 Q 78,90 58,92 Q 38,96 22,86',
  ],

  // ㄣ (en) — 2 strokes
  en: [
    'M 50,12 V 66',
    'M 50,66 Q 28,76 22,62 Q 18,48 28,38',
  ],

  // ㄤ (ang) — 3 strokes
  ang: [
    'M 50,12 V 88',
    'M 12,44 H 88',
    'M 20,68 Q 50,58 80,70',
  ],

  // ㄥ (eng) — 2 strokes
  eng: [
    'M 20,52 Q 22,24 50,18 Q 78,12 84,38 Q 88,58 72,70 Q 54,82 32,78',
    'M 32,78 Q 16,82 14,68',
  ],

  // ㄦ (er) — 2 strokes (兒-simplified)
  er: [
    'M 28,12 Q 20,36 24,62 Q 28,82 50,90',
    'M 50,12 Q 68,34 70,60 Q 72,80 56,90',
  ],

  // ㄧ (yi) — 1 stroke (single horizontal)
  yi: [
    'M 12,50 H 88',
  ],

  // ㄨ (wu) — 1 stroke (∧ V-shape)
  wu: [
    'M 16,22 Q 38,64 50,84 Q 62,64 84,22',
  ],

  // ㄩ (yu) — 2 strokes (top bar + U body)
  yu: [
    'M 20,24 H 80',
    'M 20,24 V 72 Q 22,88 50,90 Q 78,88 80,72 V 24',
  ],
};
