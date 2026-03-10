import { createContext, useContext, useState } from "react";

const ThemeContext = createContext(null);

const SF = "-apple-system, 'SF Pro Display', 'SF Pro Text', sans-serif";

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(false);

  // ── Raw color tokens — always derived from current `dark` ─────────────────
  const bg         = dark ? "#0F0F10"                : "#F5F5F7";
  const card       = dark ? "#1C1C1E"                : "#FFFFFF";
  const cardBorder = dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)";
  const text       = dark ? "#F5F5F7"                : "#1d1d1f";
  const sub        = dark ? "#888888"                : "#6e6e73";
  const blue       = "#007AFF";

  // ── Style-builder functions — called at render time so always reflect current dark ──
  const cardStyle = (extra = {}) => ({
    background: card,
    borderRadius: 16,
    border: `1px solid ${cardBorder}`,
    boxShadow: dark ? "0 2px 20px rgba(0,0,0,0.4)" : "0 2px 20px rgba(0,0,0,0.06)",
    ...extra,
  });

  // Always a function — NEVER spread as a plain object. Call as inputStyle()
  const inputStyle = () => ({
    background  : dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
    border      : `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
    borderRadius: 12,
    color       : text,           // ← picks up live text color
    fontFamily  : SF,
    outline     : "none",
    width       : "100%",
    padding     : "12px 16px",
    fontSize    : 15,
    transition  : "border-color 0.15s",
  });

  const btnPrimary = {
    background  : blue,
    color       : "white",
    borderRadius: 12,
    padding     : "12px 24px",
    border      : "none",
    cursor      : "pointer",
    fontFamily  : SF,
    fontSize    : 15,
    fontWeight  : 500,
    transition  : "opacity 0.15s",
  };

  // Always a function so bg/color update on dark toggle
  const btnSecondary = (overrideDark) => ({
    background  : (overrideDark ?? dark) ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
    color       : (overrideDark ?? dark) ? "#F5F5F7"                : "#1d1d1f",
    borderRadius: 12,
    padding     : "12px 24px",
    border      : "none",
    cursor      : "pointer",
    fontFamily  : SF,
    fontSize    : 15,
    fontWeight  : 500,
    transition  : "background 0.15s, color 0.15s",
  });

  // Small icon-only button
  const btnIcon = () => ({
    background    : dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
    color         : sub,
    border        : "none",
    cursor        : "pointer",
    borderRadius  : 8,
    display       : "flex",
    alignItems    : "center",
    justifyContent: "center",
    transition    : "background 0.15s, color 0.15s",
  });

  const theme = {
    dark,
    toggleDark: () => setDark((d) => !d),
    bg, card, cardBorder, text, sub, blue,
    sf: SF,
    cardStyle,
    inputStyle,    // ← always call as inputStyle(), never spread raw
    btnPrimary,
    btnSecondary,
    btnIcon,
  };

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

/** Call inside any component to get the full theme object */
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
