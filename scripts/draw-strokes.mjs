/**
 * Phase 2: Playwright script — draw Bopomofo stroke paths in /dev/strokes editor
 *
 * Usage:
 *   node scripts/draw-strokes.mjs               # 只畫尚未有路徑的字（安全模式）
 *   node scripts/draw-strokes.mjs --only b,p,m  # 只重畫指定的字
 *   node scripts/draw-strokes.mjs --all          # 強制覆蓋全部 37 個字
 *
 * Prerequisites:
 *   - Dev server running on http://localhost:5173
 *   - npx playwright install chromium  (done once)
 *
 * For each of the 37 Bopomofo symbols the script will:
 *   1. Open the editor modal for that symbol
 *   2. Clear any existing strokes
 *   3. Simulate mouse-drag for each stroke in freehand mode
 *   4. Wait for the done count to reach the expected number
 *   5. Read the generated SVG path code from the textarea
 *   6. Patch strokeData.ts with the new paths
 *
 * Waypoints are in the 0–100 viewBox coordinate space.
 * Reference: 教育部《國語小字典》注音符號筆順
 * https://stroke-order.learningweb.moe.edu.tw/
 */

import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const STROKE_DATA_PATH = join(__dirname, '../src/constants/strokeData.ts');
const BASE_URL = 'http://localhost:5173/bopomofo';

// ── Stroke waypoints (viewBox 0–100) ─────────────────────────────────────────
// Each character entry is an array of strokes.
// Each stroke is an array of [x, y] waypoints the freehand mouse will follow.
// Reference: 教育部《國語小字典》注音符號筆順

