// SVG stroke paths for all 37 Bopomofo symbols.
// Reference: 教育部《國語小字典》注音符號筆順規範
// ViewBox: 0 0 100 100. strokeWidth: 8, strokeLinecap: round, strokeLinejoin: round.
// Glyph bounding box targets x: 15–85, y: 15–85.
// Each string is one stroke's SVG path `d` attribute, in standard writing order
// (先橫後豎、先撇後捺、先上後下、先左後右、先外後內).

export const STROKE_DATA: Record<string, string[]> = {
  // ───── Consonants (聲母) ─────

  // ㄅ (b) — 3 strokes
  // Shape: top bar; right side going down + middle crossbar left; bottom-left curve
  b: [
    'M 16,22 H 84',
    'M 84,22 Q 84,22 84,38 Q 84,54 52,54 Q 20,54 20,54',
    'M 20,54 Q 20,54 16,62 Q 12,70 24,79 Q 36,88 46,89 Q 56,90 67,86 Q 78,82 78,82',
  ],

  // ㄆ (p) — 3 strokes
  // Shape: left vertical; middle horizontal going right; right-side curve
  p: [
    'M 22,14 V 86',
    'M 22,48 H 76',
    'M 76,48 Q 76,48 83,56 Q 90,64 87,70 Q 84,76 71,83 Q 58,90 49,88 Q 40,86 40,86',
  ],

  // ㄇ (m) — 3 strokes
  // Shape: top horizontal; left vertical full-height; right short vertical
  m: [
    'M 16,22 H 84',
    'M 16,22 V 84',
    'M 84,22 V 58',
  ],

  // ㄈ (f) — 2 strokes
  // Shape: top bar (left-to-right); left vertical going down + bottom bar going right
  f: [
    'M 16,22 H 84',
    'M 16,22 Q 16,22 16,50 Q 16,78 45,78 Q 74,78 74,78',
  ],

  // ㄉ (d) — 2 strokes
  // Shape: right-side sweeping curve (like 刀); horizontal crossbar
  d: [
    'M 56,14 Q 56,14 65,19 Q 74,24 77,29 Q 80,34 80,42 Q 80,50 76,59 Q 72,68 58,77 Q 44,86 44,86',
    'M 14,52 H 82',
  ],

  // ㄊ (t) — 3 strokes
  // Shape: short top horizontal; long middle horizontal; vertical through both
  t: [
    'M 38,16 H 62',
    'M 14,38 H 86',
    'M 50,16 V 84',
  ],

  // ㄋ (n) — 2 strokes
  // Shape: short horizontal; right-side hook curving down-left
  n: [
    'M 14,28 H 80',
    'M 72,28 Q 72,28 81,37 Q 90,46 88,54 Q 86,62 73,72 Q 60,82 41,82 Q 22,82 22,82',
  ],

  // ㄌ (l) — 2 strokes
  // Shape: main diagonal going down-left; right branch from middle going down-right
  l: [
    'M 46,12 Q 46,12 50,30 Q 54,48 49,58 Q 44,68 33,76 Q 22,84 22,84',
    'M 54,48 L 84,80',
  ],

  // ㄍ (g) — 3 strokes
  // Shape: C-frame (top bar; right vertical; bottom bar going left)
  g: [
    'M 16,22 H 82',
    'M 82,22 V 78',
    'M 82,78 H 16',
  ],

  // ㄎ (k) — 3 strokes
  // Shape: left vertical; upper-right branch; lower-right branch
  k: [
    'M 22,14 V 86',
    'M 22,40 Q 22,40 38,35 Q 54,30 68,33 Q 82,36 82,36',
    'M 22,58 L 84,84',
  ],

  // ㄏ (h) — 2 strokes
  // Shape: top horizontal (厂); descending curved stroke from mid-top
  h: [
    'M 12,26 H 88',
    'M 28,26 Q 28,26 34,43 Q 40,60 40,68 Q 40,76 32,83 Q 24,90 24,90',
  ],

  // ㄐ (j) — 2 strokes
  // Shape: horizontal bar; vertical going down with bottom left-hook
  j: [
    'M 14,32 H 86',
    'M 50,32 Q 50,32 49,59 Q 48,86 45,89 Q 42,92 35,92 Q 28,92 21,86 Q 14,80 14,80',
  ],

  // ㄑ (q) — 3 strokes
  // Shape: top horizontal; right-side curve going down-left; small downward tail
  q: [
    'M 16,28 H 82',
    'M 82,28 Q 82,28 88,38 Q 94,48 91,57 Q 88,66 79,72 Q 70,78 55,78 Q 40,78 40,78',
    'M 40,78 V 94',
  ],

  // ㄒ (x) — 3 strokes
  // Shape: center vertical; upper horizontal; lower horizontal
  x: [
    'M 50,14 V 86',
    'M 14,36 H 86',
    'M 14,62 H 86',
  ],

  // ㄓ (zh) — 3 strokes
  // Shape: upper S-curve (from 之); middle horizontal; lower-left curve
  zh: [
    'M 52,12 Q 52,12 60,13 Q 68,14 74,20 Q 80,26 81,34 Q 82,42 79,48 Q 76,54 64,60 Q 52,66 39,64 Q 26,62 26,62',
    'M 14,58 H 82',
    'M 14,58 Q 14,58 15,66 Q 16,74 28,81 Q 40,88 49,88 Q 58,88 67,82 Q 76,76 76,76',
  ],

  // ㄔ (ch) — 3 strokes
  // Shape: 彳 (two short left strokes + one longer right stroke)
  ch: [
    'M 28,14 L 26,46',
    'M 24,52 L 22,80',
    'M 56,14 Q 56,14 55,38 Q 54,62 48,74 Q 42,86 42,86',
  ],

  // ㄕ (sh) — 4 strokes
  // Shape: 尸 (top bar; left vertical; middle bar; right vertical)
  sh: [
    'M 18,22 H 80',
    'M 18,22 V 80',
    'M 18,52 H 76',
    'M 76,22 V 88',
  ],

  // ㄖ (r) — 4 strokes
  // Shape: 日 (left vertical; top+right; middle bar; bottom bar)
  r: [
    'M 18,18 V 82',
    'M 18,18 Q 18,18 50,18 Q 82,18 82,50 Q 82,82 82,82',
    'M 18,50 H 82',
    'M 18,82 H 82',
  ],

  // ㄗ (z) — 2 strokes
  // Shape: top horizontal; right-side going down + left-curving hook
  z: [
    'M 18,22 H 82',
    'M 82,22 Q 82,22 80,50 Q 78,78 66,83 Q 54,88 39,84 Q 24,80 24,80',
  ],

  // ㄘ (c) — 2 strokes
  // Shape: upper-right curve; middle horizontal crossbar
  c: [
    'M 22,24 Q 22,24 43,20 Q 64,16 72,21 Q 80,26 82,31 Q 84,36 82,45 Q 80,54 68,64 Q 56,74 56,74',
    'M 14,56 H 72',
  ],

  // ㄙ (s) — 2 strokes
  // Shape: 厶 (upper diagonal going right; lower curve returning left-up)
  s: [
    'M 46,18 Q 46,18 53,19 Q 60,20 65,27 Q 70,34 69,42 Q 68,50 61,57 Q 54,64 54,64',
    'M 54,64 Q 54,64 42,68 Q 30,72 23,64 Q 16,56 17,49 Q 18,42 24,36 Q 30,30 38,27 Q 46,24 46,21 Q 46,18 46,18',
  ],

  // ───── Vowels (韻母) ─────

  // ㄚ (a) — 2 strokes
  // Shape: 丫 fork (left diagonal + junction continuing down; right arm to junction)
  a: [
    'M 36,14 Q 36,14 42,30 Q 48,46 48,56 Q 48,66 44,76 Q 40,86 40,86',
    'M 64,14 Q 64,14 58,24 Q 52,34 50,49 Q 48,64 48,64',
  ],

  // ㄛ (o) — 2 strokes
  // Shape: left vertical; right oval
  o: [
    'M 34,14 V 84',
    'M 34,48 Q 34,48 39,43 Q 44,38 51,37 Q 58,36 65,44 Q 72,52 72,58 Q 72,64 66,72 Q 60,80 53,83 Q 46,86 40,85 Q 34,84 34,84',
  ],

  // ㄜ (e) — 2 strokes
  // Shape: horizontal crossbar; vertical through center
  e: [
    'M 14,44 H 86',
    'M 50,16 V 84',
  ],

  // ㄝ (eh) — 3 strokes
  // Shape: horizontal crossbar; upper vertical; lower diagonal tail
  eh: [
    'M 14,44 H 86',
    'M 50,16 V 44',
    'M 50,44 L 36,82',
  ],

  // ㄞ (ai) — 3 strokes
  // Shape: left vertical; left horizontal; right oval
  ai: [
    'M 42,14 V 84',
    'M 14,42 H 42',
    'M 42,42 Q 42,42 54,39 Q 66,36 72,44 Q 78,52 76,60 Q 74,68 59,77 Q 44,86 44,86',
  ],

  // ㄟ (ei) — 1 stroke
  // Shape: single curved hook stroke (from 乁)
  ei: [
    'M 26,28 Q 26,28 43,51 Q 60,74 59,79 Q 58,84 54,87 Q 50,90 39,87 Q 28,84 28,84',
  ],

  // ㄠ (ao) — 3 strokes
  // Shape: two-cell frame (double loop from 么/幺)
  ao: [
    'M 14,24 Q 14,24 14,53 Q 14,82 32,82 Q 50,82 50,82',
    'M 50,24 V 62',
    'M 50,62 Q 50,62 68,62 Q 86,62 86,43 Q 86,24 68,24 Q 50,24 50,24',
  ],

  // ㄡ (ou) — 2 strokes
  // Shape: left outer curve; right inner curve (from 又)
  ou: [
    'M 28,20 Q 28,20 20,30 Q 12,40 15,55 Q 18,70 33,78 Q 48,86 61,82 Q 74,78 74,78',
    'M 72,28 Q 72,28 79,39 Q 86,50 85,57 Q 84,64 81,69 Q 78,74 67,79 Q 56,84 56,84',
  ],

  // ㄢ (an) — 3 strokes
  // Shape: horizontal crossbar; short left arm; right descending curve
  an: [
    'M 12,46 H 88',
    'M 46,14 L 38,46',
    'M 46,46 Q 46,46 59,58 Q 72,70 73,79 Q 74,88 61,90 Q 48,92 36,86 Q 24,80 24,80',
  ],

  // ㄣ (en) — 2 strokes
  // Shape: vertical going down; left-hook returning upward (from 乚)
  en: [
    'M 50,14 V 66',
    'M 50,66 Q 50,66 42,73 Q 34,80 28,79 Q 22,78 20,67 Q 18,56 24,48 Q 30,40 30,40',
  ],

  // ㄤ (ang) — 3 strokes
  // Shape: center vertical; horizontal crossbar; bottom curved stroke
  ang: [
    'M 50,14 V 84',
    'M 14,44 H 86',
    'M 20,68 Q 20,68 37,65 Q 54,62 67,66 Q 80,70 80,70',
  ],

  // ㄥ (eng) — 2 strokes
  // Shape: upper arc going right (from 厶); small tail going lower-left
  eng: [
    'M 20,50 Q 20,50 21,38 Q 22,26 29,21 Q 36,16 50,16 Q 64,16 73,24 Q 82,32 83,42 Q 84,52 78,61 Q 72,70 64,74 Q 56,78 44,77 Q 32,76 32,76',
    'M 32,76 Q 32,76 28,77 Q 24,78 19,71 Q 14,64 14,64',
  ],

  // ㄦ (er) — 2 strokes
  // Shape: 儿 (left falling stroke; right vertical-with-hook)
  er: [
    'M 42,14 Q 42,14 31,42 Q 20,70 23,80 Q 26,90 26,90',
    'M 58,14 Q 58,14 58,44 Q 58,74 65,81 Q 72,88 72,88',
  ],

  // ㄧ (yi) — 1 stroke
  // Shape: single horizontal line
  yi: [
    'M 12,50 H 88',
  ],

  // ㄨ (wu) — 2 strokes
  // Shape: V/∧ (left arm going down-right to apex; right arm going down-left to apex)
  wu: [
    'M 18,22 L 50,84',
    'M 82,22 L 50,84',
  ],

  // ㄩ (yu) — 2 strokes
  // Shape: top horizontal bar; U-body below
  yu: [
    'M 20,24 H 80',
    'M 20,24 Q 20,24 20,48 Q 20,72 27,81 Q 34,90 50,90 Q 66,90 70,87 Q 74,84 77,78 Q 80,72 80,48 Q 80,24 80,24',
  ],
};
