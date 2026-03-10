import { useAuth } from "./context/AuthContext";
import { useState } from "react";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { useToast } from "./hooks/useToast";
import { Toast, QRModal } from "./components/UI";
import { Sidebar, PageHeader } from "./components/DashboardLayout";
import LandingPage from "./pages/LandingPage";
import GeneratedPage from "./pages/GeneratedPage";
import { LoginPage, SignupPage } from "./pages/AuthPages";
import { supabase } from "./lib/supabase";
import {
  OverviewTab,
  LinksTab,
  AnalyticsTab,
  SettingsTab,
} from "./pages/DashboardTabs";

// ── Greeting helper (no user needed) ─────────────────────────────────────────
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 24) return "Good evening";
  return "Good day";
};

// ── Main app ──────────────────────────────────────────────────────────────────
function AppInner() {
  const { bg, text, sf } = useTheme();
  const { user } = useAuth();

  const fullName = user?.user_metadata?.name ?? "";
  const name = fullName.split(" ")[0] || "there";

  const PAGE_TITLES = {
    dashboard: { title: "Dashboard", subtitle: `${getGreeting()}, ${name} 👋` },
    links: {
      title: "My Links",
      subtitle: "Manage and track your shortened links",
    },
    analytics: {
      title: "Analytics",
      subtitle: "Detailed performance insights",
    },
    settings: { title: "Settings", subtitle: "Account preferences" },
  };

  // ── Router ────────────────────────────────────────────────────────────────
  const [page, setPage] = useState(user ? "dashboard" : "landing");
  const [sidebarTab, setSidebarTab] = useState("dashboard");

  // ── Shared overlays ───────────────────────────────────────────────────────
  const { toast, showToast } = useToast();
  const [qrUrl, setQrUrl] = useState(null);

  // ── Guest generated link ──────────────────────────────────────────────────
  const [generatedUrl, setGeneratedUrl] = useState("");

  const handleGenerate = (displayUrl, originalInput, realUrl) => {
    setGeneratedUrl({ display: displayUrl, real: realUrl });
    setPage("generated");
  };

  const handleCopy = (txt) => {
    navigator.clipboard.writeText(txt).catch(() => {});
    showToast("Link copied!");
  };

  const goHome = async () => {
    await supabase.auth.signOut();
    setSidebarTab("dashboard");
    setPage("landing");
  };

  return (
    <div
      style={{
        background: bg,
        color: text,
        fontFamily: sf,
        minHeight: "100vh",
        transition: "background 0.3s, color 0.3s",
      }}
    >
      <Toast message={toast.message} visible={toast.visible} />
      {qrUrl && <QRModal url={qrUrl} onClose={() => setQrUrl(null)} />}

      {page === "landing" && (
        <LandingPage onNavigate={setPage} onGenerate={handleGenerate} />
      )}

      {page === "generated" && (
        <GeneratedPage
          shortUrl={generatedUrl}
          onBack={() => setPage("landing")}
          onSignup={() => setPage("signup")}
          onCopy={handleCopy}
          onShowQR={setQrUrl}
        />
      )}

      {page === "login" && (
        <LoginPage
          onLogin={() => setPage("dashboard")}
          onSignup={() => setPage("signup")}
          onClose={goHome}
        />
      )}

      {page === "signup" && (
        <SignupPage
          onSignup={() => setPage("dashboard")}
          onLogin={() => setPage("login")}
          onClose={goHome}
        />
      )}

      {page === "dashboard" && (
        <DashboardShell
          sidebarTab={sidebarTab}
          setSidebarTab={setSidebarTab}
          onLogout={goHome}
          onCopy={handleCopy}
          onShowQR={setQrUrl}
          onShowToast={showToast}
          pageTitles={PAGE_TITLES}
        />
      )}
    </div>
  );
}

// ── Dashboard shell ───────────────────────────────────────────────────────────
function DashboardShell({
  sidebarTab,
  setSidebarTab,
  onLogout,
  onCopy,
  onShowQR,
  onShowToast,
  pageTitles,
}) {
  const { bg, text, sf } = useTheme();
  const { title, subtitle } = pageTitles[sidebarTab];

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: bg,
        transition: "background 0.3s",
      }}
    >
      <Sidebar
        activePage={sidebarTab}
        onNavigate={setSidebarTab}
        onLogout={onLogout}
      />
      <main
        style={{
          marginLeft: 240,
          flex: 1,
          padding: 32,
          background: bg,
          color: text,
          fontFamily: sf,
          minHeight: "100vh",
          transition: "background 0.3s, color 0.3s",
        }}
      >
        <PageHeader title={title} subtitle={subtitle} />

        {sidebarTab === "dashboard" && (
          <OverviewTab
            onCopy={onCopy}
            onShowQR={onShowQR}
            onShowToast={onShowToast}
          />
        )}
        {sidebarTab === "links" && (
          <LinksTab
            onCopy={onCopy}
            onShowQR={onShowQR}
            onShowToast={onShowToast}
          />
        )}
        {sidebarTab === "analytics" && <AnalyticsTab />}
        {sidebarTab === "settings" && <SettingsTab />}
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
