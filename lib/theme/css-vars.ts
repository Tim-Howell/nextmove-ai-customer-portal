import { BRAND_DEFAULTS } from "./defaults";

/**
 * Build a `<style>`-ready CSS string defining the brand theme variables for
 * the dark Soft Modernist aesthetic. Reads optional admin-supplied values
 * from `portal_settings`, validates them, enforces a contrast floor against
 * the resolved background, and silently substitutes brand defaults for any
 * value that is missing, malformed, or low-contrast.
 *
 * Emits both hex tokens (consumed by stylesheets) and HSL component tokens
 * (consumed by recharts and other libraries that prefer composable HSL).
 */

const HEX_RE = /^#(?:[0-9A-Fa-f]{3}){1,2}$/;
/** WCAG contrast floor for fg/accent against the background. 3.0 is the
 *  AA threshold for large text and UI components. */
const MIN_CONTRAST = 3.0;

interface ThemeInput {
  primary_color?: string | null;
  accent_color?: string | null;
  background_dark?: string | null;
  background_light?: string | null;
}

interface ResolvedTheme {
  primary: string;
  accent: string;
  backgroundDark: string;
  backgroundLight: string;
}

function isValidHex(value: unknown): value is string {
  return typeof value === "string" && HEX_RE.test(value);
}

/** Expand `#abc` → `#aabbcc` for downstream math. */
function expandHex(hex: string): string {
  if (hex.length === 4) {
    return (
      "#" +
      hex
        .slice(1)
        .split("")
        .map((c) => c + c)
        .join("")
    );
  }
  return hex;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const expanded = expandHex(hex);
  const r = parseInt(expanded.slice(1, 3), 16);
  const g = parseInt(expanded.slice(3, 5), 16);
  const b = parseInt(expanded.slice(5, 7), 16);
  return { r, g, b };
}

/** sRGB → relative luminance per WCAG 2.x. */
function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const channel = (c: number) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/** RGB → HSL for chart libraries that want HSL components. */
function hexToHslComponents(hex: string): {
  h: number;
  s: number;
  l: number;
} {
  const { r, g, b } = hexToRgb(hex);
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn:
        h = (gn - bn) / d + (gn < bn ? 6 : 0);
        break;
      case gn:
        h = (bn - rn) / d + 2;
        break;
      case bn:
        h = (rn - gn) / d + 4;
        break;
    }
    h /= 6;
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslString(hex: string): string {
  const { h, s, l } = hexToHslComponents(hex);
  return `${h} ${s}% ${l}%`;
}

/** Mix two hex colors at the given ratio (0 = a, 1 = b). */
function mix(a: string, b: string, ratio: number): string {
  const ra = hexToRgb(a);
  const rb = hexToRgb(b);
  const r = Math.round(ra.r * (1 - ratio) + rb.r * ratio);
  const g = Math.round(ra.g * (1 - ratio) + rb.g * ratio);
  const blue = Math.round(ra.b * (1 - ratio) + rb.b * ratio);
  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(blue)}`;
}

function resolveTheme(input: ThemeInput | null | undefined): ResolvedTheme {
  const primary = isValidHex(input?.primary_color)
    ? input!.primary_color!
    : BRAND_DEFAULTS.primary;

  const accent = isValidHex(input?.accent_color)
    ? input!.accent_color!
    : BRAND_DEFAULTS.accent;

  const backgroundDark = isValidHex(input?.background_dark)
    ? input!.background_dark!
    : BRAND_DEFAULTS.background_dark;

  const backgroundLight = isValidHex(input?.background_light)
    ? input!.background_light!
    : BRAND_DEFAULTS.background_light;

  // Enforce contrast floor for accent against the resolved background.
  // Primary often serves as a structural color and may legitimately be
  // close in luminance to the background, so it is exempt from the floor.
  const safeAccent =
    contrastRatio(accent, backgroundDark) >= MIN_CONTRAST
      ? accent
      : BRAND_DEFAULTS.accent;

  // Foreground (text on dark) needs strong contrast — fall back to the
  // brand default light if the admin's value would be unreadable.
  const safeFg =
    contrastRatio(backgroundLight, backgroundDark) >= 4.5
      ? backgroundLight
      : BRAND_DEFAULTS.background_light;

  return {
    primary,
    accent: safeAccent,
    backgroundDark,
    backgroundLight: safeFg,
  };
}

/**
 * Render the resolved theme as a CSS variables block. The string is safe to
 * embed inside a server-rendered `<style>` tag; values are validated hex so
 * no escaping is required.
 */
export function buildThemeCss(input: ThemeInput | null | undefined): string {
  const t = resolveTheme(input);

  // Derive surface tones from the background.
  const surface = mix(t.backgroundDark, t.backgroundLight, 0.06);
  const surface2 = mix(t.backgroundDark, t.backgroundLight, 0.1);
  // Border at low opacity of fg.
  const border = mix(t.backgroundDark, t.backgroundLight, 0.14);
  // Muted foreground sits between fg and bg.
  const fgMuted = mix(t.backgroundLight, t.backgroundDark, 0.45);

  return `:root{
  --brand-bg:${t.backgroundDark};
  --brand-fg:${t.backgroundLight};
  --brand-fg-muted:${fgMuted};
  --brand-primary:${t.primary};
  --brand-accent:${t.accent};
  --brand-surface:${surface};
  --brand-surface-2:${surface2};
  --brand-border:${border};
  --brand-ring:${t.accent};
  --brand-bg-hsl:${hslString(t.backgroundDark)};
  --brand-fg-hsl:${hslString(t.backgroundLight)};
  --brand-primary-hsl:${hslString(t.primary)};
  --brand-accent-hsl:${hslString(t.accent)};
}`;
}
