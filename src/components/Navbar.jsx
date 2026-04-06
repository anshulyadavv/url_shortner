import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { Icon } from "./UI";
import { Icons } from "../data/icons";
import { Link, useNavigate } from "react-router-dom";

export function Navbar() {
  const { dark, toggleDark, cardBorder, sub, text, blue, sf, btnPrimary, btnSecondary } = useTheme();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav
      style={{
        position: "relative",
        top: 0,
        zIndex: 40,
        borderBottom: `1px solid ${cardBorder}`,
        backdropFilter: "blur(20px)",
        background: dark ? "rgba(15,15,16,0.85)" : "rgba(245,245,247,0.85)",
        fontFamily: sf,
      }}
    >
      <style>{`
        .nav-link {
          transition: color 0.15s ease;
          color: ${sub};
        }
        .nav-link:hover {
          color: ${text};
        }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-nav-toggle { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-nav-toggle { display: none !important; }
        }
        @keyframes menuPop {
          from { opacity: 0; transform: translateY(-12px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
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
        <Link to="/" style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: 8 }}>
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
          <span style={{ fontWeight: 600, fontSize: 16, letterSpacing: -0.3 }}>
            blink.ly
          </span>
        </Link>

        {/* Right nav - Mobile Toggle */}
        <button
          className="mobile-nav-toggle"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          style={{
            position: "relative", zIndex: 50,
            background: "none", border: "none", color: dark ? "#fff" : "#000", padding: 8, cursor: "pointer",
            display: "none", alignItems: "center", justifyContent: "center"
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" style={{ transition: "all 0.3s", opacity: isMobileOpen ? 0 : 1 }}></line>
            <line x1="3" y1="6" x2="21" y2="6" style={{ transition: "all 0.3s", transformOrigin: "center", transform: isMobileOpen ? "translateY(6px) rotate(45deg)" : "none" }}></line>
            <line x1="3" y1="18" x2="21" y2="18" style={{ transition: "all 0.3s", transformOrigin: "center", transform: isMobileOpen ? "translateY(-6px) rotate(-45deg)" : "none" }}></line>
          </svg>
        </button>

        {/* Right nav - Desktop */}
        <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {["Features", "Docs", "Pricing"].map((item) => (
            <Link
              key={item}
              to={`/${item.toLowerCase()}`}
              className="nav-link"
              style={{
                background: "none",
                border: "none",
                fontSize: 14,
                cursor: "pointer",
                padding: "6px 12px",
                borderRadius: 8,
                textDecoration: "none",
              }}
            >
              {item}
            </Link>
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
            onClick={() => navigate("/login")}
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
            onClick={() => navigate("/signup")}
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

      {/* Mobile Menu Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: dark ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.4)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            zIndex: 45,
            animation: "menuPop 0.2s ease forwards",
          }}
        />
      )}

      {/* Mobile Menu Dropdown */}
      {isMobileOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 24,
            width: 240,
            background: dark ? "rgba(28,28,30,0.98)" : "rgba(255,255,255,0.98)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: `1px solid ${cardBorder}`,
            borderRadius: 16,
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
            zIndex: 50,
            animation: "menuPop 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            transformOrigin: "top right",
          }}
        >
          {["Features", "Docs", "Pricing"].map((item) => (
            <Link
              key={item}
              to={`/${item.toLowerCase()}`}
              className="nav-link"
              onClick={() => setIsMobileOpen(false)}
              style={{ padding: "8px 12px", borderRadius: 8, textDecoration: "none", fontSize: 15 }}
            >
              {item}
            </Link>
          ))}
          <div style={{ height: 1, background: cardBorder, margin: "4px 0" }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 12px" }}>
            <span style={{ fontSize: 14, color: sub, fontFamily: sf }}>Theme</span>
            <button
              onClick={toggleDark}
              style={{ ...btnSecondary(), padding: 6, borderRadius: 8 }}
            >
              <Icon path={dark ? Icons.sun : Icons.moon} size={15} />
            </button>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
            <button
              onClick={() => { setIsMobileOpen(false); navigate("/login"); }}
              style={{ ...btnSecondary(), flex: 1, padding: "8px 0", borderRadius: 10, fontSize: 14 }}
            >
              Login
            </button>
            <button
              onClick={() => { setIsMobileOpen(false); navigate("/signup"); }}
              style={{ ...btnPrimary, flex: 1, padding: "8px 0", borderRadius: 10, fontSize: 14 }}
            >
              Sign Up
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
