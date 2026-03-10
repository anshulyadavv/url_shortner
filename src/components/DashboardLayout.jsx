import { useTheme } from "../context/ThemeContext";
import { Icon } from "./UI";
import { Icons } from "../data/icons";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: Icons.grid     },
  { id: "links",     label: "My Links",  icon: Icons.link     },
  { id: "analytics", label: "Analytics", icon: Icons.chart    },
  { id: "settings",  label: "Settings",  icon: Icons.settings },
];

// Logout icon path (arrow leaving a box)
const LOGOUT_ICON = "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9";

export function Sidebar({ activePage, onNavigate, onLogout }) {
  const { dark, toggleDark, bg, cardBorder, sub, blue, sf, text } = useTheme();

  return (
    <aside
      style={{
        width: 240,
        position: "fixed",
        top: 0, left: 0, bottom: 0,
        zIndex: 30,
        background: dark ? "rgba(28,28,30,0.9)" : "rgba(255,255,255,0.9)",
        backdropFilter: "blur(20px)",
        borderRight: `1px solid ${cardBorder}`,
        display: "flex",
        flexDirection: "column",
        padding: "20px 12px",
        transition: "background 0.3s",
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 12px", marginBottom: 28 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: blue, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon path={Icons.link} size={14} color="white" />
        </div>
        <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: -0.3, color: text, fontFamily: sf }}>
          short.ly
        </span>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        {NAV_ITEMS.map(({ id, label, icon }) => {
          const active = activePage === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "9px 12px", borderRadius: 10, border: "none",
                cursor: "pointer", fontFamily: sf, fontSize: 14,
                fontWeight: active ? 600 : 400,
                textAlign: "left", width: "100%",
                transition: "all 0.15s",
                background: active
                  ? dark ? "rgba(0,122,255,0.15)" : "rgba(0,122,255,0.08)"
                  : "transparent",
                color: active ? blue : sub,
              }}
            >
              <Icon path={icon} size={16} />
              {label}
            </button>
          );
        })}
      </nav>

      {/* User + controls */}
      <div style={{ borderTop: `1px solid ${cardBorder}`, paddingTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        {/* User info row */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 4px" }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "linear-gradient(135deg, #007AFF, #30D158)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <Icon path={Icons.user} size={14} color="white" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: text, fontFamily: sf, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              Alex Johnson
            </p>
            <p style={{ fontSize: 11, color: sub, fontFamily: sf, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              alex@company.io
            </p>
          </div>
          {/* Dark mode toggle */}
          <button
            onClick={toggleDark}
            title="Toggle dark mode"
            style={{ background: "none", border: "none", cursor: "pointer", color: sub, padding: 4, borderRadius: 6, transition: "color 0.15s" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = text; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = sub; }}
          >
            <Icon path={dark ? Icons.sun : Icons.moon} size={14} />
          </button>
        </div>

        {/* Logout button */}
        <button
          onClick={onLogout}
          style={{
            display: "flex", alignItems: "center", gap: 9,
            padding: "9px 12px", borderRadius: 10, border: "none",
            cursor: "pointer", fontFamily: sf, fontSize: 14,
            fontWeight: 400, textAlign: "left", width: "100%",
            transition: "all 0.15s",
            background: "transparent",
            color: sub,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,69,58,0.08)";
            e.currentTarget.style.color = "#FF453A";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = sub;
          }}
        >
          <Icon path={LOGOUT_ICON} size={16} />
          Log Out
        </button>
      </div>
    </aside>
  );
}

// ── Page header inside the dashboard main area ────────────────────────────────
export function PageHeader({ title, subtitle }) {
  const { text, sub, sf } = useTheme();
  return (
    <div style={{ marginBottom: 28 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: -0.6, marginBottom: 4, color: text, fontFamily: sf }}>
        {title}
      </h1>
      <p style={{ fontSize: 14, color: sub, fontFamily: sf }}>{subtitle}</p>
    </div>
  );
}
