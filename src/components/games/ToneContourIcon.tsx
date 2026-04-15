import type { CSSProperties } from 'react';
import type { ToneContour } from '../../constants/tones';

interface Props {
  contour: ToneContour;
  size?: number;
  color?: string;
  style?: CSSProperties;
}

// SVG paths in viewBox "0 0 80 40" (width:height = 2:1)
const PATHS: Record<Exclude<ToneContour, 'neutral'>, string> = {
  flat:    'M 10 14 L 70 14',
  rising:  'M 10 34 L 70 6',
  dipping: 'M 10 10 Q 40 40 70 12',
  falling: 'M 10 6 L 70 34',
};

export default function ToneContourIcon({ contour, size = 80, color = '#2D3436', style }: Props) {
  const w = size;
  const h = size * 0.5;

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 80 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={style}
    >
      {contour === 'neutral' ? (
        <circle cx="40" cy="28" r="6" fill={color} />
      ) : (
        <path
          d={PATHS[contour]}
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}
