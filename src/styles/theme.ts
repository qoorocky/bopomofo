export const COLORS = {
  primary: '#FF6B6B',
  secondary: '#4ECDC4',
  accent: '#FFC851',
  bg: '#FFF9F0',
  text: '#2D3436',
  textLight: '#636E72',
  white: '#FFFFFF',
} as const;

export const SYMBOL_COLORS = {
  consonant: ['#FF6B6B', '#FF8E53', '#FFC851', '#4ECDC4'] as const,
  vowel: ['#45B7D1', '#96CEB4', '#DDA0DD', '#98D8C8'] as const,
};

export const BORDER_RADIUS = {
  sm: '6px',
  md: '12px',
  lg: '16px',
  xl: '24px',
} as const;

export const SHADOW = {
  sm: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
  md: '0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)',
  lg: '0 10px 15px rgba(0,0,0,0.08), 0 4px 6px rgba(0,0,0,0.05)',
} as const;

export const FONT_SIZE = {
  xs: '0.75rem',
  sm: '0.875rem',
  md: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
  '4xl': '2.25rem',
} as const;
