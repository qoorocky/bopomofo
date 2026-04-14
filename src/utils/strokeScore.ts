// Stroke scoring utilities for handwriting practice.
// Uses SVG DOM APIs (browser-only) to sample reference paths.

export type Point = { x: number; y: number };

/** Sample n equidistant points along an SVG path string. */
export function samplePath(d: string, n = 50): Point[] {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg') as SVGSVGElement;
  svg.setAttribute('viewBox', '0 0 100 100');
  Object.assign(svg.style, { position: 'absolute', visibility: 'hidden', width: '0', height: '0' });
  const el = document.createElementNS(ns, 'path') as SVGPathElement;
  el.setAttribute('d', d);
  svg.appendChild(el);
  document.body.appendChild(svg);

  const len = el.getTotalLength();
  const pts: Point[] = [];
  if (len > 0 && n > 1) {
    for (let i = 0; i < n; i++) {
      const p = el.getPointAtLength((i / (n - 1)) * len);
      pts.push({ x: p.x, y: p.y });
    }
  }
  document.body.removeChild(svg);
  return pts;
}

/** Resample a point array to n equidistant points via linear interpolation. */
function resamplePts(pts: Point[], n: number): Point[] {
  if (pts.length === 0) return [];
  if (pts.length === 1 || n === 1) return Array.from({ length: n }, () => ({ ...pts[0] }));

  // Build cumulative distance table
  const cum: number[] = [0];
  for (let i = 1; i < pts.length; i++) {
    cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
  }
  const total = cum[cum.length - 1];
  if (total === 0) return Array.from({ length: n }, () => ({ ...pts[0] }));

  const result: Point[] = [];
  for (let i = 0; i < n; i++) {
    const target = (i / (n - 1)) * total;
    // Binary search for the segment containing target
    let lo = 0, hi = cum.length - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (cum[mid] <= target) lo = mid; else hi = mid;
    }
    const seg = cum[hi] - cum[lo];
    const t = seg > 0 ? (target - cum[lo]) / seg : 0;
    result.push({
      x: pts[lo].x + t * (pts[hi].x - pts[lo].x),
      y: pts[lo].y + t * (pts[hi].y - pts[lo].y),
    });
  }
  return result;
}

/** Average minimum distance from set A to set B (directed Hausdorff). */
function avgMinDist(a: Point[], b: Point[]): number {
  if (!a.length || !b.length) return 100;
  let total = 0;
  for (const pa of a) {
    let min = Infinity;
    for (const pb of b) {
      const d = Math.hypot(pa.x - pb.x, pa.y - pb.y);
      if (d < min) min = d;
    }
    total += min;
  }
  return total / a.length;
}

/** Modified Hausdorff distance (symmetric, average of both directed). */
function modifiedHausdorff(a: Point[], b: Point[]): number {
  return Math.max(avgMinDist(a, b), avgMinDist(b, a));
}

/**
 * Map distance (in 0–100 coordinate units) to score 0–100.
 * dist=0 → 100, dist≥20 → 0.
 */
function distToScore(dist: number): number {
  return Math.max(0, Math.round(100 * (1 - dist / 20)));
}

/** Score one user stroke against one reference SVG path. Returns 0–100. */
export function scoreOneStroke(userPts: Point[], refD: string, n = 50): number {
  if (userPts.length < 2) return 0;
  const ref = samplePath(refD, n);
  if (ref.length === 0) return 0;
  const user = resamplePts(userPts, n);
  return distToScore(modifiedHausdorff(user, ref));
}


/**
 * Overall score for all user strokes vs reference paths.
 * Sequential matching: stroke[i] is scored against refPaths[i] only,
 * preserving the stroke order defined in strokeData.
 * Shape similarity (70%) + stroke-count accuracy (30%). Returns 0–100.
 */
export function scoreStrokes(userStrokes: Point[][], refPaths: string[]): number {
  if (!refPaths.length) return 0;

  const n = Math.min(userStrokes.length, refPaths.length);
  let shapeTotal = 0;
  for (let i = 0; i < n; i++) {
    shapeTotal += scoreOneStroke(userStrokes[i], refPaths[i]);
  }

  const shapeSimilarity = n > 0 ? shapeTotal / n : 0;
  const countScore = Math.max(0, 1 - Math.abs(userStrokes.length - refPaths.length) / refPaths.length) * 100;

  return Math.round(0.7 * shapeSimilarity + 0.3 * countScore);
}

/** Stroke ink color based on per-stroke score. */
export function strokeScoreColor(score: number): string {
  if (score >= 75) return '#2ECC71'; // green
  if (score >= 40) return '#F39C12'; // orange
  return '#E74C3C';                  // red
}

/** Number of stars (0–3) for a total score. */
export function scoreStars(score: number): number {
  if (score >= 85) return 3;
  if (score >= 60) return 2;
  if (score >= 35) return 1;
  return 0;
}
