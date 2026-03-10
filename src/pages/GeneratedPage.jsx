import { useTheme } from "../context/ThemeContext";
import { Icon } from "../components/UI";
import { Icons } from "../data/icons";
import { useState, useEffect } from "react";

function LinkRow({ label, url, onCopy, blue, dark, sub, sf, text, cardBorder, btnSecondary }) {
  const [tooltip, setTooltip] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    try {
      const hostname = new URL(url).hostname.replace("www.", "");
      setTooltip(hostname);
    } catch {
      setTooltip(url);
    }
  }, [url]);

  return (
    <div
      style={{
        background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,122,255,0.04)",
        border: "1px solid rgba(0,122,255,0.2)",
        borderRadius: 14,
        padding: "14px 16px",
        marginBottom: 12,
        position: "relative",
      }}
    >
      <p style={{ fontSize: 11, color: sub, fontFamily: sf, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
          <span
            style={{ fontSize: 15, fontWeight: 600, color: blue, letterSpacing: -0.3, cursor: "default", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            {url}
          </span>
          {showTooltip && tooltip && (
            <div style={{
              position: "absolute",
              bottom: "calc(100% + 8px)",
              left: 0,
              background: dark ? "rgba(28,28,30,0.95)" : "rgba(255,255,255,0.95)",
              backdropFilter: "blur(12px)",
              border: `1px solid ${cardBorder}`,
              borderRadius: 8,
              padding: "6px 10px",
              fontSize: 12,
              color: text,
              fontFamily: sf,
              whiteSpace: "nowrap",
              boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
              zIndex: 10,
            }}>
              🌐 {tooltip}
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          <button
            onClick={() => onCopy(url)}
            title="Copy"
            style={{ ...btnSecondary(), padding: "6px 10px", borderRadius: 8, fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}
          >
            <Icon path={Icons.copy} size={13} />
            Copy
          </button>
          <button
            onClick={() => window.open(url, "_blank")}
            title="Open"
            style={{ ...btnSecondary(), padding: "6px 10px", borderRadius: 8, fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}
          >
            <Icon path={Icons.external} size={13} />
            Open
          </button>
        </div>
      </div>
    </div>
  );
}

export default function GeneratedPage({ shortUrl, originalUrl, onBack, onSignup, onCopy, onShowQR }) {
  const { dark, bg, cardStyle, btnPrimary, btnSecondary, blue, sub, sf, text, cardBorder } = useTheme();

  return (
    <div
      style={{
        background: bg, minHeight: "100vh", fontFamily: sf, color: text,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24,
      }}
    >
      <button
        onClick={onBack}
        style={{ position: "absolute", top: 24, left: 24, ...btnSecondary(), padding: "8px 16px", fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}
      >
        ← Back
      </button>

      <div style={{ ...cardStyle(), padding: 40, maxWidth: 520, width: "100%", textAlign: "center" }}>
        {/* Success icon */}
        <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(48,209,88,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
          <Icon path={Icons.check} size={24} color="#30D158" />
        </div>

        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, letterSpacing: -0.5 }}>Your short link is ready</h2>
        <p style={{ color: sub, fontSize: 14, marginBottom: 28 }}>This link will expire in 24 hours</p>

        {/* Short URL */}
        <LinkRow
          label="Short URL"
          url={shortUrl}
          onCopy={onCopy}
          blue={blue} dark={dark} sub={sub} sf={sf} text={text}
          cardBorder={cardBorder} btnSecondary={btnSecondary}
        />

        {/* Original URL */}
        {originalUrl && (
          <LinkRow
            label="Original URL"
            url={originalUrl}
            onCopy={onCopy}
            blue={blue} dark={dark} sub={sub} sf={sf} text={text}
            cardBorder={cardBorder} btnSecondary={btnSecondary}
          />
        )}

        {/* QR Code button */}
        <button
          onClick={() => onShowQR(shortUrl)}
          style={{ ...btnSecondary(), width: "100%", padding: "11px 0", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 12, marginBottom: 24 }}
        >
          <Icon path={Icons.qr} size={15} />
          Generate QR Code
        </button>

        {/* Upsell */}
        <div style={{ borderTop: `1px solid ${cardBorder}`, paddingTop: 20 }}>
          <p style={{ fontSize: 13, color: sub, marginBottom: 14 }}>Save this link and track analytics</p>
          <button onClick={onSignup} style={{ ...btnPrimary, width: "100%", padding: "12px 0", fontSize: 15 }}>
            Create account to save links →
          </button>
        </div>
      </div>
    </div>
  );
}