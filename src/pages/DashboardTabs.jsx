import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { Icon } from "../components/UI";
import { Icons } from "../data/icons";
import { Sparkline, BarChart, DonutChart } from "../components/Charts";
import { mockLinks, chartData } from "../data/mockData";

// ── Overview Tab ──────────────────────────────────────────────────────────────
export function OverviewTab({ onShowQR, onCopy, onShowToast }) {
  const { dark, blue, sub, sf, text, cardStyle, inputStyle, btnPrimary } = useTheme();
  const [urlInput, setUrlInput] = useState("");
  const [expiry, setExpiry] = useState("24h");

  const expiryOptions = [
    { id: "24h",  label: "24h"       },
    { id: "7d",   label: "7 days"    },
    { id: "30d",  label: "30 days"   },
    { id: "perm", label: "Permanent" },
  ];

  const handleCreate = () => {
    if (!urlInput.trim()) return;
    onShowToast("Short link created!");
    setUrlInput("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {[
          { label: "Total Clicks",  value: "8,158", note: "+12.4%",   color: blue     },
          { label: "Active Links",  value: "4",     note: "+1 today", color: "#30D158" },
          { label: "Expired Links", value: "1",     note: "Clean up", color: "#FF453A" },
        ].map(({ label, value, note, color }) => (
          <div key={label} style={{ ...cardStyle(), padding: 24 }}>
            <p style={{ fontSize: 13, color: sub,  marginBottom: 8,  fontFamily: sf }}>{label}</p>
            <p style={{ fontSize: 32, color,       fontWeight: 700,   letterSpacing: -1, marginBottom: 4, fontFamily: sf }}>{value}</p>
            <p style={{ fontSize: 12, color: sub,  fontFamily: sf }}>{note}</p>
          </div>
        ))}
      </div>

      {/* Create new link */}
      <div style={{ ...cardStyle(), padding: 28 }}>
        <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 20, letterSpacing: -0.3, fontFamily: sf, color: text }}>
          Create New Short Link
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: sub }}>
              <Icon path={Icons.link} size={16} />
            </div>
            <input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://your-long-url.com/paste-here"
              style={{ ...inputStyle(), paddingLeft: 40 }}
            />
          </div>

          <div>
            <p style={{ fontSize: 13, color: sub, marginBottom: 10, fontFamily: sf }}>Expiry</p>
            <div style={{
              display: "inline-flex",
              background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
              borderRadius: 12, padding: 4, gap: 2,
            }}>
              {expiryOptions.map((opt) => {
                const active = expiry === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setExpiry(opt.id)}
                    style={{
                      padding: "7px 16px", borderRadius: 9, border: "none",
                      cursor: "pointer", fontFamily: sf, fontSize: 13, fontWeight: 500,
                      transition: "all 0.15s",
                      background: active ? (dark ? "#3A3A3C" : "white") : "transparent",
                      color: active ? text : sub,
                      boxShadow: active && !dark ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          <button onClick={handleCreate} style={{ ...btnPrimary, alignSelf: "flex-start", padding: "12px 24px" }}>
            Create Short Link
          </button>
        </div>
      </div>

      {/* Recent links */}
      <div style={{ ...cardStyle(), padding: 24 }}>
        <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 16, letterSpacing: -0.3, fontFamily: sf, color: text }}>
          Recent Links
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {mockLinks.slice(0, 3).map((link) => (
            <div
              key={link.id}
              style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 8px", borderRadius: 10, transition: "background 0.15s", cursor: "default" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              <div style={{
                width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                background: link.status === "expired" ? "rgba(255,69,58,0.1)" : "rgba(0,122,255,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon path={Icons.link} size={14} color={link.status === "expired" ? "#FF453A" : blue} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: blue, marginBottom: 2, fontFamily: sf }}>{link.short}</p>
                <p style={{ fontSize: 12, color: sub, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: sf }}>{link.original}</p>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 1, fontFamily: sf, color: text }}>{link.clicks.toLocaleString()}</p>
                <p style={{ fontSize: 11, color: sub, fontFamily: sf }}>clicks</p>
              </div>
              <button
                onClick={() => onCopy(link.short)}
                style={{ background: "none", border: "none", cursor: "pointer", color: sub, padding: 6, borderRadius: 8, transition: "color 0.15s" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = blue; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = sub; }}
              >
                <Icon path={Icons.copy} size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Links Tab ─────────────────────────────────────────────────────────────────
export function LinksTab({ onCopy, onShowQR, onShowToast }) {
  const { dark, blue, sub, sf, text, cardStyle, inputStyle, btnPrimary, cardBorder } = useTheme();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = mockLinks.filter(
    (l) => l.short.includes(search) || l.original.toLowerCase().includes(search.toLowerCase())
  );

  const rowActions = (link) => [
    { icon: Icons.copy,     title: "Copy",   action: () => onCopy(link.short),         danger: false },
    { icon: Icons.external, title: "Open",   action: () => {},                          danger: false },
    { icon: Icons.qr,       title: "QR",     action: () => onShowQR(link.short),        danger: false },
    { icon: Icons.trash,    title: "Delete", action: () => onShowToast("Link deleted"), danger: true  },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Toolbar */}
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ flex: 1, position: "relative" }}>
          <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: sub }}>
            <Icon path={Icons.search} size={15} />
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search links..."
            style={{ ...inputStyle(), paddingLeft: 40 }}
          />
        </div>
        <button style={{ ...btnPrimary, padding: "11px 18px", display: "flex", alignItems: "center", gap: 6, fontSize: 14, whiteSpace: "nowrap" }}>
          + New Link
        </button>
      </div>

      {/* Table */}
      <div style={{ ...cardStyle(), overflow: "hidden" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "1.2fr 2fr 80px 130px 100px 110px",
          padding: "12px 20px", borderBottom: `1px solid ${cardBorder}`,
          background: dark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
        }}>
          {["Short URL", "Original URL", "Clicks", "Expiry", "Created", "Actions"].map((h) => (
            <span key={h} style={{ fontSize: 12, fontWeight: 600, color: sub, letterSpacing: 0.2, fontFamily: sf }}>{h}</span>
          ))}
        </div>

        {filtered.map((link, i) => (
          <div
            key={link.id}
            style={{
              display: "grid", gridTemplateColumns: "1.2fr 2fr 80px 130px 100px 110px",
              padding: "14px 20px", alignItems: "center",
              borderBottom: i < filtered.length - 1 ? `1px solid ${cardBorder}` : "none",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            <span style={{ fontSize: 14, fontWeight: 600, color: blue, fontFamily: sf }}>{link.short}</span>
            <span style={{ fontSize: 13, color: sub, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", paddingRight: 16, fontFamily: sf }}>{link.original}</span>
            <span style={{ fontSize: 14, fontWeight: 600, fontFamily: sf, color: text }}>{link.clicks.toLocaleString()}</span>
            <span>
              <span style={{
                fontSize: 12, padding: "4px 8px", borderRadius: 6, fontWeight: 500, fontFamily: sf,
                background: link.status === "expired" ? "rgba(255,69,58,0.1)" : link.expiry === "Permanent" ? "rgba(48,209,88,0.1)" : "rgba(0,122,255,0.1)",
                color: link.status === "expired" ? "#FF453A" : link.expiry === "Permanent" ? "#30D158" : blue,
              }}>
                {link.expiry}
              </span>
            </span>
            <span style={{ fontSize: 13, color: sub, fontFamily: sf }}>{link.created}</span>
            <div style={{ display: "flex", gap: 4 }}>
              {rowActions(link).map(({ icon, title, action, danger }) => (
                <button
                  key={title} onClick={action} title={title}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: "5px 6px", borderRadius: 7, transition: "all 0.15s", color: sub }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = danger ? "rgba(255,69,58,0.1)" : dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
                    e.currentTarget.style.color = danger ? "#FF453A" : text;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = sub;
                  }}
                >
                  <Icon path={icon} size={14} />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 0" }}>
        <span style={{ fontSize: 13, color: sub, fontFamily: sf }}>
          Showing 1–{filtered.length} of {mockLinks.length} links
        </span>
        <div style={{ display: "flex", gap: 6 }}>
          {[1, 2, 3].map((p) => (
            <button
              key={p} onClick={() => setCurrentPage(p)}
              style={{
                width: 32, height: 32, borderRadius: 8, border: "none",
                cursor: "pointer", fontFamily: sf, fontSize: 13,
                fontWeight: currentPage === p ? 600 : 400, transition: "all 0.15s",
                background: currentPage === p ? blue : dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
                color: currentPage === p ? "white" : sub,
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Analytics Tab ─────────────────────────────────────────────────────────────
export function AnalyticsTab() {
  const { dark, blue, sub, sf, text, cardStyle } = useTheme();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {[
          { label: "Total Clicks",  value: "8,158", note: "All time"           },
          { label: "This Week",     value: "1,204",  note: "+18% vs last week" },
          { label: "Avg. per Link", value: "1,631", note: "5 active links"     },
        ].map(({ label, value, note }) => (
          <div key={label} style={{ ...cardStyle(), padding: 24 }}>
            <p style={{ fontSize: 13, color: sub,  marginBottom: 8,  fontFamily: sf }}>{label}</p>
            <p style={{ fontSize: 30, color: blue, fontWeight: 700,  letterSpacing: -1, marginBottom: 2, fontFamily: sf }}>{value}</p>
            <p style={{ fontSize: 12, color: sub,  fontFamily: sf }}>{note}</p>
          </div>
        ))}
      </div>

      {/* Sparkline */}
      <div style={{ ...cardStyle(), padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, letterSpacing: -0.3, fontFamily: sf, color: text }}>Clicks Over Time</h2>
          <div style={{ display: "inline-flex", background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)", borderRadius: 10, padding: 3, gap: 2 }}>
            {["7d", "30d", "90d"].map((r) => (
              <button key={r} style={{
                padding: "5px 12px", borderRadius: 7, border: "none", cursor: "pointer",
                fontFamily: sf, fontSize: 12,
                background: r === "30d" ? (dark ? "#3A3A3C" : "white") : "transparent",
                color: r === "30d" ? text : sub,
                boxShadow: r === "30d" && !dark ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
              }}>
                {r}
              </button>
            ))}
          </div>
        </div>
        <Sparkline data={chartData} color={blue} height={80} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
          {["Mar 1", "", "", "", "Mar 8", "", "", "", "Mar 15"].map((l, i) => (
            <span key={i} style={{ fontSize: 10, color: sub, fontFamily: sf }}>{l}</span>
          ))}
        </div>
      </div>

      {/* Device + Country */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ ...cardStyle(), padding: 28 }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, letterSpacing: -0.3, marginBottom: 20, fontFamily: sf, color: text }}>Device Types</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <DonutChart segments={[
              { value: 58, color: blue      },
              { value: 28, color: "#30D158" },
              { value: 14, color: "#FF9F0A" },
            ]} />
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "Mobile",  pct: "58%", color: blue      },
                { label: "Desktop", pct: "28%", color: "#30D158" },
                { label: "Other",   pct: "14%", color: "#FF9F0A" },
              ].map(({ label, pct, color }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: sub,  fontFamily: sf }}>{label}</span>
                  <span style={{ fontSize: 13, color: text, fontFamily: sf, fontWeight: 600, marginLeft: "auto" }}>{pct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ ...cardStyle(), padding: 28 }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, letterSpacing: -0.3, marginBottom: 20, fontFamily: sf, color: text }}>Top Countries</h2>
          <BarChart data={[420, 310, 240, 180, 140, 90]} labels={["US", "UK", "DE", "CA", "FR", "AU"]} color={blue} dark={dark} />
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16 }}>
            {[
              { country: "🇺🇸 United States", clicks: 420, pct: "34%" },
              { country: "🇬🇧 United Kingdom", clicks: 310, pct: "25%" },
              { country: "🇩🇪 Germany",         clicks: 240, pct: "19%" },
            ].map(({ country, clicks, pct }) => (
              <div key={country} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, fontFamily: sf, color: text }}>{country}</span>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: sub, fontFamily: sf }}>{clicks}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: blue, background: "rgba(0,122,255,0.1)", padding: "2px 7px", borderRadius: 6, fontFamily: sf }}>{pct}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Settings Tab ──────────────────────────────────────────────────────────────
export function SettingsTab() {
  const { dark, toggleDark, blue, sub, sf, text, cardStyle, inputStyle, btnPrimary } = useTheme();

  const sections = [
    {
      title: "Account",
      items: [
        { label: "Display name",  value: "Alex Johnson",    type: "text"  },
        { label: "Email address", value: "alex@company.io", type: "email" },
      ],
    },
    {
      title: "Appearance",
      items: [{ label: "Dark mode", value: dark, type: "toggle", onChange: toggleDark }],
    },
    {
      title: "Link Defaults",
      items: [
        { label: "Default expiry", value: "24 hours", type: "text" },
        { label: "Custom domain",  value: "sh.rt",    type: "text" },
      ],
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 600 }}>
      {sections.map((section) => (
        <div key={section.title} style={{ ...cardStyle(), padding: 24 }}>
          <h2 style={{ fontSize: 12, fontWeight: 600, marginBottom: 16, color: sub, textTransform: "uppercase", letterSpacing: 0.6, fontFamily: sf }}>
            {section.title}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {section.items.map((item) => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 14, fontFamily: sf, color: text }}>{item.label}</span>
                {item.type === "toggle" ? (
                  <button
                    onClick={item.onChange}
                    style={{
                      width: 44, height: 26, borderRadius: 13, border: "none",
                      cursor: "pointer", padding: 3, transition: "background 0.2s",
                      background: item.value ? blue : dark ? "#3A3A3C" : "#ddd",
                      display: "flex", alignItems: "center",
                      justifyContent: item.value ? "flex-end" : "flex-start",
                    }}
                  >
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: "white", boxShadow: "0 1px 4px rgba(0,0,0,0.3)", transition: "all 0.2s" }} />
                  </button>
                ) : (
                  <input defaultValue={item.value} style={{ ...inputStyle(), width: 220, padding: "8px 12px", fontSize: 14 }} />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      <button style={{ ...btnPrimary, alignSelf: "flex-start" }}>Save Changes</button>
    </div>
  );
}