const WAYPOINTS = {
  // ── Consonants ──────────────────────────────────────────────────────────────

  // ㄅ (b) — 3 strokes
  b: [
    [[16,22],[36,22],[56,22],[75,22],[84,22]],
    [[84,22],[84,36],[84,54],[60,54],[40,54],[20,54]],
    [[20,54],[15,62],[13,70],[17,76],[24,82],[36,88],[52,90],[66,88],[78,82]],
  ],

  // ㄆ (p) — 3 strokes
  p: [
    [[22,15],[22,34],[22,54],[22,74],[22,86]],
    [[22,48],[40,48],[58,48],[76,48]],
    [[76,48],[86,56],[90,66],[84,76],[72,86],[56,90],[40,86]],
  ],

  // ㄇ (m) — 3 strokes
  m: [
    [[16,22],[36,22],[56,22],[75,22],[84,22]],
    [[16,22],[16,40],[16,60],[16,84]],
    [[84,22],[84,36],[84,52],[84,58]],
  ],

  // ㄈ (f) — 2 strokes
  f: [
    [[16,22],[36,22],[56,22],[75,22],[84,22]],
    [[16,22],[16,40],[16,60],[16,78],[36,78],[56,78],[74,78]],
  ],

  // ㄉ (d) — 2 strokes
  d: [
    [[56,14],[66,18],[74,24],[80,34],[80,46],[78,58],[72,68],[62,76],[50,82],[44,86]],
    [[14,52],[34,52],[54,52],[74,52],[82,52]],
  ],

  // ㄊ (t) — 3 strokes
  t: [
    [[38,16],[50,16],[62,16]],
    [[14,38],[34,38],[54,38],[74,38],[86,38]],
    [[50,16],[50,34],[50,54],[50,74],[50,84]],
  ],

  // ㄋ (n) — 2 strokes
  n: [
    [[14,28],[34,28],[54,28],[74,28],[80,28]],
    [[72,28],[82,36],[90,46],[88,58],[80,68],[66,80],[48,84],[32,84],[22,82]],
  ],

  // ㄌ (l) — 2 strokes
  l: [
    [[46,12],[50,22],[54,34],[54,46],[50,58],[44,68],[34,76],[22,84]],
    [[54,48],[62,56],[70,64],[78,72],[84,80]],
  ],

  // ㄍ (g) — 3 strokes
  g: [
    [[16,22],[36,22],[56,22],[76,22],[83,22]],
    [[83,22],[83,40],[83,60],[83,78]],
    [[83,78],[62,78],[42,78],[22,78],[16,78]],
  ],

  // ㄎ (k) — 3 strokes
  k: [
    [[22,14],[22,34],[22,54],[22,74],[22,86]],
    [[22,40],[40,34],[56,30],[68,30],[78,34],[82,36]],
    [[22,58],[40,64],[56,70],[68,76],[78,82],[84,84]],
  ],

  // ㄏ (h) — 2 strokes
  h: [
    [[12,26],[34,26],[56,26],[78,26],[88,26]],
    [[28,26],[32,38],[36,50],[40,62],[40,74],[36,82],[30,88],[24,90]],
  ],

  // ㄐ (j) — 2 strokes
  j: [
    [[14,32],[34,32],[54,32],[74,32],[86,32]],
    [[50,32],[50,46],[50,62],[50,76],[48,86],[42,92],[30,92],[18,88],[14,80]],
  ],

  // ㄑ (q) — 3 strokes
  q: [
    [[16,28],[36,28],[56,28],[76,28],[82,28]],
    [[82,28],[90,38],[94,50],[90,62],[82,72],[70,78],[56,80],[40,78]],
    [[40,78],[40,86],[40,94]],
  ],

  // ㄒ (x) — 3 strokes
  x: [
    [[50,14],[50,34],[50,54],[50,74],[50,86]],
    [[14,36],[34,36],[54,36],[74,36],[86,36]],
    [[14,62],[34,62],[54,62],[74,62],[86,62]],
  ],

  // ㄓ (zh) — 3 strokes
  zh: [
    [[52,12],[66,14],[76,20],[82,30],[82,42],[76,54],[64,62],[50,66],[36,66],[26,62]],
    [[14,58],[34,58],[54,58],[74,58],[82,58]],
    [[14,58],[14,68],[18,76],[26,82],[40,88],[56,88],[68,84],[76,76]],
  ],

  // ㄔ (ch) — 3 strokes
  ch: [
    [[28,14],[28,26],[26,38],[26,46]],
    [[24,52],[24,64],[22,76],[22,80]],
    [[56,14],[54,28],[54,44],[54,58],[52,70],[46,82],[42,86]],
  ],

  // ㄕ (sh) — 4 strokes
  sh: [
    [[18,22],[38,22],[58,22],[74,22],[80,22]],
    [[18,22],[18,38],[18,54],[18,70],[18,80]],
    [[18,52],[38,52],[58,52],[74,52],[76,52]],
    [[76,22],[76,38],[76,54],[76,70],[76,88]],
  ],

  // ㄖ (r) — 4 strokes
  r: [
    [[18,18],[18,36],[18,54],[18,70],[18,82]],
    [[18,18],[38,18],[58,18],[74,18],[82,18],[82,36],[82,54],[82,70],[82,82]],
    [[18,50],[38,50],[58,50],[74,50],[82,50]],
    [[18,82],[38,82],[58,82],[74,82],[82,82]],
  ],

  // ㄗ (z) — 2 strokes
  z: [
    [[18,22],[38,22],[58,22],[76,22],[82,22]],
    [[82,22],[82,38],[82,54],[82,68],[78,78],[68,84],[52,88],[36,86],[24,80]],
  ],

  // ㄘ (c) — 2 strokes
  c: [
    [[22,24],[40,18],[58,16],[72,18],[80,26],[84,38],[82,50],[74,62],[64,70],[56,74]],
    [[14,56],[34,56],[50,56],[64,56],[72,56]],
  ],

  // ㄙ (s) — 2 strokes
  s: [
    [[46,18],[58,20],[66,26],[70,36],[70,46],[64,56],[54,64]],
    [[54,64],[42,70],[30,72],[22,66],[16,54],[18,42],[26,34],[36,28],[46,24],[46,18]],
  ],

  // ── Vowels ──────────────────────────────────────────────────────────────────

  // ㄚ (a) — 2 strokes
  a: [
    [[36,14],[42,24],[46,36],[48,50],[48,64],[44,76],[40,86]],
    [[64,14],[56,24],[52,36],[50,50],[48,64]],
  ],

  // ㄛ (o) — 2 strokes
  o: [
    [[34,14],[34,30],[34,50],[34,70],[34,84]],
    [[34,48],[44,38],[56,36],[66,42],[72,52],[72,64],[66,74],[56,82],[44,86],[34,84]],
  ],

  // ㄜ (e) — 2 strokes
  e: [
    [[14,44],[34,44],[54,44],[74,44],[86,44]],
    [[50,16],[50,30],[50,44],[50,58],[50,74],[50,84]],
  ],

  // ㄝ (eh) — 3 strokes
  eh: [
    [[14,44],[34,44],[54,44],[74,44],[86,44]],
    [[50,16],[50,28],[50,38],[50,44]],
    [[50,44],[48,54],[44,64],[40,74],[36,82]],
  ],

  // ㄞ (ai) — 3 strokes
  ai: [
    [[42,14],[42,30],[42,50],[42,70],[42,84]],
    [[14,42],[26,42],[36,42],[42,42]],
    [[42,42],[54,36],[64,36],[72,42],[78,52],[76,64],[68,74],[56,82],[44,86]],
  ],

  // ㄟ (ei) — 1 stroke
  ei: [
    [[26,28],[32,36],[40,46],[48,56],[56,66],[60,76],[58,84],[50,90],[38,90],[28,84]],
  ],

  // ㄠ (ao) — 3 strokes
  ao: [
    [[14,24],[14,40],[14,60],[14,80],[14,82],[30,82],[42,82],[50,82]],
    [[50,24],[50,36],[50,50],[50,62]],
    [[50,62],[62,62],[74,62],[80,62],[86,62],[86,46],[86,34],[86,24],[74,24],[62,24],[50,24]],
  ],

  // ㄡ (ou) — 2 strokes
  ou: [
    [[28,20],[18,30],[12,42],[12,54],[16,66],[24,76],[36,82],[50,86],[64,84],[74,78]],
    [[72,28],[80,38],[86,50],[84,64],[78,74],[68,80],[56,84]],
  ],

  // ㄢ (an) — 3 strokes
  an: [
    [[12,46],[30,46],[50,46],[70,46],[88,46]],
    [[46,14],[44,24],[42,34],[38,44],[38,46]],
    [[46,46],[56,54],[64,62],[72,70],[76,80],[74,88],[62,92],[48,92],[34,86],[24,80]],
  ],

  // ㄣ (en) — 2 strokes
  en: [
    [[50,14],[50,26],[50,40],[50,54],[50,66]],
    [[50,66],[44,74],[34,80],[24,80],[18,70],[18,58],[22,48],[30,40]],
  ],

  // ㄤ (ang) — 3 strokes
  ang: [
    [[50,14],[50,30],[50,50],[50,70],[50,84]],
    [[14,44],[30,44],[50,44],[70,44],[86,44]],
    [[20,68],[30,64],[40,62],[50,62],[60,64],[70,68],[80,70]],
  ],

  // ㄥ (eng) — 2 strokes
  eng: [
    [[20,50],[20,40],[22,28],[28,20],[38,16],[50,16],[62,16],[72,20],[80,28],[84,40],[84,52],[78,64],[68,72],[56,78],[42,78],[32,76]],
    [[32,76],[24,78],[16,72],[14,64]],
  ],

  // ㄦ (er) — 2 strokes
  er: [
    [[42,14],[36,26],[30,38],[26,52],[22,64],[20,76],[22,84],[26,90]],
    [[58,14],[58,28],[58,44],[58,60],[58,70],[60,80],[66,86],[72,88]],
  ],

  // ㄧ (yi) — 1 stroke
  yi: [
    [[12,50],[30,50],[50,50],[70,50],[88,50]],
  ],

  // ㄨ (wu) — 2 strokes
  wu: [
    [[18,22],[26,36],[34,50],[40,64],[46,76],[50,84]],
    [[82,22],[74,36],[66,50],[60,64],[54,76],[50,84]],
  ],

  // ㄩ (yu) — 2 strokes
  yu: [
    [[20,24],[36,24],[54,24],[70,24],[80,24]],
    [[20,24],[20,38],[20,54],[20,68],[22,78],[28,86],[36,90],[50,90],[64,90],[72,86],[78,78],[80,68],[80,54],[80,38],[80,24]],
  ],
};

