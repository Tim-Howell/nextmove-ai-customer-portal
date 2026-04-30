import { BRAND_DEFAULTS } from "./defaults";

/**
 * Build a `<style>`-ready CSS string defining the brand theme variables for
 * the Apple-style soft-light aesthetic. Reads optional admin-supplied values
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
  background_base?: string | null;
  foreground_base?: string | null;
}

interface ResolvedTheme {
  primary: string;
  accent: string;
  /** Page background (light neutral in the default theme). */
  backgroundBase: string;
  /** Page text color (near-black in the default theme). */
  foregroundBase: string;
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

  const backgroundBase = isValidHex(input?.background_base)
    ? input!.background_base!
    : BRAND_DEFAULTS.background_base;

  const foregroundBase = isValidHex(input?.foreground_base)
    ? input!.foreground_base!
    : BRAND_DEFAULTS.foreground_base;

  // Enforce contrast floor for accent against the resolved background.
  // Primary often serves as a structural color and may legitimately be
  // close in luminance to the background, so it is exempt from the floor.
  const safeAccent =
    contrastRatio(accent, backgroundBase) >= MIN_CONTRAST
      ? accent
      : BRAND_DEFAULTS.accent;

  // Body text needs AA contrast against the bg. Fall back to the brand
  // default foreground if the admin's value would be unreadable.
  const safeFg =
    contrastRatio(foregroundBase, backgroundBase) >= 4.5
      ? foregroundBase
      : BRAND_DEFAULTS.foreground_base;

  return {
    primary,
    accent: safeAccent,
    backgroundBase,
    foregroundBase: safeFg,
  };
}

/**
 * Render the resolved theme as a CSS variables block. The string is safe to
 * embed inside a server-rendered `<style>` tag; values are validated hex so
 * no escaping is required.
 */
export function buildThemeCss(input: ThemeInput | null | undefined): string {
  const t = resolveTheme(input);

  // Apple-style light derivations.
  //
  // In a light theme, elevated card surfaces sit ABOVE the page bg and are
  // either pure white or slightly brighter than the page. We target pure
  // white (#FFFFFF) as `surface` and a very light gray between bg and white
  // as `surface-2` (used for hover/second-layer panels).
  //
  // Borders are hairline low-opacity blacks. We mix toward the foreground
  // at a low ratio to get a neutral hairline that tracks the admin's fg.
  const surface = "#FFFFFF";
  const surface2 = mix(t.backgroundBase, "#FFFFFF", 0.5);
  const border = mix(t.backgroundBase, t.foregroundBase, 0.12);
  // Muted foreground sits ~55% between fg and bg (dark gray on light bg).
  const fgMuted = mix(t.foregroundBase, t.backgroundBase, 0.38);

  return `:root{
  --brand-bg:${t.backgroundBase};
  --brand-fg:${t.foregroundBase};
  --brand-fg-muted:${fgMuted};
  --brand-primary:${t.primary};
  --brand-accent:${t.accent};
  --brand-surface:${surface};
  --brand-surface-2:${surface2};
  --brand-border:${border};
  --brand-ring:${t.accent};
  --brand-bg-hsl:${hslString(t.backgroundBase)};
  --brand-fg-hsl:${hslString(t.foregroundBase)};
  --brand-primary-hsl:${hslString(t.primary)};
  --brand-accent-hsl:${hslString(t.accent)};
}`;
}
