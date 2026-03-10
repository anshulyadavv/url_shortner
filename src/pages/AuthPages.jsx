import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { Icon } from "../components/UI";
import { Icons } from "../data/icons";

// ── Shared auth card wrapper ───────────────────────────────────────────────────
function AuthCard({ children, onClose }) {
  const { bg, dark, cardStyle, sf, text, sub, cardBorder } = useTheme();

  return (
    <div
      style={{
        background: bg,
        minHeight: "100vh",
        fontFamily: sf,
        color: text,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        transition: "background 0.3s, color 0.3s",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: dark
            ? "radial-gradient(ellipse at 30% 20%, rgba(0,122,255,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(48,209,88,0.06) 0%, transparent 60%)"
            : "radial-gradient(ellipse at 30% 20%, rgba(0,122,255,0.06) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(48,209,88,0.03) 0%, transparent 60%)",
        }}
      />

      {/* Close button — top-right, returns to landing */}
      <button
        onClick={onClose}
        title="Back to home"
        style={{
          position: "absolute", top: 20, right: 20, zIndex: 10,
          width: 36, height: 36, borderRadius: "50%",
          border: `1px solid ${cardBorder}`,
          background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
          color: sub,
          cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "background 0.15s, color 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = dark ? "rgba(255,69,58,0.15)" : "rgba(255,69,58,0.08)";
          e.currentTarget.style.color = "#FF453A";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";
          e.currentTarget.style.color = sub;
        }}
      >
        <Icon path={Icons.x} size={15} />
      </button>

      {/* Card */}
      <div style={{ ...cardStyle(), padding: 40, width: "100%", maxWidth: 400, position: "relative" }}>
        {children}
      </div>
    </div>
  );
}

// ── Logo mark ─────────────────────────────────────────────────────────────────
function AuthLogo({ title, subtitle }) {
  const { blue, sf, text, sub } = useTheme();
  return (
    <div style={{ textAlign: "center", marginBottom: 32 }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: blue, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
        <Icon path={Icons.link} size={20} color="white" />
      </div>
      <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: -0.5, marginBottom: 6, color: text, fontFamily: sf }}>{title}</h1>
      <p style={{ color: sub, fontSize: 14, fontFamily: sf }}>{subtitle}</p>
    </div>
  );
}

// ── Google OAuth button ───────────────────────────────────────────────────────
function GoogleButton({ label, btnStyle }) {
  return (
    <button style={{ ...btnStyle, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
      <svg width="16" height="16" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      {label}
    </button>
  );
}

// ── Divider ───────────────────────────────────────────────────────────────────
function Divider() {
  const { cardBorder, sub } = useTheme();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "12px 0" }}>
      <div style={{ flex: 1, height: 1, background: cardBorder }} />
      <span style={{ color: sub, fontSize: 12 }}>or</span>
      <div style={{ flex: 1, height: 1, background: cardBorder }} />
    </div>
  );
}

// ── LOGIN PAGE ────────────────────────────────────────────────────────────────
export function LoginPage({ onLogin, onSignup, onClose }) {
  const { inputStyle, btnPrimary, btnSecondary, blue, sub, sf } = useTheme();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");

  return (
    <AuthCard onClose={onClose}>
      <AuthLogo title="Welcome back" subtitle="Sign in to your account" />

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 12 }}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" type="email" style={inputStyle()} />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" style={inputStyle()} />
      </div>

      <div style={{ textAlign: "right", marginBottom: 20 }}>
        <button style={{ background: "none", border: "none", color: blue, fontSize: 14, cursor: "pointer", fontFamily: sf }}>
          Forgot password?
        </button>
      </div>

      <button onClick={onLogin} style={{ ...btnPrimary, width: "100%", marginBottom: 12, padding: "13px 0" }}>
        Sign In
      </button>

      <Divider />
      <GoogleButton label="Continue with Google" btnStyle={{ ...btnSecondary(), width: "100%", padding: "13px 0", marginBottom: 24 }} />

      <p style={{ textAlign: "center", fontSize: 14, color: sub, fontFamily: sf }}>
        Don't have an account?{" "}
        <button onClick={onSignup} style={{ background: "none", border: "none", color: blue, cursor: "pointer", fontFamily: sf, fontSize: 14 }}>
          Create account
        </button>
      </p>
    </AuthCard>
  );
}

// ── SIGNUP PAGE ───────────────────────────────────────────────────────────────
export function SignupPage({ onSignup, onLogin, onClose }) {
  const { inputStyle, btnPrimary, btnSecondary, blue, sub, sf } = useTheme();

  return (
    <AuthCard onClose={onClose}>
      <AuthLogo title="Create account" subtitle="Start shortening links for free" />

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
        <input placeholder="Email address"    type="email"    style={inputStyle()} />
        <input placeholder="Password"         type="password" style={inputStyle()} />
        <input placeholder="Confirm password" type="password" style={inputStyle()} />
      </div>

      <button onClick={onSignup} style={{ ...btnPrimary, width: "100%", marginBottom: 12, padding: "13px 0" }}>
        Create Account
      </button>

      <Divider />
      <GoogleButton label="Continue with Google" btnStyle={{ ...btnSecondary(), width: "100%", padding: "13px 0", marginBottom: 24 }} />

      <p style={{ textAlign: "center", fontSize: 14, color: sub, fontFamily: sf }}>
        Already have an account?{" "}
        <button onClick={onLogin} style={{ background: "none", border: "none", color: blue, cursor: "pointer", fontFamily: sf, fontSize: 14 }}>
          Sign in
        </button>
      </p>
    </AuthCard>
  );
}