// ── Playwright automation ─────────────────────────────────────────────────────

/**
 * Simulate a freehand mouse drag along the given waypoints.
 * Returns the number of steps taken.
 */
async function drawStroke(page, canvasBox, waypoints) {
  const toScreen = ([vx, vy]) => ({
    x: canvasBox.x + (vx / 100) * canvasBox.width,
    y: canvasBox.y + (vy / 100) * canvasBox.height,
  });

  const pts = waypoints.map(toScreen);

  await page.mouse.move(pts[0].x, pts[0].y);
  await page.waitForTimeout(30);
  await page.mouse.down();
  await page.waitForTimeout(30);

  for (let i = 1; i < pts.length; i++) {
    await page.mouse.move(pts[i].x, pts[i].y, { steps: 6 });
    await page.waitForTimeout(20);
  }

  await page.mouse.up();
  await page.waitForTimeout(150);
}

async function main() {
  // ── Parse CLI arguments ───────────────────────────────────────────────────
  const args = process.argv.slice(2);
  const forceAll = args.includes('--all');
  const onlyArg = args.find(a => a.startsWith('--only=') || a === '--only');
  let onlyIds = null;
  if (onlyArg) {
    const val = onlyArg.startsWith('--only=')
      ? onlyArg.slice(7)
      : args[args.indexOf('--only') + 1];
    onlyIds = val ? val.split(',').map(s => s.trim()).filter(Boolean) : null;
  }

  // Read existing strokeData.ts to detect which entries already have real paths
  const existingSrc = readFileSync(STROKE_DATA_PATH, 'utf8');

  // Decide which symbols to (re)draw
  const toProcess = Object.keys(WAYPOINTS).filter(id => {
    if (onlyIds) return onlyIds.includes(id);       // --only list
    if (forceAll) return true;                       // --all: overwrite everything
    // Default (safe mode): skip if entry already has non-empty paths
    const escapedId = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`\\b${escapedId}:\\s*\\[[\\s\\S]*?'M `, 'm');
    return !pattern.test(existingSrc);               // only draw if no 'M ...' paths yet
  });

  if (toProcess.length === 0) {
    console.log('All entries already have paths. Use --all to overwrite, or --only=id1,id2 to target specific symbols.');
    process.exit(0);
  }

  console.log(`Mode: ${forceAll ? '--all' : onlyIds ? `--only ${onlyIds.join(',')}` : 'safe (empty entries only)'}`);
  console.log(`Processing ${toProcess.length} symbol(s): ${toProcess.join(', ')}\n`);

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 960 });

  console.log(`Navigating to ${BASE_URL}/dev/strokes …`);
  await page.goto(`${BASE_URL}/dev/strokes`);
  await page.waitForSelector('[data-symbol-id]');
  await page.waitForTimeout(500);

  const results = {};
  const errors = [];

  for (const symbolId of toProcess) {
    const strokes = WAYPOINTS[symbolId];
    console.log(`\nDrawing: ${symbolId} (${strokes.length} strokes expected)`);

    try {
      // Open editor for this symbol
      await page.click(`[data-symbol-id="${symbolId}"]`);
      await page.waitForSelector('[data-drawing-canvas]', { timeout: 5000 });
      await page.waitForTimeout(300);

      // Clear existing strokes
      await page.click('[data-action="clear"]');
      await page.waitForTimeout(200);

      // Confirm done count is 0
      const initialCount = await page.locator('[data-done-count]').textContent({ timeout: 3000 });
      if (initialCount !== '0') {
        console.warn(`  WARN: after clear, done count is ${initialCount}, not 0. Re-clearing…`);
        await page.click('[data-action="clear"]');
        await page.waitForTimeout(200);
      }

      // Ensure freehand mode
      await page.click('[data-mode="F"]');
      await page.waitForTimeout(100);

      // Get canvas bounding box
      const canvas = page.locator('[data-drawing-canvas]');
      const canvasBox = await canvas.boundingBox();
      if (!canvasBox) throw new Error('Canvas bounding box not found');

      // Draw each stroke and wait for the done count to increase
      for (let strokeIdx = 0; strokeIdx < strokes.length; strokeIdx++) {
        const expectedCount = strokeIdx + 1;

        await drawStroke(page, canvasBox, strokes[strokeIdx]);

        // Wait for done count to reach expectedCount
        await page.waitForFunction(
          (expected) => {
            const el = document.querySelector('[data-done-count]');
            return el && parseInt(el.textContent ?? '0') === expected;
          },
          expectedCount,
          { timeout: 5000 }
        );

        const count = await page.locator('[data-done-count]').textContent();
        console.log(`  Stroke ${expectedCount}/${strokes.length} done (count=${count})`);
      }

      // Read generated code
      const code = await page.locator('[data-code-output]').inputValue({ timeout: 3000 });
      const lineCount = code.trim().split('\n').length;
      console.log(`  ✓ ${lineCount} path strings generated`);
      results[symbolId] = code;

      // Close editor
      await page.keyboard.press('Escape');
      await page.waitForSelector('[data-drawing-canvas]', { state: 'hidden', timeout: 3000 });
      await page.waitForTimeout(200);

    } catch (err) {
      console.error(`  ✗ ERROR: ${err.message}`);
      errors.push({ symbolId, error: err.message });

      // Take a screenshot for debugging
      await page.screenshot({ path: `scripts/error-${symbolId}.png` }).catch(() => {});

      // Try to close the modal and continue
      try {
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);
      } catch {}
    }
  }

  await browser.close();

  if (errors.length > 0) {
    console.warn(`\n⚠  ${errors.length} characters had errors:`);
    errors.forEach(e => console.warn(`   ${e.symbolId}: ${e.error}`));
  }

  if (Object.keys(results).length === 0) {
    console.error('\nNo results to write. Aborting.');
    process.exit(1);
  }

  // ── Patch strokeData.ts ──────────────────────────────────────────────────────

  console.log('\nPatching src/constants/strokeData.ts …');
  let src = readFileSync(STROKE_DATA_PATH, 'utf8');

  let patchCount = 0;
  for (const [symbolId, code] of Object.entries(results)) {
    if (!code || code.startsWith('// (')) {
      console.warn(`  SKIP ${symbolId}: no strokes`);
      continue;
    }

    // Match: `  symbolId: [\n  ...lines...\n  ],`
    const escapedId = symbolId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(
      `(\\b${escapedId}:\\s*\\[)[\\s\\S]*?(\\s*\\],)`,
    );

    if (!pattern.test(src)) {
      console.warn(`  SKIP ${symbolId}: pattern not found`);
      continue;
    }

    src = src.replace(pattern, `$1\n${code}\n  ],`);
    patchCount++;
    console.log(`  ✓ ${symbolId}`);
  }

  writeFileSync(STROKE_DATA_PATH, src, 'utf8');
  console.log(`\nPatched ${patchCount} entries. Run \`npm run build\` to verify.`);

  if (errors.length > 0) {
    console.warn(`\nRe-run the script for failed characters: ${errors.map(e => e.symbolId).join(', ')}`);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('\nFatal error:', err);
  process.exit(1);
});
