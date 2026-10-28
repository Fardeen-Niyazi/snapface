const light = {
  bg: '#F6F4EE',
  surface: '#FFFFFF',
  surfaceAlt: '#ECE9E0',
  line: 'rgba(14,18,15,0.10)',
  text: '#0E120F',
  textMuted: '#5F6B63',
  accent: '#0B8A57',
  onAccent: '#FFFFFF',
  warning: '#B7791F',
  danger: '#C2410C',
};

export type Palette = Record<keyof typeof light, string>;

const dark: Palette = {
  bg: '#07100C',
  surface: '#0E1913',
  surfaceAlt: '#15241B',
  line: 'rgba(220,255,235,0.09)',
  text: '#EAF3EC',
  textMuted: '#8DA595',
  accent: '#4BE3A0',
  onAccent: '#04120B',
  warning: '#F2B04B',
  danger: '#F87171',
};

export const palettes = { light, dark };
