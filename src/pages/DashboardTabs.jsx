import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { Icon } from "../components/UI";
import { Icons } from "../data/icons";
import { Sparkline, BarChart, DonutChart, RollingNumber } from "../components/Charts";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

function getTimeLeft(expiresAt) {
  const diff = new Date(expiresAt) - new Date();
  if (diff <= 0) return "Expired";
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const days = Math.floor(hours / 24);
  if (days > 1) return `${days}d left`;
  if (hours > 1) return `${hours}h left`;
  return `${minutes}m left`;
}

// ── Overview Tab ──────────────────────────────────────────────────────────────
export function OverviewTab({ onShowQR, onCopy, onShowToast }) {
  const { dark, blue, sub, sf, text, cardStyle, inputStyle, btnPrimary } = useTheme();
  const { user } = useAuth();
  const [urlInput, setUrlInput] = useState("");
  const [expiry, setExpiry] = useState("24h");
  const [links, setLinks] = useState([]);
  const [stats, setStats] = useState({ totalClicks: 0, activeLinks: 0, expiredLinks: 0 });
  const [loading, setLoading] = useState(true);

  const expiryOptions = [
    { id: "24h", label: "24h" },
    { id: "7d", label: "7 days" },
    { id: "30d", label: "30 days" },
    { id: "perm", label: "Permanent" },
  ];

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data: linksData } = await supabase
      .from("links")
      .select("id, slug, original_url, created_at, expires_at, is_temporary")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (linksData) {
      const { data: clicksData } = await supabase
        .from("clicks")
        .select("link_id")
        .in("link_id", linksData.map((l) => l.id));

      const clickCounts = {};
      (clicksData || []).forEach((c) => {
        clickCounts[c.link_id] = (clickCounts[c.link_id] || 0) + 1;
      });

      const enriched = linksData.map((l) => ({
        ...l,
        clicks: clickCounts[l.id] || 0,
        expired: l.expires_at && new Date(l.expires_at) < new Date(),
      }));

      setLinks(enriched);
      setStats({
        totalClicks: Object.values(clickCounts).reduce((a, b) => a + b, 0),
        activeLinks: enriched.filter((l) => !l.expired).length,
        expiredLinks: enriched.filter((l) => l.expired).length,
      });
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!urlInput.trim()) return;
    const slug = Math.random().toString(36).substr(2, 6);
    let url = urlInput.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) url = "https://" + url;
    const expiryMap = { "24h": 1, "7d": 7, "30d": 30 };
    const days = expiryMap[expiry];
    const expiresAt = days ? new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString() : null;
    const { error } = await supabase.from("links").insert({
      slug, original_url: url, user_id: user.id, is_temporary: expiry === "24h", expires_at: expiresAt,
    });
    if (error) { onShowToast("Failed to create link."); return; }
    onShowToast("Short link created!");
    setUrlInput("");
    fetchData();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {[
          { label: "Total Clicks",  value: stats.totalClicks,  note: "All time",  color: blue      },
          { label: "Active Links",  value: stats.activeLinks,  note: "Live now",  color: "#30D158" },
          { label: "Expired Links", value: stats.expiredLinks, note: "Clean up",  color: "#FF453A" },
        ].map(({ label, value, note, color }) => (
          <div key={label} style={{ ...cardStyle(), padding: 24 }}>
            <p style={{ fontSize: 13, color: sub, marginBottom: 8, fontFamily: sf }}>{label}</p>
            {loading
              ? <p style={{ fontSize: 32, color, fontWeight: 700, letterSpacing: -1, marginBottom: 4, fontFamily: sf }}>—</p>
              : <RollingNumber value={value} style={{ fontSize: 32, color, fontWeight: 700, letterSpacing: -1, marginBottom: 4, fontFamily: sf, display: "block" }} />
            }
            <p style={{ fontSize: 12, color: sub, fontFamily: sf }}>{note}</p>
          </div>
        ))}
      </div>

      <div style={{ ...cardStyle(), padding: 28 }}>
        <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 20, letterSpacing: -0.3, fontFamily: sf, color: text }}>Create New Short Link</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: sub }}>
              <Icon path={Icons.link} size={16} />
            </div>
            <input value={urlInput} onChange={(e) => setUrlInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleCreate()} placeholder="https://your-long-url.com/paste-here" style={{ ...inputStyle(), paddingLeft: 40 }} />
          </div>
          <div>
            <p style={{ fontSize: 13, color: sub, marginBottom: 10, fontFamily: sf }}>Expiry</p>
            <div style={{ display: "inline-flex", background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)", borderRadius: 12, padding: 4, gap: 2 }}>
              {expiryOptions.map((opt) => {
                const active = expiry === opt.id;
                return (
                  <button key={opt.id} onClick={() => setExpiry(opt.id)} style={{ padding: "7px 16px", borderRadius: 9, border: "none", cursor: "pointer", fontFamily: sf, fontSize: 13, fontWeight: 500, transition: "all 0.15s", background: active ? (dark ? "#3A3A3C" : "white") : "transparent", color: active ? text : sub, boxShadow: active && !dark ? "0 1px 4px rgba(0,0,0,0.1)" : "none" }}>
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
          <button onClick={handleCreate} style={{ ...btnPrimary, alignSelf: "flex-start", padding: "12px 24px" }}>Create Short Link</button>
        </div>
      </div>

      <div style={{ ...cardStyle(), padding: 24 }}>
        <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 16, letterSpacing: -0.3, fontFamily: sf, color: text }}>Recent Links</h2>
        {loading ? (
          <p style={{ color: sub, fontFamily: sf, fontSize: 14 }}>Loading...</p>
        ) : links.length === 0 ? (
          <p style={{ color: sub, fontFamily: sf, fontSize: 14 }}>No links yet. Create your first one above!</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {links.slice(0, 3).map((link) => (
              <div key={link.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 8px", borderRadius: 10, transition: "background 0.15s" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, background: link.expired ? "rgba(255,69,58,0.1)" : "rgba(0,122,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon path={Icons.link} size={14} color={link.expired ? "#FF453A" : blue} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: blue, marginBottom: 2, fontFamily: sf }}>{window.location.origin}/{link.slug}</p>
                  <p style={{ fontSize: 12, color: sub, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: sf }}>{link.original_url}</p>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 1, fontFamily: sf, color: text }}>{link.clicks.toLocaleString()}</p>
                  <p style={{ fontSize: 11, color: sub, fontFamily: sf }}>clicks</p>
                </div>
                <button onClick={() => onCopy(`${window.location.origin}/${link.slug}`)} style={{ background: "none", border: "none", cursor: "pointer", color: sub, padding: 6, borderRadius: 8, transition: "color 0.15s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = blue; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = sub; }}>
                  <Icon path={Icons.copy} size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Links Tab ─────────────────────────────────────────────────────────────────
export function LinksTab({ onCopy, onShowQR, onShowToast }) {
  const { dark, blue, sub, sf, text, cardStyle, inputStyle, cardBorder } = useTheme();
  const { user } = useAuth();
  const [links, setLinks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchLinks(); }, []);

  const fetchLinks = async () => {
    setLoading(true);
    const { data: linksData } = await supabase
      .from("links")
      .select("id, slug, original_url, created_at, expires_at, is_temporary")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (linksData) {
      const { data: clicksData } = await supabase
        .from("clicks")
        .select("link_id")
        .in("link_id", linksData.map((l) => l.id));

      const clickCounts = {};
      (clicksData || []).forEach((c) => {
        clickCounts[c.link_id] = (clickCounts[c.link_id] || 0) + 1;
      });

      const enriched = linksData.map((l) => ({
        ...l,
        clicks: clickCounts[l.id] || 0,
        expired: l.expires_at && new Date(l.expires_at) < new Date(),
        expiry: l.expires_at ? (new Date(l.expires_at) < new Date() ? "Expired" : getTimeLeft(l.expires_at)) : "Permanent",
      }));

      setLinks(enriched);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    await supabase.from("links").delete().eq("id", id);
    onShowToast("Link deleted.");
    fetchLinks();
  };

  const filtered = links.filter((l) =>
    l.slug.includes(search) || l.original_url.toLowerCase().includes(search.toLowerCase())
  );

  const rowActions = (link) => [
    { icon: Icons.copy,     title: "Copy",   action: () => onCopy(`${window.location.origin}/${link.slug}`),                        danger: false },
    { icon: Icons.external, title: "Open",   action: () => window.open(`${window.location.origin}/${link.slug}`, "_blank"),         danger: false },
    { icon: Icons.qr,       title: "QR",     action: () => onShowQR(`${window.location.origin}/${link.slug}`),                      danger: false },
    { icon: Icons.trash,    title: "Delete", action: () => handleDelete(link.id),                                                   danger: true  },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ flex: 1, position: "relative" }}>
          <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: sub }}>
            <Icon path={Icons.search} size={15} />
          </div>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search links..." style={{ ...inputStyle(), paddingLeft: 40 }} />
        </div>
      </div>

      <div style={{ ...cardStyle(), overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 2fr 80px 130px 100px 110px", padding: "12px 20px", borderBottom: `1px solid ${cardBorder}`, background: dark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)" }}>
          {["Short URL", "Original URL", "Clicks", "Expiry", "Created", "Actions"].map((h) => (
            <span key={h} style={{ fontSize: 12, fontWeight: 600, color: sub, letterSpacing: 0.2, fontFamily: sf }}>{h}</span>
          ))}
        </div>
        {loading ? (
          <p style={{ padding: 24, color: sub, fontFamily: sf, fontSize: 14 }}>Loading...</p>
        ) : filtered.length === 0 ? (
          <p style={{ padding: 24, color: sub, fontFamily: sf, fontSize: 14 }}>No links found.</p>
        ) : filtered.map((link, i) => (
          <div key={link.id}
            style={{ display: "grid", gridTemplateColumns: "1.2fr 2fr 80px 130px 100px 110px", padding: "14px 20px", alignItems: "center", borderBottom: i < filtered.length - 1 ? `1px solid ${cardBorder}` : "none", transition: "background 0.15s" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: blue, fontFamily: sf }}>{window.location.origin}/{link.slug}</span>
            <span style={{ fontSize: 13, color: sub, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", paddingRight: 16, fontFamily: sf }}>{link.original_url}</span>
            <span style={{ fontSize: 14, fontWeight: 600, fontFamily: sf, color: text }}>{link.clicks.toLocaleString()}</span>
            <span>
              <span style={{ fontSize: 12, padding: "4px 8px", borderRadius: 6, fontWeight: 500, fontFamily: sf, background: link.expired ? "rgba(255,69,58,0.1)" : link.expiry === "Permanent" ? "rgba(48,209,88,0.1)" : "rgba(0,122,255,0.1)", color: link.expired ? "#FF453A" : link.expiry === "Permanent" ? "#30D158" : blue }}>
                {link.expiry}
              </span>
            </span>
            <span style={{ fontSize: 13, color: sub, fontFamily: sf }}>{new Date(link.created_at).toLocaleDateString()}</span>
            <div style={{ display: "flex", gap: 4 }}>
              {rowActions(link).map(({ icon, title, action, danger }) => (
                <button key={title} onClick={action} title={title}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: "5px 6px", borderRadius: 7, transition: "all 0.15s", color: sub }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = danger ? "rgba(255,69,58,0.1)" : dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"; e.currentTarget.style.color = danger ? "#FF453A" : text; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = sub; }}>
                  <Icon path={icon} size={14} />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <span style={{ fontSize: 13, color: sub, fontFamily: sf }}>Showing {filtered.length} of {links.length} links</span>
    </div>
  );
}

// ── Analytics Tab ─────────────────────────────────────────────────────────────
export function AnalyticsTab() {
  const { dark, blue, sub, sf, text, cardStyle } = useTheme();
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, thisWeek: 0, avgPerLink: 0 });
  const [deviceData, setDeviceData] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [sparklineData, setSparklineData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("30d");

  useEffect(() => { fetchAnalytics(); }, [range]);

  const fetchAnalytics = async () => {
    setLoading(true);
    const { data: linksData } = await supabase.from("links").select("id").eq("user_id", user.id);
    if (!linksData || linksData.length === 0) { setLoading(false); return; }

    const linkIds = linksData.map((l) => l.id);
    const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

    const { data: allClicks } = await supabase.from("clicks").select("clicked_at, device, country").in("link_id", linkIds);
    const { data: rangeClicks } = await supabase.from("clicks").select("clicked_at, device, country").in("link_id", linkIds).gte("clicked_at", since);

    const total = (allClicks || []).length;
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const thisWeek = (allClicks || []).filter((c) => c.clicked_at > weekAgo).length;
    const avgPerLink = linksData.length > 0 ? Math.round(total / linksData.length) : 0;
    setStats({ total, thisWeek, avgPerLink });

    // Sparkline
    const clicksByDay = {};
    for (let i = days - 1; i >= 0; i--) {
      const key = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
      clicksByDay[key] = 0;
    }
    (rangeClicks || []).forEach((c) => {
      const key = c.clicked_at.split("T")[0];
      if (clicksByDay[key] !== undefined) clicksByDay[key]++;
    });
    setSparklineData(Object.values(clicksByDay));

    // Devices
    const devices = {};
    (allClicks || []).forEach((c) => { const d = c.device || "Unknown"; devices[d] = (devices[d] || 0) + 1; });
    setDeviceData(Object.entries(devices).map(([name, count]) => ({ name, count, pct: total ? Math.round((count / total) * 100) + "%" : "0%" })));

    // Countries
    const countries = {};
    (allClicks || []).forEach((c) => { if (c.country) countries[c.country] = (countries[c.country] || 0) + 1; });
    const sorted = Object.entries(countries).sort((a, b) => b[1] - a[1]).slice(0, 6);
    setCountryData(sorted.map(([name, count]) => ({ name, count, pct: total ? Math.round((count / total) * 100) + "%" : "0%" })));

    setLoading(false);
  };

  const deviceColors = [blue, "#30D158", "#FF9F0A", "#FF453A"];

  // Normalise segment values to sum to 100 for DonutChart
  const donutSegments = deviceData.length > 0 ? (() => {
    const totalCount = deviceData.reduce((a, d) => a + d.count, 0);
    return deviceData.map((d, i) => ({
      value: Math.round((d.count / totalCount) * 100),
      color: deviceColors[i % deviceColors.length],
    }));
  })() : [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {[
          { label: "Total Clicks",  value: stats.total,      note: "All time"         },
          { label: "This Week",     value: stats.thisWeek,    note: "Last 7 days"      },
          { label: "Avg. per Link", value: stats.avgPerLink,  note: "Across all links" },
        ].map(({ label, value, note }) => (
          <div key={label} style={{ ...cardStyle(), padding: 24 }}>
            <p style={{ fontSize: 13, color: sub, marginBottom: 8, fontFamily: sf }}>{label}</p>
            {loading
              ? <p style={{ fontSize: 30, color: blue, fontWeight: 700, letterSpacing: -1, marginBottom: 2, fontFamily: sf }}>—</p>
              : <RollingNumber value={value} style={{ fontSize: 30, color: blue, fontWeight: 700, letterSpacing: -1, marginBottom: 2, fontFamily: sf, display: "block" }} />
            }
            <p style={{ fontSize: 12, color: sub, fontFamily: sf }}>{note}</p>
          </div>
        ))}
      </div>

      <div style={{ ...cardStyle(), padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, letterSpacing: -0.3, fontFamily: sf, color: text }}>Clicks Over Time</h2>
          <div style={{ display: "inline-flex", background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)", borderRadius: 10, padding: 3, gap: 2 }}>
            {["7d", "30d", "90d"].map((r) => (
              <button key={r} onClick={() => setRange(r)} style={{ padding: "5px 12px", borderRadius: 7, border: "none", cursor: "pointer", fontFamily: sf, fontSize: 12, background: r === range ? (dark ? "#3A3A3C" : "white") : "transparent", color: r === range ? text : sub, boxShadow: r === range && !dark ? "0 1px 4px rgba(0,0,0,0.1)" : "none" }}>
                {r}
              </button>
            ))}
          </div>
        </div>
        {sparklineData.length > 0
          ? <Sparkline data={sparklineData} color={blue} height={80} />
          : <p style={{ color: sub, fontFamily: sf, fontSize: 14 }}>No click data yet.</p>
        }
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ ...cardStyle(), padding: 28 }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, letterSpacing: -0.3, marginBottom: 20, fontFamily: sf, color: text }}>Device Types</h2>
          {donutSegments.length === 0 ? (
            <p style={{ color: sub, fontFamily: sf, fontSize: 14 }}>No data yet.</p>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <DonutChart segments={donutSegments} />
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {deviceData.map((d, i) => (
                  <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: deviceColors[i % deviceColors.length], flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: sub, fontFamily: sf }}>{d.name}</span>
                    <span style={{ fontSize: 13, color: text, fontFamily: sf, fontWeight: 600, marginLeft: "auto" }}>{d.pct}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ ...cardStyle(), padding: 28 }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, letterSpacing: -0.3, marginBottom: 20, fontFamily: sf, color: text }}>Top Countries</h2>
          {countryData.length === 0 ? (
            <p style={{ color: sub, fontFamily: sf, fontSize: 14 }}>No data yet.</p>
          ) : (
            <>
              <BarChart data={countryData.map((c) => c.count)} labels={countryData.map((c) => c.name.slice(0, 2).toUpperCase())} color={blue} dark={dark} />
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16 }}>
                {countryData.slice(0, 3).map(({ name, count, pct }) => (
                  <div key={name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 13, fontFamily: sf, color: text }}>{name}</span>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <span style={{ fontSize: 13, color: sub, fontFamily: sf }}>{count}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: blue, background: "rgba(0,122,255,0.1)", padding: "2px 7px", borderRadius: 6, fontFamily: sf }}>{pct}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Settings Tab ──────────────────────────────────────────────────────────────
export function SettingsTab() {
  const { dark, toggleDark, blue, sub, sf, text, cardStyle, inputStyle, btnPrimary } = useTheme();
  const { user } = useAuth();
  const fullName = user?.user_metadata?.name ?? "";
  const [name, setName] = useState(fullName);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setSavedMsg("");
    const { error } = await supabase.auth.updateUser({ data: { name } });
    setSaving(false);
    if (error) { setSavedMsg("Error: " + error.message); }
    else { setSavedMsg("Saved!"); setTimeout(() => setSavedMsg(""), 2000); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 600 }}>
      <div style={{ ...cardStyle(), padding: 24 }}>
        <h2 style={{ fontSize: 12, fontWeight: 600, marginBottom: 16, color: sub, textTransform: "uppercase", letterSpacing: 0.6, fontFamily: sf }}>Account</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 14, fontFamily: sf, color: text }}>Display name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} style={{ ...inputStyle(), width: 220, padding: "8px 12px", fontSize: 14 }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 14, fontFamily: sf, color: text }}>Email address</span>
            <input value={user?.email ?? ""} disabled style={{ ...inputStyle(), width: 220, padding: "8px 12px", fontSize: 14, opacity: 0.5, cursor: "not-allowed" }} />
          </div>
        </div>
      </div>

      <div style={{ ...cardStyle(), padding: 24 }}>
        <h2 style={{ fontSize: 12, fontWeight: 600, marginBottom: 16, color: sub, textTransform: "uppercase", letterSpacing: 0.6, fontFamily: sf }}>Appearance</h2>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 14, fontFamily: sf, color: text }}>Dark mode</span>
          <button onClick={toggleDark} style={{ width: 44, height: 26, borderRadius: 13, border: "none", cursor: "pointer", padding: 3, transition: "background 0.2s", background: dark ? blue : "#ddd", display: "flex", alignItems: "center", justifyContent: dark ? "flex-end" : "flex-start" }}>
            <div style={{ width: 20, height: 20, borderRadius: "50%", background: "white", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }} />
          </button>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={handleSave} disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.7 : 1 }}>
          {saving ? "Saving…" : "Save Changes"}
        </button>
        {savedMsg && <span style={{ fontSize: 13, color: savedMsg.startsWith("Error") ? "#FF453A" : "#30D158", fontFamily: sf }}>{savedMsg}</span>}
      </div>
    </div>
  );
}