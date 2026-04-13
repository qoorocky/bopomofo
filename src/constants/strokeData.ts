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
    'M 20,54 L 12,70 L 36,88 L 56,90 L 78,82',
  ],

  // ㄆ (p) — 3 strokes
  // Shape: left vertical; middle horizontal going right; right-side curve
  p: [
    'M 22,14 V 86',
    'M 22,48 H 76',
    'M 76,48 L 90,64 L 84,76 L 72,86 L 58,90 L 40,86',
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
    'M 56,14 L 74,24 L 80,34 V 50 L 72,68 L 44,86',
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
    'M 72,28 L 90,46 L 86,62 L 60,82 H 22',
  ],

  // ㄌ (l) — 2 strokes
  // Shape: main diagonal going down-left; right branch from middle going down-right
  l: [
    'M 46,12 L 54,32 V 48 L 44,68 L 22,84',
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
    'M 22,40 L 54,30 H 70 L 82,36',
    'M 22,58 L 54,68 L 84,84',
  ],

  // ㄏ (h) — 2 strokes
  // Shape: top horizontal (厂); descending curved stroke from mid-top
  h: [
    'M 12,26 H 88',
    'M 28,26 L 40,60 V 76 L 24,90',
  ],

  // ㄐ (j) — 2 strokes
  // Shape: horizontal bar; vertical going down with bottom left-hook
  j: [
    'M 14,32 H 86',
    'M 50,32 L 48,86 L 42,92 H 28 L 18,88 L 14,80',
  ],

  // ㄑ (q) — 3 strokes
  // Shape: top horizontal; right-side curve going down-left; small downward tail
  q: [
    'M 16,28 H 82',
    'M 82,28 L 94,48 L 88,66 L 70,78 H 40',
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
    'M 52,12 L 68,14 L 80,26 L 82,42 L 76,54 L 52,66 H 34 L 26,62',
    'M 14,58 H 82',
    'M 14,58 L 16,74 L 40,88 H 58 L 76,76',
  ],

  // ㄔ (ch) — 3 strokes
  // Shape: 彳 (two short left strokes + one longer right stroke)
  ch: [
    'M 28,14 L 26,46',
    'M 24,52 L 22,80',
    'M 56,14 L 54,62 L 42,86',
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
    'M 82,22 V 70 L 78,78 L 54,88 L 36,86 L 24,80',
  ],

  // ㄘ (c) — 2 strokes
  // Shape: upper-right curve; middle horizontal crossbar
  c: [
    'M 22,24 L 36,18 L 64,16 L 72,18 L 80,26 L 84,36 L 80,54 L 68,68 L 56,74',
    'M 14,56 H 72',
  ],

  // ㄙ (s) — 2 strokes
  // Shape: 厶 (upper diagonal going right; lower curve returning left-up)
  s: [
    'M 46,18 L 60,20 L 70,34 L 68,50 L 54,64',
    'M 54,64 L 30,72 L 16,56 L 18,42 L 30,30 L 46,24 V 18',
  ],

  // ───── Vowels (韻母) ─────

  // ㄚ (a) — 2 strokes
  // Shape: 丫 fork (left diagonal + junction continuing down; right arm to junction)
  a: [
    'M 36,14 L 44,28 L 48,46 V 66 L 40,86',
    'M 64,14 L 52,34 L 48,64',
  ],

  // ㄛ (o) — 2 strokes
  // Shape: left vertical; right oval
  o: [
    'M 34,14 V 84',
    'M 34,48 L 44,38 L 58,36 L 72,52 V 64 L 60,80 L 46,86 L 34,84',
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
    'M 42,42 L 52,36 H 66 L 78,52 L 74,68 L 60,80 L 44,86',
  ],

  // ㄟ (ei) — 1 stroke
  // Shape: single curved hook stroke (from 乁)
  ei: [
    'M 26,28 L 60,74 L 58,84 L 50,90 H 38 L 28,84',
  ],

  // ㄠ (ao) — 3 strokes
  // Shape: two-cell frame (double loop from 么/幺)
  ao: [
    'M 14,24 V 82 H 50',
    'M 50,24 V 62',
    'M 50,62 H 86 V 24 H 50',
  ],

  // ㄡ (ou) — 2 strokes
  // Shape: left outer curve; right inner curve (from 又)
  ou: [
    'M 28,20 L 12,40 V 56 L 18,70 L 48,86 L 64,84 L 74,78',
    'M 72,28 L 86,50 L 84,64 L 78,74 L 56,84',
  ],

  // ㄢ (an) — 3 strokes
  // Shape: horizontal crossbar; short left arm; right descending curve
  an: [
    'M 12,46 H 88',
    'M 46,14 L 38,46',
    'M 46,46 L 72,70 L 76,78 L 74,88 L 48,92 L 24,80',
  ],

  // ㄣ (en) — 2 strokes
  // Shape: vertical going down; left-hook returning upward (from 乚)
  en: [
    'M 50,14 V 66',
    'M 50,66 L 34,80 L 22,78 L 18,72 V 56 L 30,40',
  ],

  // ㄤ (ang) — 3 strokes
  // Shape: center vertical; horizontal crossbar; bottom curved stroke
  ang: [
    'M 50,14 V 84',
    'M 14,44 H 86',
    'M 20,68 L 34,62 H 54 L 80,70',
  ],

  // ㄥ (eng) — 2 strokes
  // Shape: upper arc going right (from 厶); small tail going lower-left
  eng: [
    'M 20,50 L 22,26 L 36,16 H 64 L 82,32 L 84,52 L 72,70 L 56,78 L 32,76',
    'M 32,76 L 24,78 L 16,72 L 14,64',
  ],

  // ㄦ (er) — 2 strokes
  // Shape: 儿 (left falling stroke; right vertical-with-hook)
  er: [
    'M 42,14 L 30,36 L 20,70 V 80 L 26,90',
    'M 58,14 V 74 L 60,80 L 72,88',
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
    'M 20,24 V 72 L 22,80 L 34,90 H 66 L 74,84 L 80,72 V 24',
  ],
};
