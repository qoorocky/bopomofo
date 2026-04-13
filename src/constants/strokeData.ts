// SVG stroke paths for all 37 Bopomofo symbols.
// Reference: 教育部《國語小字典》注音符號筆順規範
// ViewBox: 0 0 100 100. strokeWidth: 8, strokeLinecap: round, strokeLinejoin: round.
// Glyph bounding box targets x: 15–85, y: 15–85.
// Each string is one stroke's SVG path `d` attribute, in standard writing order
// (先橫後豎、先撇後捺、先上後下、先左後右、先外後內).

export const STROKE_DATA: Record<string, string[]> = {
  // ───── Consonants (聲母) ─────

  // ㄅ (b) — 1 strokes
  // Shape: top bar; right side going down + middle crossbar left; bottom-left curve
  b: [
    'M 34,22 L 26,42 H 74 L 70,74 L 58,88 L 46,86',
  ],

  // ㄆ (p) — 2 strokes
  // Shape: left vertical; middle horizontal going right; right-side curve
  p: [
    'M 32,22 Q 32,22 29,33 Q 26,44 50,42 Q 74,40 74,43 Q 74,46 61,61 Q 48,76 33,82 Q 18,88 18,88',
    'M 34,56 L 74,86',
  ],

  // ㄇ (m) — 2 strokes
  // Shape: top horizontal; left vertical full-height; right short vertical
  m: [
    'M 24,28 V 86',
    'M 26,28 H 76 V 86',
  ],

  // ㄈ (f) — 2 strokes
  // Shape: top bar (left-to-right); left vertical going down + bottom bar going right
  f: [
    'M 22,30 H 80',
    'M 24,30 V 80 L 28,84 H 80',
  ],

  // ㄉ (d) — 2 strokes
  // Shape: right-side sweeping curve (like 刀); horizontal crossbar
  d: [
    'M 32,22 Q 32,22 25,33 Q 18,44 50,43 Q 82,42 77,62 Q 72,82 68,86 Q 64,90 57,88 Q 50,86 50,86',
    'M 50,44 Q 50,44 46,57 Q 42,70 32,78 Q 22,86 22,86',
  ],

  // ㄊ (t) — 3 strokes
  // Shape: short top horizontal; long middle horizontal; vertical through both
  t: [
    'M 20,40 H 82',
    'M 52,22 L 28,84 L 66,78',
    'M 62,64 L 78,88',
  ],

  // ㄋ (n) — 1 strokes
  // Shape: short horizontal; right-side hook curving down-left
  n: [
    'M 24,26 Q 24,26 43,26 Q 62,26 49,39 Q 36,52 60,50 Q 84,48 78,67 Q 72,86 59,88 Q 46,90 46,90',
  ],

  // ㄌ (l) — 2 strokes
  // Shape: main diagonal going down-left; right branch from middle going down-right
  l: [
    'M 30,22 Q 30,22 25,34 Q 20,46 52,44 Q 84,42 79,61 Q 74,80 70,83 Q 66,86 61,84 Q 56,82 56,82',
    'M 56,18 Q 56,18 56,27 Q 56,36 51,47 Q 46,58 33,72 Q 20,86 20,86',
  ],

  // ㄍ (g) — 2 strokes
  // Shape: C-frame (top bar; right vertical; bottom bar going left)
  g: [
    'M 42,22 L 22,52 L 44,86',
    'M 72,24 L 52,52 L 76,86',
  ],

  // ㄎ (k) — 2 strokes
  // Shape: left vertical; upper-right branch; lower-right branch
  k: [
    'M 18,28 H 82',
    'M 44,30 Q 44,30 37,41 Q 30,52 52,50 Q 74,48 70,65 Q 66,82 55,85 Q 44,88 44,88',
  ],

  // ㄏ (h) — 2 strokes
  // Shape: top horizontal (厂); descending curved stroke from mid-top
  h: [
    'M 26,30 V 68 L 18,86',
    'M 26,30 H 80',
  ],

  // ㄐ (j) — 2 strokes
  // Shape: horizontal bar; vertical going down with bottom left-hook
  j: [
    'M 32,24 L 30,72 L 62,62',
    'M 68,22 V 88',
  ],

  // ㄑ (q) — 1 strokes
  // Shape: top horizontal; right-side curve going down-left; small downward tail
  q: [
    'M 62,22 L 36,52 L 64,86',
  ],

  // ㄒ (x) — 2 strokes
  // Shape: center vertical; upper horizontal; lower horizontal
  x: [
    'M 18,28 H 82',
    'M 50,30 V 88',
  ],

  // ㄓ (zh) — 4 strokes
  // Shape: upper S-curve (from 之); middle horizontal; lower-left curve
  zh: [
    'M 26,30 V 60 H 76',
    'M 76,28 V 58',
    'M 50,22 V 84',
    'M 18,84 H 84',
  ],

  // ㄔ (ch) — 3 strokes
  // Shape: 彳 (two short left strokes + one longer right stroke)
  ch: [
    'M 62,20 Q 62,20 51,29 Q 40,38 33,40 Q 26,42 26,42',
    'M 74,32 Q 74,32 62,43 Q 50,54 35,60 Q 20,66 20,66',
    'M 54,52 V 90',
  ],

  // ㄕ (sh) — 3 strokes
  // Shape: 尸 (top bar; left vertical; middle bar; right vertical)
  sh: [
    'M 24,26 H 78 V 52',
    'M 28,52 H 78',
    'M 30,52 Q 30,52 28,63 Q 26,74 21,81 Q 16,88 16,88',
  ],

  // ㄖ (r) — 4 strokes
  // Shape: 日 (left vertical; top+right; middle bar; bottom bar)
  r: [
    'M 26,26 V 82',
    'M 26,26 H 76 V 84',
    'M 44,44 L 56,62',
    'M 28,82 H 74',
  ],

  // ㄗ (z) — 2 strokes
  // Shape: top horizontal; right-side going down + left-curving hook
  z: [
    'M 20,28 Q 20,28 49,28 Q 78,28 79,36 Q 80,44 77,54 Q 74,64 71,67 Q 68,70 64,68 Q 60,66 60,66',
    'M 44,28 V 88',
  ],

  // ㄘ (c) — 2 strokes
  // Shape: upper-right curve; middle horizontal crossbar
  c: [
    'M 16,36 H 84',
    'M 48,20 L 34,58 H 70 L 58,86',
  ],

  // ㄙ (s) — 2 strokes
  // Shape: 厶 (upper diagonal going right; lower curve returning left-up)
  s: [
    'M 48,24 L 22,82 L 68,74',
    'M 66,56 L 80,86',
  ],

  // ───── Vowels (韻母) ─────

  // ㄚ (a) — 2 strokes
  // Shape: 丫 fork (left diagonal + junction continuing down; right arm to junction)
  a: [
    'M 24,26 L 50,50',
    'M 76,24 L 50,50 V 86',
  ],

  // ㄛ (o) — 2 strokes
  // Shape: left vertical; right oval
  o: [
    'M 20,30 H 80',
    'M 52,32 Q 52,32 50,42 Q 48,52 41,53 Q 34,54 29,58 Q 24,62 24,69 Q 24,76 33,80 Q 42,84 51,84 Q 60,84 69,79 Q 78,74 78,74',
  ],

  // ㄜ (e) — 2 strokes
  // Shape: horizontal crossbar; vertical through center
  e: [
    'M 20,34 H 82',
    'M 52,22 Q 52,22 52,39 Q 52,56 41,56 Q 30,56 26,65 Q 22,74 31,80 Q 40,86 51,86 Q 62,86 70,81 Q 78,76 78,76',
  ],

  // ㄝ (eh) — 3 strokes
  // Shape: horizontal crossbar; upper vertical; lower diagonal tail
  eh: [
    'M 16,44 H 84',
    'M 34,24 V 82 L 76,84',
    'M 66,22 L 62,68',
  ],

  // ㄞ (ai) — 3 strokes
  // Shape: left vertical; left horizontal; right oval
  ai: [
    'M 20,26 H 80',
    'M 28,38 L 24,54 H 76 L 68,88',
    'M 54,30 Q 54,30 48,50 Q 42,70 32,78 Q 22,86 22,86',
  ],

  // ㄟ (ei) — 1 stroke
  // Shape: single curved hook stroke (from 乁)
  ei: [
    'M 22,38 L 40,28 L 76,82',
  ],

  // ㄠ (ao) — 3 strokes
  // Shape: two-cell frame (double loop from 么/幺)
  ao: [
    'M 50,22 L 26,56 L 50,54',
    'M 70,38 L 26,84 L 72,76',
    'M 70,64 L 80,86',
  ],

  // ㄡ (ou) — 2 strokes
  // Shape: left outer curve; right inner curve (from 又)
  ou: [
    'M 24,30 Q 24,30 54,29 Q 84,28 70,50 Q 56,72 37,79 Q 18,86 18,86',
    'M 36,46 L 80,84',
  ],

  // ㄢ (an) — 2 strokes
  // Shape: horizontal crossbar; short left arm; right descending curve
  an: [
    'M 22,26 H 70 L 62,56',
    'M 36,38 L 28,58 H 78 L 66,86',
  ],

  // ㄣ (en) — 1 strokes
  // Shape: vertical going down; left-hook returning upward (from 乚)
  en: [
    'M 38,22 L 24,52 H 24 H 78 L 66,86',
  ],

  // ㄤ (ang) — 3 strokes
  // Shape: center vertical; horizontal crossbar; bottom curved stroke
  ang: [
    'M 18,38 H 82',
    'M 48,20 Q 48,20 46,42 Q 44,64 32,75 Q 20,86 20,86',
    'M 56,54 Q 56,54 55,69 Q 54,84 70,85 Q 86,86 86,86',
  ],

  // ㄥ (eng) — 1 strokes
  // Shape: upper arc going right (from 厶); small tail going lower-left
  eng: [
    'M 52,26 L 22,82 L 80,80',
  ],

  // ㄦ (er) — 2 strokes
  // Shape: 儿 (left falling stroke; right vertical-with-hook)
  er: [
    'M 38,22 Q 38,22 37,44 Q 36,66 30,74 Q 24,82 20,83 Q 16,84 16,84',
    'M 60,22 Q 60,22 59,50 Q 58,78 62,82 Q 66,86 76,86 Q 86,86 86,86',
  ],

  // ㄧ (yi) — 1 stroke
  // Shape: single horizontal line
  yi: [
    'M 22,56 H 78',
  ],

  // ㄨ (wu) — 2 strokes
  // Shape: V/∧ (left arm going down-right to apex; right arm going down-left to apex)
  wu: [
    'M 72,24 Q 72,24 62,44 Q 52,64 36,75 Q 20,86 20,86',
    'M 28,32 L 78,80',
  ],

  // ㄩ (yu) — 2 strokes
  // Shape: top horizontal bar; U-body below
  yu: [
    'M 26,24 L 24,84 L 72,82',
    'M 76,24 V 82',
  ],
};
