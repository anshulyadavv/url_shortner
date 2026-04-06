import { useTheme } from "../context/ThemeContext";
import { Icon } from "./UI";
import { Icons } from "../data/icons";
import { Link, useNavigate } from "react-router-dom";

export function Navbar() {
  const { dark, toggleDark, cardBorder, sub, text, blue, sf, btnPrimary, btnSecondary } = useTheme();
  const navigate = useNavigate();

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
            short.ly
          </span>
        </Link>

        {/* Right nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
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
    </nav>
  );
}
