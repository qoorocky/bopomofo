import { playSfx, isSfxMissing } from './useSoundEffect';
import { useAudioSettingsStore } from '../stores/useAudioSettingsStore';

let sharedCtx: AudioContext | null = null;

function getAudioCtx(): AudioContext {
  const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!sharedCtx || sharedCtx.state === 'closed') {
    sharedCtx = new AudioCtx();
  }
  // Resume if suspended (e.g. created before first user gesture)
  if (sharedCtx.state === 'suspended') {
    sharedCtx.resume();
  }
  return sharedCtx;
}

function playBeep(freq: number, duration: number) {
  const ctx = getAudioCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.value = freq;
  osc.type = 'sine';
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

export function useAudio() {
  function playWord(word: string) {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(word);
    utter.lang = 'zh-TW';
    utter.rate = 0.8;
    window.speechSynthesis.speak(utter);
  }

  /** 播放注音符號本身的音素（直接朗讀 ㄅ、ㄆ... 字元） */
  function playPhoneme(symbol: string) {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(symbol);
    utter.lang = 'zh-TW';
    utter.rate = 0.6;
    utter.pitch = 1.0;
    window.speechSynthesis.speak(utter);
  }

  // Delegates to Howler; falls back to sine-wave beep when the WAV failed to load
  function playEffect(type: 'correct' | 'wrong') {
    const { sfxEnabled } = useAudioSettingsStore.getState();
    if (!sfxEnabled) return;

    playSfx(type);

    // Sine-wave fallback: fires only when Howler reports a load error
    if (isSfxMissing(type)) {
      if (type === 'correct') {
        playBeep(523, 0.15);
      } else {
        playBeep(220, 0.3);
      }
    }
  }

  return { playWord, playPhoneme, playEffect, playSfx };
}
