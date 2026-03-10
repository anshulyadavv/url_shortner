import { useState } from "react";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { useToast } from "./hooks/useToast";
import { Toast, QRModal } from "./components/UI";
import { Sidebar, PageHeader } from "./components/DashboardLayout";
import LandingPage from "./pages/LandingPage";
import GeneratedPage from "./pages/GeneratedPage";
import { LoginPage, SignupPage } from "./pages/AuthPages";
import { OverviewTab, LinksTab, AnalyticsTab, SettingsTab } from "./pages/DashboardTabs";

const PAGE_TITLES = {
  dashboard: { title: "Dashboard",  subtitle: "Good morning, Alex 👋"                   },
  links:     { title: "My Links",   subtitle: "Manage and track your shortened links"    },
  analytics: { title: "Analytics",  subtitle: "Detailed performance insights"            },
  settings:  { title: "Settings",   subtitle: "Account preferences"                     },
};

function AppInner() {
  const { bg, text, sf } = useTheme();

  // ── Router ──────────────────────────────────────────────────────────────────
  const [page, setPage]           = useState("landing");
  const [sidebarTab, setSidebarTab] = useState("dashboard");

  // ── Shared overlays ─────────────────────────────────────────────────────────
  const { toast, showToast } = useToast();
  const [qrUrl, setQrUrl]   = useState(null);

  // ── Guest generated link ────────────────────────────────────────────────────
  const [generatedUrl, setGeneratedUrl] = useState("");

  const handleGenerate = (shortUrl) => {
    setGeneratedUrl(shortUrl);
    setPage("generated");
  };

  const handleCopy = (txt) => {
    navigator.clipboard.writeText(txt).catch(() => {});
    showToast("Link copied!");
  };

  const goHome = () => {
    setSidebarTab("dashboard"); // reset sidebar on logout/home
    setPage("landing");
  };

  return (
    // Root div carries the theme bg + text so every page inherits it
    <div style={{ background: bg, color: text, fontFamily: sf, minHeight: "100vh", transition: "background 0.3s, color 0.3s" }}>
      {/* Global overlays */}
      <Toast message={toast.message} visible={toast.visible} />
      {qrUrl && <QRModal url={qrUrl} onClose={() => setQrUrl(null)} />}

      {/* Landing */}
      {page === "landing" && (
        <LandingPage onNavigate={setPage} onGenerate={handleGenerate} />
      )}

      {/* Generated (guest result) */}
      {page === "generated" && (
        <GeneratedPage
          shortUrl={generatedUrl}
          onBack={() => setPage("landing")}
          onSignup={() => setPage("signup")}
          onCopy={handleCopy}
          onShowQR={setQrUrl}
        />
      )}

      {/* Login — onClose sends user back to landing */}
      {page === "login" && (
        <LoginPage
          onLogin={() => setPage("dashboard")}
          onSignup={() => setPage("signup")}
          onClose={goHome}
        />
      )}

      {/* Signup — onClose sends user back to landing */}
      {page === "signup" && (
        <SignupPage
          onSignup={() => setPage("dashboard")}
          onLogin={() => setPage("login")}
          onClose={goHome}
        />
      )}

      {/* Dashboard */}
      {page === "dashboard" && (
        <DashboardShell
          sidebarTab={sidebarTab}
          setSidebarTab={setSidebarTab}
          onLogout={goHome}
          onCopy={handleCopy}
          onShowQR={setQrUrl}
          onShowToast={showToast}
        />
      )}
    </div>
  );
}

// ── Dashboard shell ───────────────────────────────────────────────────────────
function DashboardShell({ sidebarTab, setSidebarTab, onLogout, onCopy, onShowQR, onShowToast }) {
  const { bg, text, sf } = useTheme();
  const { title, subtitle } = PAGE_TITLES[sidebarTab];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: bg, transition: "background 0.3s" }}>
      <Sidebar activePage={sidebarTab} onNavigate={setSidebarTab} onLogout={onLogout} />

      <main style={{
        marginLeft: 240,
        flex: 1,
        padding: 32,
        background: bg,           // ← explicit bg so it follows theme on toggle
        color: text,
        fontFamily: sf,
        minHeight: "100vh",
        transition: "background 0.3s, color 0.3s",
      }}>
        <PageHeader title={title} subtitle={subtitle} />

        {sidebarTab === "dashboard" && (
          <OverviewTab onCopy={onCopy} onShowQR={onShowQR} onShowToast={onShowToast} />
        )}
        {sidebarTab === "links"     && (
          <LinksTab onCopy={onCopy} onShowQR={onShowQR} onShowToast={onShowToast} />
        )}
        {sidebarTab === "analytics" && <AnalyticsTab />}
        {sidebarTab === "settings"  && <SettingsTab />}
      </main>
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}
