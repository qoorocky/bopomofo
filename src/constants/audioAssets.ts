export type SfxId =
  | 'click'
  | 'flip'
  | 'correct'
  | 'wrong'
  | 'star'
  | 'gameStart'
  | 'gameWin'
  | 'levelUp'
  | 'countdown'
  | 'pop';

export type BgmId = 'main';

interface SfxDef {
  src: string[];
  volume: number;
  pool?: number;
}

interface BgmDef {
  src: string[];
  volume: number;
  loop: true;
}

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export const SFX_LIBRARY: Record<SfxId, SfxDef> = {
  click:     { src: [`${base}/audio/sfx/click.wav`],     volume: 0.6 },
  flip:      { src: [`${base}/audio/sfx/flip.wav`],      volume: 0.7 },
  correct:   { src: [`${base}/audio/sfx/correct.wav`],   volume: 0.8 },
  wrong:     { src: [`${base}/audio/sfx/wrong.wav`],     volume: 0.6 },
  star:      { src: [`${base}/audio/sfx/star.wav`],      volume: 0.9, pool: 3 },
  gameStart: { src: [`${base}/audio/sfx/gameStart.wav`], volume: 0.75 },
  gameWin:   { src: [`${base}/audio/sfx/gameWin.wav`],   volume: 0.9 },
  levelUp:   { src: [`${base}/audio/sfx/levelUp.wav`],   volume: 0.9 },
  countdown: { src: [`${base}/audio/sfx/countdown.wav`], volume: 0.65 },
  pop:       { src: [`${base}/audio/sfx/pop.wav`],       volume: 0.5, pool: 3 },
};

export const BGM_TRACKS: Record<BgmId, BgmDef> = {
  main: { src: [`${base}/audio/bgm/main.wav`], volume: 0.35, loop: true },
};
