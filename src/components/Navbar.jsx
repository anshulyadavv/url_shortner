import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { Icon } from "./UI";
import { Icons } from "../data/icons";
import { Link, useNavigate } from "react-router-dom";
import { MenuContainer, MenuItem } from "@/components/ui/fluid-menu";
import { LayoutGrid, FileText, CreditCard, LogIn, UserPlus, Sun, Moon, Menu as MenuIcon, X } from "lucide-react";

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
          <span style={{ fontWeight: 600, fontSize: 16, letterSpacing: -0.3, color: text }}>
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
          <div className="relative w-6 h-6">
            <div className={`absolute inset-0 transition-all duration-300 ${isMobileOpen ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"}`}>
              <MenuIcon size={24} strokeWidth={2.5} />
            </div>
            <div className={`absolute inset-0 transition-all duration-300 ${isMobileOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"}`}>
              <X size={24} strokeWidth={2.5} />
            </div>
          </div>
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
          className="fixed inset-0 z-40 md:hidden bg-black/20 dark:bg-black/40 backdrop-blur-sm"
        />
      )}

      {/* Mobile Menu Dropdown */}
      <div
        className={`fixed top-14 right-0 p-4 w-full max-w-[300px] md:hidden z-50 transition-all duration-300 pointer-events-none`}
      >
        <div
          className={`w-full overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-auto
            ${isMobileOpen ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-4 scale-95"}
          `}
          style={{
            transformOrigin: "top right",
            background: dark ? "rgba(28,28,30,0.98)" : "rgba(255,255,255,0.98)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: `1px solid ${cardBorder}`,
            borderRadius: 16,
            padding: 12,
            boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
          }}
        >
          <MenuContainer isExpanded={isMobileOpen}>
            <MenuItem 
              icon={<LayoutGrid size={18} />} 
              onClick={() => { setIsMobileOpen(false); navigate("/features"); }}
            >
              Features
            </MenuItem>
            <MenuItem 
              icon={<FileText size={18} />} 
              onClick={() => { setIsMobileOpen(false); navigate("/docs"); }}
            >
              Documentation
            </MenuItem>
            <MenuItem 
              icon={<CreditCard size={18} />} 
              onClick={() => { setIsMobileOpen(false); navigate("/pricing"); }}
            >
              Pricing
            </MenuItem>
            
            <div className="h-px bg-gray-200 dark:bg-white/10 my-1 mx-2" />
            
            <MenuItem 
              icon={dark ? <Sun size={18} /> : <Moon size={18} />} 
              onClick={toggleDark}
            >
              {dark ? "Light Mode" : "Dark Mode"}
            </MenuItem>
            
            <div className="h-px bg-gray-200 dark:bg-white/10 my-1 mx-2" />
            
            <div className="flex flex-col gap-2 p-1">
              <button
                onClick={() => { setIsMobileOpen(false); navigate("/login"); }}
                style={{ ...btnSecondary(), width: "100%", padding: "10px 0", borderRadius: 12, fontSize: 13, fontWeight: 500 }}
              >
                <span className="flex items-center justify-center gap-2">
                  <LogIn size={16} /> Login
                </span>
              </button>
              <button
                onClick={() => { setIsMobileOpen(false); navigate("/signup"); }}
                style={{ ...btnPrimary, width: "100%", padding: "10px 0", borderRadius: 12, fontSize: 13, fontWeight: 500 }}
              >
                <span className="flex items-center justify-center gap-2">
                  <UserPlus size={16} /> Sign Up
                </span>
              </button>
            </div>
          </MenuContainer>
        </div>
      </div>
    </nav>
  );
}


