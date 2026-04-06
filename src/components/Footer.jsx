import { useTheme } from "../context/ThemeContext";
import { Icon } from "./UI";
import { Icons } from "../data/icons";
import { Link } from "react-router-dom";

export function Footer() {
  const { dark, cardBorder, sub, sf } = useTheme();

  return (
    <footer
      style={{
        borderTop: `1px solid ${cardBorder}`,
        background: dark ? "rgba(15,15,16,0.6)" : "rgba(245,245,247,0.6)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        padding: "16px 24px",
        marginTop: "auto",
        fontFamily: sf,
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          {/* Brand & Copyright */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: 13, color: sub, fontWeight: 500 }}>
              © {new Date().getFullYear()} short.ly™
            </span>
            <span style={{ fontSize: 13, color: sub }}>
              Developed with ❤️ by <a href="https://github.com/anshulyadavv" target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>Anshul</a>
            </span>
          </div>

          {/* Links */}
          <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
            <Link to="/terms" style={{ fontSize: 13, color: sub, textDecoration: "none" }}>
              Terms of Use
            </Link>
            <Link to="/privacy" style={{ fontSize: 13, color: sub, textDecoration: "none" }}>
              Privacy Policy
            </Link>
            
            <a
              href="https://github.com/anshulyadavv/url_shortner"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 12px",
                borderRadius: 100,
                background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                color: sub,
                textDecoration: "none",
                fontSize: 13,
                fontWeight: 500,
                transition: "background 0.2s",
              }}
            >
              <Icon path={Icons.github} size={15} />
              Star on GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
