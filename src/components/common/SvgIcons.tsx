import type { CSSProperties } from 'react';

interface IconProps {
  size?: number;
  color?: string;
  style?: CSSProperties;
}

// ── MascotOwl ────────────────────────────────────────────────────────────────
export function MascotOwl() {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Body */}
      <ellipse cx="60" cy="72" rx="34" ry="38" fill="#FFF9F0" stroke="#DEB887" strokeWidth="3" strokeLinejoin="round" />

      {/* Left wing */}
      <ellipse cx="28" cy="78" rx="14" ry="20" fill="#DEB887" stroke="#C4A065" strokeWidth="2.5" strokeLinejoin="round" transform="rotate(-15 28 78)" />

      {/* Right wing */}
      <ellipse cx="92" cy="78" rx="14" ry="20" fill="#DEB887" stroke="#C4A065" strokeWidth="2.5" strokeLinejoin="round" transform="rotate(15 92 78)" />

      {/* Left ear tuft */}
      <ellipse cx="44" cy="36" rx="10" ry="14" fill="#DEB887" stroke="#C4A065" strokeWidth="2.5" strokeLinejoin="round" transform="rotate(-15 44 36)" />

      {/* Right ear tuft */}
      <ellipse cx="76" cy="36" rx="10" ry="14" fill="#DEB887" stroke="#C4A065" strokeWidth="2.5" strokeLinejoin="round" transform="rotate(15 76 36)" />

      {/* Head */}
      <circle cx="60" cy="52" r="30" fill="#FFF9F0" stroke="#DEB887" strokeWidth="3" />

      {/* Belly patch */}
      <ellipse cx="60" cy="80" rx="20" ry="22" fill="#FFE8CC" />

      {/* Left eye white */}
      <circle cx="48" cy="50" r="11" fill="#FFFFFF" stroke="#DEB887" strokeWidth="2" />
      {/* Right eye white */}
      <circle cx="72" cy="50" r="11" fill="#FFFFFF" stroke="#DEB887" strokeWidth="2" />

      {/* Left iris */}
      <circle cx="48" cy="50" r="7" fill="#FF8E53" />
      {/* Right iris */}
      <circle cx="72" cy="50" r="7" fill="#FF8E53" />

      {/* Left pupil */}
      <circle cx="49" cy="49" r="3.5" fill="#2D2D2D" />
      {/* Right pupil */}
      <circle cx="73" cy="49" r="3.5" fill="#2D2D2D" />

      {/* Left eye shine */}
      <circle cx="51" cy="46" r="1.5" fill="#FFFFFF" />
      {/* Right eye shine */}
      <circle cx="75" cy="46" r="1.5" fill="#FFFFFF" />

      {/* Beak */}
      <polygon points="60,56 55,64 65,64" fill="#FFC851" stroke="#FFB300" strokeWidth="1.5" strokeLinejoin="round" />

      {/* Left foot */}
      <path d="M48 108 Q44 114 40 116 M48 108 Q46 115 44 118 M48 108 Q50 115 52 118" stroke="#FFC851" strokeWidth="3" strokeLinecap="round" />

      {/* Right foot */}
      <path d="M72 108 Q68 114 64 116 M72 108 Q70 115 68 118 M72 108 Q74 115 76 118" stroke="#FFC851" strokeWidth="3" strokeLinecap="round" />

      {/* Body-to-feet connection */}
      <path d="M50 104 Q48 107 48 108" stroke="#DEB887" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M70 104 Q72 107 72 108" stroke="#DEB887" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

