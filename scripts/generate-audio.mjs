/**
 * generate-audio.mjs
 * Generates all WAV audio assets for the Bopomofo app using pure Node.js.
 * Run: node scripts/generate-audio.mjs
 *
 * Produces:
 *   public/audio/sfx/{click,flip,correct,wrong,star,gameStart,gameWin,levelUp,countdown,pop}.wav
 *   public/audio/bgm/main.wav
 *
 * All assets are CC0 / fully procedural — no external downloads required.
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// ── WAV utilities ─────────────────────────────────────────────────────────────

function writeWav(path, samples, sampleRate = 44100) {
  const n = samples.length;
  const buf = Buffer.alloc(44 + n * 2);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + n * 2, 4);
  buf.write('WAVE', 8);
  buf.write('fmt ', 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);            // PCM
  buf.writeUInt16LE(1, 22);            // mono
  buf.writeUInt32LE(sampleRate, 24);
  buf.writeUInt32LE(sampleRate * 2, 28); // byteRate
  buf.writeUInt16LE(2, 32);            // blockAlign
  buf.writeUInt16LE(16, 34);           // bitsPerSample
  buf.write('data', 36);
  buf.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) {
    const v = Math.max(-1, Math.min(1, samples[i]));
    buf.writeInt16LE(Math.round(v * 32767), 44 + i * 2);
  }
  writeFileSync(path, buf);
}

function alloc(durationSec, sr) {
  return new Float32Array(Math.ceil(durationSec * sr));
}

// ── Synthesis primitives ──────────────────────────────────────────────────────

function sine(t, f) { return Math.sin(2 * Math.PI * f * t); }
function tri(t, f) {
  const p = (t * f) % 1;
  return p < 0.5 ? 4 * p - 1 : 3 - 4 * p;
}

function adsr(t, dur, a = 0.01, d = 0.08, s = 0.7, r = 0.15) {
  const ad = a * dur, dd = d * dur, sd = dur * (1 - r), rd = r * dur;
  if (t < 0 || t > dur) return 0;
  if (t < ad) return t / ad;
  if (t < ad + dd) return 1 - (1 - s) * ((t - ad) / dd);
  if (t < sd) return s;
  return s * (1 - (t - sd) / rd);
}

// Add a note (sine + harmonics) into a sample buffer starting at startSample
function addNote(buf, sr, startSec, freq, durSec, vol = 0.45, wave = 'sine') {
  const start = Math.floor(startSec * sr);
  const len = Math.ceil(durSec * sr);
  for (let i = 0; i < len; i++) {
    const idx = start + i;
    if (idx >= buf.length) break;
    const t = i / sr;
    const env = adsr(t, durSec);
    let s = wave === 'tri' ? tri(t, freq) : sine(t, freq);
    s += 0.3 * sine(t, freq * 2);
    s += 0.1 * sine(t, freq * 3);
    s /= 1.4;
    buf[idx] = Math.max(-1, Math.min(1, buf[idx] + env * s * vol));
  }
}

// Frequency sweep (chirp)
function addChirp(buf, sr, startSec, f0, f1, durSec, vol = 0.5) {
  const start = Math.floor(startSec * sr);
  const len = Math.ceil(durSec * sr);
  let phase = 0;
  for (let i = 0; i < len; i++) {
    const idx = start + i;
    if (idx >= buf.length) break;
    const t = i / sr;
    const frac = t / durSec;
    const freq = f0 + (f1 - f0) * frac;
    phase += (2 * Math.PI * freq) / sr;
    const env = adsr(t, durSec, 0.01, 0.02, 0.8, 0.2);
    buf[idx] = Math.max(-1, Math.min(1, buf[idx] + Math.sin(phase) * env * vol));
  }
}

// ── Note frequency table ──────────────────────────────────────────────────────
const N = {
  C3: 130.81, D3: 146.83, E3: 164.81, G3: 196.00, A3: 220.00, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
  C6: 1046.50,
};

// ── Sound generators ──────────────────────────────────────────────────────────

function genClick() {
  const sr = 44100, dur = 0.06;
  const buf = alloc(dur, sr);
  addChirp(buf, sr, 0, 1200, 700, dur, 0.55);
  return { buf, sr };
}

function genPop() {
  const sr = 44100, dur = 0.12;
  const buf = alloc(dur, sr);
  addChirp(buf, sr, 0, 700, 200, dur * 0.7, 0.5);
  addNote(buf, sr, 0, 350, dur * 0.4, 0.2);
  return { buf, sr };
}

function genFlip() {
  const sr = 44100, dur = 0.18;
  const buf = alloc(dur, sr);
  addChirp(buf, sr, 0, 300, 750, dur, 0.45);
  addNote(buf, sr, 0.05, N.E5, 0.1, 0.15);
  return { buf, sr };
}

function genCorrect() {
  const sr = 44100, dur = 0.35;
  const buf = alloc(dur, sr);
  addNote(buf, sr, 0.00, N.C5, 0.12, 0.45);
  addNote(buf, sr, 0.10, N.E5, 0.12, 0.45);
  addNote(buf, sr, 0.20, N.G5, 0.15, 0.50);
  return { buf, sr };
}

function genWrong() {
  const sr = 44100, dur = 0.32;
  const buf = alloc(dur, sr);
  addNote(buf, sr, 0.00, N.B3, 0.15, 0.45);
  addChirp(buf, sr, 0.10, 260, 180, 0.22, 0.35);
  return { buf, sr };
}

function genStar() {
  const sr = 44100, dur = 0.45;
  const buf = alloc(dur, sr);
  [N.C5, N.E5, N.G5, N.C6].forEach((f, i) => {
    addNote(buf, sr, i * 0.09, f, 0.12, 0.4 + i * 0.05);
  });
  return { buf, sr };
}

function genGameStart() {
  const sr = 44100, dur = 0.70;
  const buf = alloc(dur, sr);
  addNote(buf, sr, 0.00, N.C4, 0.18, 0.4);
  addNote(buf, sr, 0.16, N.G4, 0.18, 0.45);
  addNote(buf, sr, 0.34, N.C5, 0.18, 0.50);
  addNote(buf, sr, 0.50, N.E5, 0.20, 0.55, 'tri');
  return { buf, sr };
}

function genGameWin() {
  const sr = 44100, dur = 1.3;
  const buf = alloc(dur, sr);
  const melody = [
    [N.C5, 0.00], [N.E5, 0.14], [N.G5, 0.28], [N.C6, 0.42],
    [N.G5, 0.58], [N.E5, 0.72], [N.C5, 0.86],
  ];
  melody.forEach(([f, t], i) => {
    addNote(buf, sr, t, f, i === 3 ? 0.22 : 0.16, 0.45 + i * 0.02);
  });
  // Sustained chord at end
  addNote(buf, sr, 1.05, N.C5, 0.25, 0.25);
  addNote(buf, sr, 1.05, N.E5, 0.25, 0.25);
  addNote(buf, sr, 1.05, N.G5, 0.25, 0.25);
  return { buf, sr };
}

function genLevelUp() {
  const sr = 44100, dur = 0.85;
  const buf = alloc(dur, sr);
  [N.C5, N.E5, N.G5, N.A5].forEach((f, i) => {
    addNote(buf, sr, i * 0.15, f, 0.20, 0.40 + i * 0.04);
  });
  addChirp(buf, sr, 0.65, N.A5, N.C6, 0.20, 0.35);
  return { buf, sr };
}

function genCountdown() {
  const sr = 44100, dur = 0.15;
  const buf = alloc(dur, sr);
  addNote(buf, sr, 0, N.A5, dur, 0.5);
  return { buf, sr };
}

// ── BGM: simple looping pentatonic melody ────────────────────────────────────

function genBgm() {
  const sr = 22050;
  const bpm = 112;
  const beat = 60 / bpm;

  // 16-beat sequence (pentatonic C major: C D E G A)
  const seq = [
    [N.C5, 1], [N.E5, 0.5], [N.G5, 0.5],
    [N.A5, 1], [N.G5, 0.5], [N.E5, 0.5],
    [N.D5, 1], [N.C5, 0.5], [N.E5, 0.5],
    [N.G5, 1], [N.E5, 0.5], [N.C5, 0.5],
    [N.A4, 1], [N.C5, 0.5], [N.E5, 0.5],
    [N.G5, 2],
  ];

  // Bass line
  const bass = [
    [N.C3, 2], [N.G3, 2], [N.A3, 2], [N.G3, 2],
    [N.F4 ? N.F4 : N.E4, 2], [N.C4, 2], [N.G3, 2], [N.C4, 2],
  ];

  const totalBeats = seq.reduce((s, [, d]) => s + d, 0);
  const dur = totalBeats * beat;
  const buf = alloc(dur, sr);

  // Melody
  let t = 0;
  for (const [f, d] of seq) {
    const noteDur = d * beat;
    addNote(buf, sr, t, f, noteDur * 0.85, 0.28, 'sine');
    t += noteDur;
  }

  // Bass (half volume)
  t = 0;
  for (const [f, d] of bass) {
    const noteDur = d * beat;
    addNote(buf, sr, t, f, noteDur * 0.7, 0.18, 'tri');
    t += noteDur;
    if (t >= dur) break;
  }

  // Light harmony (thirds above melody)
  t = 0;
  for (const [f, d] of seq) {
    const noteDur = d * beat;
    addNote(buf, sr, t, f * 1.25, noteDur * 0.7, 0.10, 'sine');
    t += noteDur;
  }

  return { buf, sr };
}

// ── Main ─────────────────────────────────────────────────────────────────────

const sfxDir = join(root, 'public', 'audio', 'sfx');
const bgmDir = join(root, 'public', 'audio', 'bgm');
mkdirSync(sfxDir, { recursive: true });
mkdirSync(bgmDir, { recursive: true });

const sounds = {
  click:     genClick(),
  pop:       genPop(),
  flip:      genFlip(),
  correct:   genCorrect(),
  wrong:     genWrong(),
  star:      genStar(),
  gameStart: genGameStart(),
  gameWin:   genGameWin(),
  levelUp:   genLevelUp(),
  countdown: genCountdown(),
};

for (const [name, { buf, sr }] of Object.entries(sounds)) {
  const file = join(sfxDir, `${name}.wav`);
  writeWav(file, buf, sr);
  const kb = ((buf.length * 2 + 44) / 1024).toFixed(1);
  console.log(`  SFX  ${name}.wav  (${kb} KB)`);
}

const bgm = genBgm();
const bgmFile = join(bgmDir, 'main.wav');
writeWav(bgmFile, bgm.buf, bgm.sr);
const bgmKb = ((bgm.buf.length * 2 + 44) / 1024).toFixed(1);
console.log(`  BGM  main.wav  (${bgmKb} KB)`);

console.log('\nDone. All audio assets written to public/audio/');
