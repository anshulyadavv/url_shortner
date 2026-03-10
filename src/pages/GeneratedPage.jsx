import { useTheme } from "../context/ThemeContext";
import { Icon, QRModal } from "../components/UI";
import { Icons } from "../data/icons";
import { useState } from "react";

export default function GeneratedPage({
  shortUrl,
  onBack,
  onSignup,
  onCopy,
  onShowQR,
}) {
  const {
    dark,
    bg,
    cardStyle,
    btnPrimary,
    btnSecondary,
    blue,
    sub,
    sf,
    text,
    cardBorder,
  } = useTheme();

  return (
    <div
      style={{
        background: bg,
        minHeight: "100vh",
        fontFamily: sf,
        color: text,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <button
        onClick={onBack}
        style={{
          position: "absolute",
          top: 24,
          left: 24,
          ...btnSecondary(),
          padding: "8px 16px",
          fontSize: 14,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        ← Back
      </button>

      <div
        style={{
          ...cardStyle(),
          padding: 40,
          maxWidth: 480,
          width: "100%",
          textAlign: "center",
        }}
      >
        {/* Success icon */}
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: "rgba(48,209,88,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
          }}
        >
          <Icon path={Icons.check} size={24} color="#30D158" />
        </div>

        <h2
          style={{
            fontSize: 24,
            fontWeight: 700,
            marginBottom: 8,
            letterSpacing: -0.5,
          }}
        >
          Your short link is ready
        </h2>
        <p style={{ color: sub, fontSize: 14, marginBottom: 28 }}>
          This link will expire in 24 hours
        </p>

        {/* Short URL display */}
        <div
          style={{
            background: dark
              ? "rgba(255,255,255,0.05)"
              : "rgba(0,122,255,0.04)",
            border: "1px solid rgba(0,122,255,0.2)",
            borderRadius: 14,
            padding: "16px 20px",
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: blue,
              letterSpacing: -0.3,
            }}
          >
            {shortUrl}
          </span>
          <button
            onClick={() => onCopy(shortUrl)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: blue,
              padding: 4,
            }}
          >
            <Icon path={Icons.copy} size={18} />
          </button>
        </div>

        {/* Action buttons */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 8,
            marginBottom: 28,
          }}
        >
          {[
  { icon: Icons.copy, label: "Copy", action: () => onCopy(shortUrl) },
  { icon: Icons.qr, label: "QR Code", action: () => onShowQR(shortUrl) },
  { icon: Icons.external, label: "Open", action: () => window.open(shortUrl, "_blank") },
].map(({ icon, label, action }) => (
            <button
              key={label}
              onClick={action}
              style={{
                ...btnSecondary(),
                padding: "10px 0",
                fontSize: 13,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                borderRadius: 10,
              }}
            >
              <Icon path={icon} size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* Upsell */}
        <div style={{ borderTop: `1px solid ${cardBorder}`, paddingTop: 20 }}>
          <p style={{ fontSize: 13, color: sub, marginBottom: 14 }}>
            Save this link and track analytics
          </p>
          <button
            onClick={onSignup}
            style={{
              ...btnPrimary,
              width: "100%",
              padding: "12px 0",
              fontSize: 15,
            }}
          >
            Create account to save links →
          </button>
        </div>
      </div>
    </div>
  );
}