// ── IconStar ──────────────────────────────────────────────────────────────────
export function IconStar({ size = 24, style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={style}
    >
      <polygon
        points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
        fill="#FFC851"
        stroke="#FFB300"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ── IconStarOutline ───────────────────────────────────────────────────────────
export function IconStarOutline({ size = 24, style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={style}
    >
      <polygon
        points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
        fill="none"
        stroke="#FFC851"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ── IconSpeaker ───────────────────────────────────────────────────────────────
export function IconSpeaker({ size = 24, color = '#FF6B6B', style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={style}
    >
      {/* Speaker body */}
      <path
        d="M3 9H7L13 4V20L7 15H3V9Z"
        fill={color}
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Wave 1 */}
      <path
        d="M16 9C17.5 10 17.5 14 16 15"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Wave 2 */}
      <path
        d="M19 7C21.5 9.5 21.5 14.5 19 17"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

// ── IconBook ──────────────────────────────────────────────────────────────────
export function IconBook({ size = 24, color = '#FF6B6B', style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={style}
    >
      {/* Left page */}
      <path
        d="M12 5C12 5 7 4 3 6V20C7 18 12 19 12 19"
        fill={color}
        fillOpacity="0.15"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right page */}
      <path
        d="M12 5C12 5 17 4 21 6V20C17 18 12 19 12 19"
        fill={color}
        fillOpacity="0.25"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Spine */}
      <line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      {/* Text lines left */}
      <line x1="5.5" y1="10" x2="10" y2="9.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="5.5" y1="13" x2="10" y2="12.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      {/* Text lines right */}
      <line x1="14" y1="9.5" x2="18.5" y2="10" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="14" y1="12.5" x2="18.5" y2="13" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ── IconGame ──────────────────────────────────────────────────────────────────
export function IconGame({ size = 24, color = '#4ECDC4', style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={style}
    >
      {/* Controller body */}
      <rect x="2" y="8" width="20" height="12" rx="6" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      {/* D-pad horizontal */}
      <line x1="5" y1="14" x2="9" y2="14" stroke={color} strokeWidth="2" strokeLinecap="round" />
      {/* D-pad vertical */}
      <line x1="7" y1="12" x2="7" y2="16" stroke={color} strokeWidth="2" strokeLinecap="round" />
      {/* Button A */}
      <circle cx="17" cy="13" r="1.5" fill={color} />
      {/* Button B */}
      <circle cx="15" cy="15.5" r="1.5" fill={color} />
      {/* Left thumbstick */}
      <circle cx="7" cy="14" r="0.8" fill={color} />
    </svg>
  );
}

// ── IconHome ──────────────────────────────────────────────────────────────────
export function IconHome({ size = 24, color = '#FF6B6B', style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={style}
    >
      {/* Roof */}
      <path
        d="M3 11L12 3L21 11"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* House body */}
      <path
        d="M5 11V21H19V11"
        fill={color}
        fillOpacity="0.15"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Door */}
      <rect x="9.5" y="15" width="5" height="6" rx="2" fill={color} fillOpacity="0.5" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

// ── IconTrophy ────────────────────────────────────────────────────────────────
export function IconTrophy({ size = 24, color = '#FFC851', style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={style}
    >
      {/* Cup */}
      <path
        d="M6 3H18V13C18 16.31 15.31 19 12 19C8.69 19 6 16.31 6 13V3Z"
        fill={color}
        fillOpacity="0.2"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Left handle */}
      <path d="M6 5H3C3 5 2 9 6 10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Right handle */}
      <path d="M18 5H21C21 5 22 9 18 10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Stem */}
      <line x1="12" y1="19" x2="12" y2="21" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      {/* Base */}
      <path d="M8 21H16" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      {/* Star on cup */}
      <polygon points="12,7 13.2,10 16,10 14,11.8 14.8,14.8 12,13.2 9.2,14.8 10,11.8 8,10 10.8,10" fill={color} />
    </svg>
  );
}

// ── IconSpeakerOn ─────────────────────────────────────────────────────────────
export function IconSpeakerOn({ size = 24, color = '#FF6B6B', style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={style}>
      <path d="M3 9H7L13 4V20L7 15H3V9Z" fill={color} stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M16 9C17.5 10 17.5 14 16 15" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M19 7C21.5 9.5 21.5 14.5 19 17" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

// ── IconSpeakerOff ────────────────────────────────────────────────────────────
export function IconSpeakerOff({ size = 24, color = '#B2BEC3', style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={style}>
      <path d="M3 9H7L13 4V20L7 15H3V9Z" fill={color} stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      <line x1="17" y1="9" x2="22" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="22" y1="9" x2="17" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// ── IconMusic ─────────────────────────────────────────────────────────────────
export function IconMusic({ size = 24, color = '#FF6B6B', style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={style}>
      <path d="M9 18V5l12-2v13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="6" cy="18" r="3" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="2" />
      <circle cx="18" cy="16" r="3" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="2" />
    </svg>
  );
}

// ── IconClose ─────────────────────────────────────────────────────────────────
export function IconClose({ size = 24, color = '#666666', style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={style}
    >
      <line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

// ── IconCheck ─────────────────────────────────────────────────────────────────
export function IconCheck({ size = 24, color = '#2ECC71', style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={style}
    >
      <path
        d="M4 13L9 18L20 6"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ── IconPuzzle ────────────────────────────────────────────────────────────────
export function IconPuzzle({ size = 24, color = '#4ECDC4', style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={style}
    >
      {/* Main puzzle piece path */}
      <path
        d="M4 4H10V7C10 7 11 6 12 6C13 6 14 7 14 7V4H20V10H17C17 10 18 11 18 12C18 13 17 14 17 14H20V20H14V17C14 17 13 18 12 18C11 18 10 17 10 17V20H4V14H7C7 14 6 13 6 12C6 11 7 10 7 10H4V4Z"
        fill={color}
        fillOpacity="0.2"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ── IconCards ─────────────────────────────────────────────────────────────────
export function IconCards({ size = 24, color = '#FFC851', style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={style}
    >
      {/* Back card (rotated) */}
      <rect
        x="6"
        y="5"
        width="14"
        height="18"
        rx="3"
        fill={color}
        fillOpacity="0.3"
        stroke={color}
        strokeWidth="2"
        transform="rotate(-8 6 5)"
      />
      {/* Front card */}
      <rect x="4" y="4" width="14" height="18" rx="3" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="2" />
      {/* Star on front card */}
      <polygon points="11,8 12.2,11 15,11 13,12.8 13.8,15.8 11,14.2 8.2,15.8 9,12.8 7,11 9.8,11" fill={color} />
    </svg>
  );
}

// ── IconCelebration ───────────────────────────────────────────────────────────
export function IconCelebration({ size = 24, style }: Omit<IconProps, 'color'>) {
  const lines = [
    { angle: 0,   color: '#FF6B6B' },
    { angle: 45,  color: '#FFC851' },
    { angle: 90,  color: '#4ECDC4' },
    { angle: 135, color: '#FF6B6B' },
    { angle: 180, color: '#FFC851' },
    { angle: 225, color: '#4ECDC4' },
    { angle: 270, color: '#FF6B6B' },
    { angle: 315, color: '#FFC851' },
  ];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={style}
    >
      {lines.map(({ angle, color }) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 12 + Math.cos(rad) * 4;
        const y1 = 12 + Math.sin(rad) * 4;
        const x2 = 12 + Math.cos(rad) * 9;
        const y2 = 12 + Math.sin(rad) * 9;
        return (
          <line
            key={angle}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        );
      })}
      {/* Center dot */}
      <circle cx="12" cy="12" r="2.5" fill="#FFC851" />
    </svg>
  );
}

// ── IconMuscle ────────────────────────────────────────────────────────────────
export function IconMuscle({ size = 24, color = '#FF6B6B', style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={style}
    >
      {/* Upper arm */}
      <path
        d="M4 18C4 18 3 14 5 12C7 10 9 11 9 11"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Bicep bump */}
      <path
        d="M9 11C9 11 14 9 15 6C16 3 13 2 12 4C11 6 13 8 15 8C17 8 20 7 21 9C22 11 20 14 18 15C16 16 12 16 10 17C8 18 7 19 7 19"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={color}
        fillOpacity="0.15"
      />
    </svg>
  );
}

// ── IconTone ──────────────────────────────────────────────────────────────────
// Four mini contour lines representing the 4 tones + a dot for neutral
export function IconTone({ size = 24, color = '#FF6B6B', style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={style}
    >
      {/* 1st tone: flat line (top-left) */}
      <line x1="2" y1="5" x2="9" y2="5" stroke={color} strokeWidth="2" strokeLinecap="round" />
      {/* 2nd tone: rising line (top-right) */}
      <line x1="14" y1="8" x2="22" y2="3" stroke={color} strokeWidth="2" strokeLinecap="round" />
      {/* 3rd tone: dipping curve (bottom-left) */}
      <path d="M 2 13 Q 5.5 19 9 14" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* 4th tone: falling line (bottom-right) */}
      <line x1="14" y1="13" x2="22" y2="19" stroke={color} strokeWidth="2" strokeLinecap="round" />
      {/* neutral dot (center) */}
      <circle cx="12" cy="21" r="1.5" fill={color} />
    </svg>
  );
}

// ── BgCloud ───────────────────────────────────────────────────────────────────
interface BgCloudProps {
  width?: number;
  opacity?: number;
}

export function BgCloud({ width = 80, opacity = 0.3 }: BgCloudProps) {
  const h = width * 0.6;
  return (
    <svg
      width={width}
      height={h}
      viewBox="0 0 80 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ opacity }}
    >
      <circle cx="24" cy="28" r="18" fill="white" />
      <circle cx="44" cy="22" r="20" fill="white" />
      <circle cx="62" cy="28" r="16" fill="white" />
      <rect x="10" y="28" width="60" height="18" rx="4" fill="white" />
    </svg>
  );
}

// ── BgStarDeco ────────────────────────────────────────────────────────────────
interface BgStarDecoProps {
  size?: number;
  color?: string;
  opacity?: number;
}

export function BgStarDeco({ size = 16, color = 'white', opacity = 0.5 }: BgStarDecoProps) {
  const h = size / 2;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ opacity }}
    >
      {/* 4-pointed diamond star */}
      <polygon
        points={`8,0 ${8 + h * 0.35},${8 - h * 0.35} 16,8 ${8 + h * 0.35},${8 + h * 0.35} 8,16 ${8 - h * 0.35},${8 + h * 0.35} 0,8 ${8 - h * 0.35},${8 - h * 0.35}`}
        fill={color}
      />
    </svg>
  );
}
