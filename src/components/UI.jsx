import { useRef } from "react";
import { useTheme } from "../context/ThemeContext";
import { Icons } from "../data/icons";
import { QRCodeCanvas } from "qrcode.react";

// ─── Generic SVG icon wrapper ─────────────────────────────────────────────────
export function Icon({ path, size = 16, color, style = {} }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color || "currentColor"}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
    >
      <path d={path} />
    </svg>
  );
}

// ─── Toast notification ───────────────────────────────────────────────────────
export function Toast({ message, visible }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 32,
        left: "50%",
        transform: `translateX(-50%) translateY(${visible ? 0 : 16}px)`,
        zIndex: 9999,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 0.4s, transform 0.4s",
      }}
    >
      <div
        style={{
          background: "rgba(28,28,30,0.92)",
          backdropFilter: "blur(20px)",
          borderRadius: 14,
          border: "1px solid rgba(255,255,255,0.1)",
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 18px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        }}
      >
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "#30D158",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon path={Icons.check} size={11} color="white" />
        </div>
        <span
          style={{
            color: "white",
            fontSize: 14,
            fontWeight: 500,
            fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
          }}
        >
          {message}
        </span>
      </div>
    </div>
  );
}

// ─── QR Code Modal ────────────────────────────────────────────────────────────
export function QRModal({ url, onClose }) {
  const { dark, blue, sf } = useTheme();
  const qrRef = useRef();

  if (!url) return null;

  const handleDownload = () => {
    if (!qrRef.current) return;
    const canvas = qrRef.current.querySelector("canvas");
    if (!canvas) return;
    const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "shortly-qr.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Backdrop */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(8px)",
        }}
      />

      {/* Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          zIndex: 10,
          background: dark ? "#1C1C1E" : "white",
          borderRadius: 20,
          border: dark
            ? "1px solid rgba(255,255,255,0.08)"
            : "1px solid rgba(0,0,0,0.06)",
          boxShadow: "0 40px 80px rgba(0,0,0,0.3)",
          padding: 32,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
          width: 320,
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <span style={{ fontWeight: 600, fontSize: 16, color: dark ? "#fff" : "#1d1d1f", fontFamily: sf }}>
            QR Code
          </span>
          <button
            onClick={onClose}
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)",
              color: dark ? "#aaa" : "#555",
            }}
          >
            <Icon path={Icons.x} size={13} />
          </button>
        </div>

        {/* QR Code */}
        <div
          ref={qrRef}
          style={{
            width: 180,
            height: 180,
            background: "white",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <QRCodeCanvas value={url} size={148} level="H" />
        </div>

        <p style={{ fontSize: 12, color: dark ? "#888" : "#666", fontFamily: sf, textAlign: "center", wordBreak: "break-all", padding: "0 10px" }}>
          {url}
        </p>

        <button
          onClick={handleDownload}
          style={{
            width: "100%",
            padding: "11px 0",
            borderRadius: 12,
            border: "none",
            background: blue,
            color: "white",
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: sf,
          }}
        >
          Download PNG
        </button>
      </div>
    </div>
  );
}
