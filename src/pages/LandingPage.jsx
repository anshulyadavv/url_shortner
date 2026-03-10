import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { Icon } from "../components/UI";
import { Icons } from "../data/icons";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

export default function LandingPage({ onNavigate, onGenerate }) {
  const {
    dark,
    toggleDark,
    bg,
    cardBorder,
    sub,
    blue,
    sf,
    text,
    cardStyle,
    inputStyle,
    btnPrimary,
    btnSecondary,
  } = useTheme();
  const [urlInput, setUrlInput] = useState("");

  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!urlInput.trim()) return;
    setError("");
    setLoading(true);

    const slug = Math.random().toString(36).substr(2, 6);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const { error: err } = await supabase.from("links").insert({
      slug,
      original_url: urlInput.trim(),
      user_id: user?.id ?? null,
      is_temporary: true,
      expires_at: expiresAt,
    });

    setLoading(false);

    if (err) {
      setError("Failed to create link. Try again.");
      return;
    }

    onGenerate("sh.rt/" + slug, urlInput);
  };

  return (
    <div
      style={{
        background: bg,
        minHeight: "100vh",
        fontFamily: sf,
        color: text,
        transition: "all 0.3s",
      }}
    >
      {/* ── Navbar ── */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          borderBottom: `1px solid ${cardBorder}`,
          backdropFilter: "blur(20px)",
          background: dark ? "rgba(15,15,16,0.85)" : "rgba(245,245,247,0.85)",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "0 24px",
            height: 52,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: blue,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon path={Icons.link} size={14} color="white" />
            </div>
            <span
              style={{ fontWeight: 600, fontSize: 16, letterSpacing: -0.3 }}
            >
              short.ly
            </span>
          </div>

          {/* Right nav */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {["Features", "Docs", "Pricing"].map((item) => (
              <button
                key={item}
                style={{
                  background: "none",
                  border: "none",
                  color: sub,
                  fontSize: 14,
                  cursor: "pointer",
                  padding: "6px 12px",
                  borderRadius: 8,
                  fontFamily: sf,
                }}
              >
                {item}
              </button>
            ))}
            <div
              style={{
                width: 1,
                height: 16,
                background: cardBorder,
                margin: "0 4px",
              }}
            />
            <button
              onClick={() => onNavigate("login")}
              style={{
                ...btnSecondary(),
                padding: "6px 14px",
                fontSize: 14,
                borderRadius: 10,
              }}
            >
              Login
            </button>
            <button
              onClick={() => onNavigate("signup")}
              style={{
                ...btnPrimary,
                padding: "6px 14px",
                fontSize: 14,
                borderRadius: 10,
              }}
            >
              Sign Up
            </button>
            <button
              onClick={toggleDark}
              style={{
                ...btnSecondary(),
                padding: "6px 10px",
                borderRadius: 10,
              }}
            >
              <Icon path={dark ? Icons.sun : Icons.moon} size={15} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: "80px 24px 60px",
          textAlign: "center",
          position: "relative",
        }}
      >
        {/* Soft glow */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            width: 600,
            height: 300,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, rgba(0,122,255,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: dark ? "rgba(0,122,255,0.15)" : "rgba(0,122,255,0.08)",
            borderRadius: 100,
            padding: "4px 12px 4px 4px",
            marginBottom: 28,
            border: "1px solid rgba(0,122,255,0.2)",
          }}
        >
          <span
            style={{
              background: blue,
              borderRadius: 100,
              padding: "2px 8px",
              fontSize: 11,
              color: "white",
              fontWeight: 600,
            }}
          >
            NEW
          </span>
          <span style={{ fontSize: 13, color: blue }}>
            Analytics dashboard now live →
          </span>
        </div>

        <h1
          style={{
            fontSize: "clamp(44px, 6vw, 72px)",
            fontWeight: 700,
            letterSpacing: -2.5,
            lineHeight: 1.05,
            marginBottom: 20,
            background: dark
              ? "linear-gradient(180deg, #fff 50%, rgba(255,255,255,0.4))"
              : "linear-gradient(180deg, #1d1d1f 50%, rgba(29,29,31,0.4))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Shorten links
          <br />
          beautifully.
        </h1>

        <p
          style={{
            fontSize: 18,
            color: sub,
            marginBottom: 40,
            lineHeight: 1.6,
            maxWidth: 480,
            margin: "0 auto 40px",
          }}
        >
          Create temporary links instantly or manage permanent links with
          analytics and expiration control.
        </p>

        {/* URL input card */}
        <div
          style={{
            ...cardStyle(),
            padding: 8,
            display: "flex",
            gap: 8,
            maxWidth: 600,
            margin: "0 auto 16px",
          }}
        >
          <div style={{ flex: 1, position: "relative" }}>
            <div
              style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                color: sub,
              }}
            >
              <Icon path={Icons.link} size={16} />
            </div>
            <input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              placeholder="Paste your long URL here..."
              style={{
                ...inputStyle(),
                background: "transparent",
                border: "none",
                borderRadius: 8,
                paddingLeft: 44,
                width: "100%",
                boxSizing: "border-box",
              }}
            />
          </div>
          {error && (
            <p style={{ fontSize: 13, color: "#FF453A", marginBottom: 8 }}>
              {error}
            </p>
          )}
          <button
            onClick={handleGenerate}
            disabled={loading}
            style={{
              ...btnPrimary,
              borderRadius: 10,
              whiteSpace: "nowrap",
              padding: "12px 20px",
              fontSize: 14,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Generating…" : "Generate Short URL"}
          </button>
        </div>

        <p style={{ fontSize: 12, color: sub, opacity: 0.7 }}>
          Temporary links expire after 24 hours
        </p>
      </div>

      {/* ── Feature cards ── */}
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 24px 80px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 16,
        }}
      >
        {[
          {
            icon: Icons.link,
            title: "Temporary Links",
            desc: "Create instant short links that auto-expire after 24 hours. No account needed — paste, shorten, share.",
            color: "#007AFF",
          },
          {
            icon: Icons.edit,
            title: "Custom Short URLs",
            desc: "Brand your links with custom aliases. Make your URLs memorable and on-brand for every campaign.",
            color: "#30D158",
          },
          {
            icon: Icons.chart,
            title: "Link Analytics",
            desc: "Track every click with detailed insights — device types, countries, referrers, and time-based trends.",
            color: "#FF9F0A",
          },
        ].map(({ icon, title, desc, color }) => (
          <div
            key={title}
            style={{
              ...cardStyle(),
              padding: 28,
              transition: "transform 0.2s, box-shadow 0.2s",
              cursor: "default",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = dark
                ? "0 8px 40px rgba(0,0,0,0.5)"
                : "0 8px 40px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow = "";
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: `${color}1A`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <Icon path={icon} size={20} color={color} />
            </div>
            <h3
              style={{
                fontSize: 17,
                fontWeight: 600,
                marginBottom: 8,
                letterSpacing: -0.3,
              }}
            >
              {title}
            </h3>
            <p style={{ fontSize: 14, color: sub, lineHeight: 1.6 }}>{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
