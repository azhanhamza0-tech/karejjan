import type { Locale, ThemeMode } from '../types/domain';

export interface AppearanceThemeDefinition {
  id: ThemeMode;
  number: string;
  isDark: boolean;
  canvas: string;
  surface: string;
  text: string;
  muted: string;
  accent: string;
  accentHover: string;
  soft: string;
  border: string;
  onAccent: string;
  glowRgb: string;
  glowSecondaryRgb: string;
  names: Record<Locale, string>;
}

export const APPEARANCE_THEMES: AppearanceThemeDefinition[] = [
  {
    id: 'light',
    number: '01',
    isDark: false,
    canvas: '#f4f8f5',
    surface: '#ffffff',
    text: '#18362b',
    muted: '#637d6f',
    accent: '#087f5b',
    accentHover: '#056949',
    soft: '#e4f6ec',
    border: '#dceae0',
    onAccent: '#ffffff',
    glowRgb: '24, 169, 116',
    glowSecondaryRgb: '8, 127, 91',
    names: {
      ckb: 'ڕووناک (Light)',
      kmr: 'ڕۆهن (Light)',
      ar: 'فاتح (Light)',
      en: 'Light',
    },
  },
  {
    id: 'dark',
    number: '02',
    isDark: true,
    canvas: '#101b16',
    surface: '#1d2924',
    text: '#f3faf5',
    muted: '#b8cbbf',
    accent: '#6edda6',
    accentHover: '#8be6b9',
    soft: '#30483a',
    border: '#3b5446',
    onAccent: '#10261b',
    glowRgb: '110, 221, 166',
    glowSecondaryRgb: '48, 168, 112',
    names: {
      ckb: 'تاریک (Dark)',
      kmr: 'تاری (Dark)',
      ar: 'داكن (Dark)',
      en: 'Dark',
    },
  },
  {
    id: 'forest',
    number: '03',
    isDark: false,
    canvas: '#e2f0d9',
    surface: '#eff8e7',
    text: '#1d4028',
    muted: '#52705a',
    accent: '#287144',
    accentHover: '#1f5b36',
    soft: '#d6eccd',
    border: '#c7dec3',
    onAccent: '#ffffff',
    glowRgb: '40, 113, 68',
    glowSecondaryRgb: '78, 160, 108',
    names: {
      ckb: 'دارستان (Forest)',
      kmr: 'دارستان (Forest)',
      ar: 'الغابة (Forest)',
      en: 'Forest',
    },
  },
  {
    id: 'ocean',
    number: '04',
    isDark: false,
    canvas: '#e1f3fa',
    surface: '#f0f8fd',
    text: '#163b53',
    muted: '#537586',
    accent: '#126d98',
    accentHover: '#0d5679',
    soft: '#d5effa',
    border: '#c6e5f0',
    onAccent: '#ffffff',
    glowRgb: '18, 109, 152',
    glowSecondaryRgb: '56, 163, 212',
    names: {
      ckb: 'ئۆقیانووس (Ocean)',
      kmr: 'ئۆقیانوس (Ocean)',
      ar: 'المحيط (Ocean)',
      en: 'Ocean',
    },
  },
  {
    id: 'sunset',
    number: '05',
    isDark: false,
    canvas: '#fff0e4',
    surface: '#fff7f0',
    text: '#4c2d26',
    muted: '#89665c',
    accent: '#a94c29',
    accentHover: '#8b3c1e',
    soft: '#fce6d7',
    border: '#efd3c2',
    onAccent: '#ffffff',
    glowRgb: '169, 76, 41',
    glowSecondaryRgb: '226, 128, 86',
    names: {
      ckb: 'ئاوابوون (Sunset)',
      kmr: 'ئاڤابوون (Sunset)',
      ar: 'الغروب (Sunset)',
      en: 'Sunset',
    },
  },
  {
    id: 'lavender',
    number: '06',
    isDark: false,
    canvas: '#f1eafb',
    surface: '#faf7ff',
    text: '#382d50',
    muted: '#716381',
    accent: '#7048b6',
    accentHover: '#5b379b',
    soft: '#eee5fa',
    border: '#e2d6f2',
    onAccent: '#ffffff',
    glowRgb: '112, 72, 182',
    glowSecondaryRgb: '154, 114, 218',
    names: {
      ckb: 'لاڤێندەر (Lavender)',
      kmr: 'لاڤێندەر (Lavender)',
      ar: 'الخزامى (Lavender)',
      en: 'Lavender',
    },
  },
];

export const VALID_THEME_MODES: readonly ThemeMode[] = APPEARANCE_THEMES.map((t) => t.id);

export function isValidThemeMode(value: unknown): value is ThemeMode {
  return typeof value === 'string' && (VALID_THEME_MODES as readonly string[]).includes(value);
}

export function getThemeDefinition(theme: ThemeMode): AppearanceThemeDefinition {
  return APPEARANCE_THEMES.find((t) => t.id === theme) || APPEARANCE_THEMES[0];
}
