import { createContext, useContext, createElement } from "react";
import type { ReactNode } from "react";

export interface Theme {
  id: string;
  name: string;
  emoji: string;
  tagline: string;

  // Core colors
  bg: string;
  card: string;
  card2: string;
  accent: string;
  accentText: string;
  line: string;
  danger: string;

  // Typography weights & transform
  heroWeight: 500 | 600 | 700 | 900;
  h2Weight: 500 | 600 | 700 | 900;
  heroTransform: "uppercase" | "none";
  heroLetterSpacing: string;

  // Font sizes
  heroFontSize: string;
  h2FontSize: string;
  bodyFontSize: string;
  bodyLineHeight: number;

  // Font families
  fontDisplay: string;
  fontBody: string;
  fontMono: string;
  fontAccent: string;

  // Type Scale system
  typeScaleBase: number;
  typeScaleRatio: number;

  // Button tokens
  btnRadius: number;
  btnBorderWidth: number;
  btnPaddingX: number;
  btnPaddingY: number;
  btnVariant: "solid" | "outline" | "ghost";

  // Effects
  accentGlow: boolean;
  cardRadius: number;

  // Text colors — auto-computed from bg luminance
  textBase?: string;
  textBody?: string;
  textMuted?: string;

  // Blockquote style overrides
  blockquoteFontFamily?: string;
  blockquoteFontSize?: string;
  blockquoteFontStyle?: string;
  blockquoteFontWeight?: number;
}

// ─── Active theme: Stripe Editorial × Linear Precision ─────────────
export const ACTIVE_THEME: Theme = {
  id: "attio-cinema-studio",
  name: "Attio Studio Director × Linear Precision",
  emoji: "🎬",
  tagline: "Cinema Dark Studio with Ambient Optical Lighting & Next-Gen Precision",
  bg: "#08090a",
  card: "#111215",
  card2: "#16181e",
  accent: "#e11d48",
  accentText: "#ffffff",
  line: "rgba(255, 255, 255, 0.09)",
  danger: "#f43f5e",
  heroWeight: 500,
  h2Weight: 500,
  blockquoteFontWeight: 400,
  heroTransform: "none",
  heroLetterSpacing: "-0.018em",
  heroFontSize: "clamp(36px, 5.5vw, 68px)",
  h2FontSize: "clamp(24px, 3.5vw, 46px)",
  bodyFontSize: "17px",
  bodyLineHeight: 1.8,
  accentGlow: true,
  cardRadius: 16,
  fontDisplay: "'SVN-Acta', 'Acta Display', 'Noe Display', Georgia, serif",
  fontBody: "'Aeonik', 'Inter', sans-serif",
  fontMono: "'Google Sans Code', 'JetBrains Mono', monospace",
  fontAccent: "'SVN-Acta', 'Acta Display', 'Noe Display', Georgia, serif",
  typeScaleBase: 16,
  typeScaleRatio: 1.25,
  btnRadius: 12,
  btnBorderWidth: 0,
  btnPaddingX: 44,
  btnPaddingY: 20,
  btnVariant: "solid",
};

// ─── Derive readable text colors from bg luminance (WCAG AAA) ───────
function hexToLinear(c: number): number {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}
function relativeLuminance(hex: string): number {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return 0.2126 * hexToLinear(r) + 0.7152 * hexToLinear(g) + 0.0722 * hexToLinear(b);
}
function deriveTextColors(base: Theme): Theme {
  const isLight = relativeLuminance(base.bg) > 0.35;
  return {
    ...base,
    textBase: isLight ? "#09090b" : "#f4f4f5", // Zinc 100 on Dark (16:1 contrast)
    textBody: isLight ? "#27272a" : "#d4d4d8", // Zinc 300 on Dark (12:1 contrast)
    textMuted: isLight ? "#64748b" : "#a1a1aa", // Zinc 400 on Dark (Clean secondary)
  };
}

// ─── React context ───────────────────────────────────────────────
const RESOLVED_THEME = deriveTextColors(ACTIVE_THEME);
const ThemeCtx = createContext<Theme>(RESOLVED_THEME);

export function useTheme(): Theme {
  return useContext(ThemeCtx);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  return createElement(ThemeCtx.Provider, { value: RESOLVED_THEME }, children);
}
