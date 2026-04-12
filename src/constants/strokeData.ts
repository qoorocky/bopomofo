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
    'M 84,22 V 54 H 20',
    'M 20,54 Q 12,70 24,80 Q 44,92 78,82',
  ],

  // ㄆ (p) — 3 strokes
  // Shape: left vertical; middle horizontal going right; right-side curve
  p: [
    'M 22,14 V 86',
    'M 22,48 H 76',
    'M 76,48 Q 92,60 80,76 Q 66,90 40,84',
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
    'M 16,22 V 78 H 74',
  ],

  // ㄉ (d) — 2 strokes
  // Shape: right-side sweeping curve (like 刀); horizontal crossbar
  d: [
    'M 56,14 Q 84,28 80,54 Q 74,74 46,86',
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
    'M 70,28 Q 94,44 78,66 Q 62,90 24,84',
  ],

  // ㄌ (l) — 2 strokes
  // Shape: main diagonal going down-left; right branch from middle going down-right
  l: [
    'M 46,12 Q 62,32 54,56 Q 46,72 20,86',
    'M 54,56 Q 70,64 86,82',
  ],

  // ㄍ (g) — 3 strokes
  // Shape: C-frame (top bar; right vertical; bottom bar going left)
  g: [
    'M 16,22 H 82',
    'M 82,22 V 78',
    'M 16,78 H 82',
  ],

  // ㄎ (k) — 3 strokes
  // Shape: left vertical; upper-right branch; lower-right branch
  k: [
    'M 22,14 V 86',
    'M 22,40 Q 56,26 82,36',
    'M 22,58 Q 56,72 84,84',
  ],

  // ㄏ (h) — 2 strokes
  // Shape: top horizontal (厂); descending curved stroke from mid-top
  h: [
    'M 12,26 H 88',
    'M 28,26 Q 40,50 42,68 Q 42,84 32,90',
  ],

  // ㄐ (j) — 2 strokes
  // Shape: horizontal bar; vertical going down with bottom left-hook
  j: [
    'M 14,30 H 86',
    'M 50,30 V 78 Q 48,92 32,92 Q 16,92 15,80',
  ],

  // ㄑ (q) — 3 strokes
  // Shape: top horizontal; right-side curve going down-left; small downward tail
  q: [
    'M 16,28 H 82',
    'M 82,28 Q 96,48 80,66 Q 62,82 38,78',
    'M 38,78 V 94',
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
    'M 52,12 Q 78,14 82,30 Q 86,48 66,60 Q 48,70 26,64',
    'M 14,54 H 82',
    'M 14,54 Q 10,70 22,82 Q 42,96 74,84',
  ],

  // ㄔ (ch) — 3 strokes
  // Shape: 彳 (two short left strokes + one longer right stroke)
  ch: [
    'M 28,14 Q 24,28 26,46',
    'M 24,52 Q 20,66 22,80',
    'M 56,14 Q 52,36 54,58 Q 54,72 46,84',
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
    'M 18,18 H 82 V 82',
    'M 18,50 H 82',
    'M 18,82 H 82',
  ],

  // ㄗ (z) — 2 strokes
  // Shape: top horizontal; right-side going down + left-curving hook
  z: [
    'M 18,22 H 82',
    'M 82,22 V 62 Q 80,78 62,84 Q 44,92 26,84',
  ],

  // ㄘ (c) — 2 strokes
  // Shape: upper-right curve; middle horizontal crossbar
  c: [
    'M 22,24 Q 74,18 82,38 Q 86,56 72,68',
    'M 14,56 H 72',
  ],

  // ㄙ (s) — 2 strokes
  // Shape: 厶 (upper diagonal going right; lower curve returning left-up)
  s: [
    'M 46,18 Q 72,24 70,44 Q 68,58 54,64',
    'M 54,64 Q 30,76 22,62 Q 16,46 30,36 Q 42,26 46,18',
  ],

  // ───── Vowels (韻母) ─────

  // ㄚ (a) — 2 strokes
  // Shape: 丫 fork (left diagonal + junction continuing down; right arm to junction)
  a: [
    'M 36,14 Q 50,36 50,60 Q 50,76 40,88',
    'M 64,14 Q 52,36 50,60',
  ],

  // ㄛ (o) — 2 strokes
  // Shape: left vertical; right oval
  o: [
    'M 34,14 V 84',
    'M 34,48 Q 58,36 70,50 Q 80,66 68,78 Q 52,90 36,84',
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
    'M 50,44 Q 44,66 36,84',
  ],

  // ㄞ (ai) — 3 strokes
  // Shape: left vertical; left horizontal; right oval
  ai: [
    'M 42,14 V 84',
    'M 14,42 H 42',
    'M 42,42 Q 70,36 80,50 Q 88,68 74,80 Q 58,92 44,86',
  ],

  // ㄟ (ei) — 1 stroke
  // Shape: single curved hook stroke (from 乁)
  ei: [
    'M 26,28 Q 52,50 62,68 Q 66,84 52,90 Q 36,96 26,82',
  ],

  // ㄠ (ao) — 3 strokes
  // Shape: two-cell frame (double loop from 么/幺)
  ao: [
    'M 14,24 V 82 H 50',
    'M 50,24 V 62',
    'M 50,62 H 86 V 24',
  ],

  // ㄡ (ou) — 2 strokes
  // Shape: left outer curve; right inner curve (from 又)
  ou: [
    'M 28,20 Q 12,34 12,52 Q 12,74 34,84 Q 58,94 72,80',
    'M 72,28 Q 88,44 86,64 Q 82,80 66,86',
  ],

  // ㄢ (an) — 3 strokes
  // Shape: horizontal crossbar; short left arm; right descending curve
  an: [
    'M 12,46 H 88',
    'M 46,14 Q 44,30 38,46',
    'M 46,46 Q 70,58 76,76 Q 78,90 58,92 Q 38,96 22,84',
  ],

  // ㄣ (en) — 2 strokes
  // Shape: vertical going down; left-hook returning upward (from 乚)
  en: [
    'M 50,14 V 66',
    'M 50,66 Q 28,76 22,62 Q 18,48 28,38',
  ],

  // ㄤ (ang) — 3 strokes
  // Shape: center vertical; horizontal crossbar; bottom curved stroke
  ang: [
    'M 50,14 V 84',
    'M 14,44 H 86',
    'M 20,68 Q 50,58 80,70',
  ],

  // ㄥ (eng) — 2 strokes
  // Shape: upper arc going right (from 厶); small tail going lower-left
  eng: [
    'M 20,50 Q 22,24 50,18 Q 78,12 84,38 Q 88,58 72,70 Q 54,82 32,78',
    'M 32,78 Q 16,82 14,68',
  ],

  // ㄦ (er) — 2 strokes
  // Shape: 儿 (left falling stroke; right vertical-with-hook)
  er: [
    'M 42,14 Q 28,40 20,68 Q 16,84 24,90',
    'M 58,14 V 68 Q 60,82 70,88',
  ],

  // ㄧ (yi) — 1 stroke
  // Shape: single horizontal line
  yi: [
    'M 12,50 H 88',
  ],

  // ㄨ (wu) — 2 strokes
  // Shape: V/∧ (left arm going down-right to apex; right arm going down-left to apex)
  wu: [
    'M 18,22 Q 38,62 50,82',
    'M 82,22 Q 62,62 50,82',
  ],

  // ㄩ (yu) — 2 strokes
  // Shape: top horizontal bar; U-body below
  yu: [
    'M 20,24 H 80',
    'M 20,24 V 70 Q 22,88 50,90 Q 78,88 80,70 V 24',
  ],
};
