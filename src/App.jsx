import { useAuth } from "./context/AuthContext";
import { useState } from "react";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { useToast } from "./hooks/useToast";
import { Toast, QRModal, Icon } from "./components/UI";
import { Icons } from "./data/icons";
import { Sidebar, PageHeader } from "./components/DashboardLayout";
import LandingPage from "./pages/LandingPage";
import GeneratedPage from "./pages/GeneratedPage";
import { LoginPage, SignupPage } from "./pages/AuthPages";
import { FeaturesPage, DocsPage, PricingPage } from "./pages/StaticPages";
import { supabase } from "./lib/supabase";
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import {
  OverviewTab,
  LinksTab,
  AnalyticsTab,
  SettingsTab,
} from "./pages/DashboardTabs";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 24) return "Good evening";
  return "Good day";
};

function AppRoutes() {
  const { bg, text, sf } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();

  const fullName = user?.user_metadata?.name ?? "";
  const name = fullName.split(" ")[0] || "there";

  const currHour = new Date().getHours();
  const isDay = currHour >= 6 && currHour < 18;
  const Sticker = () => (
    <span style={{ display: "inline-block", marginLeft: 8, animation: isDay ? "spin 12s linear infinite" : "float 3s ease-in-out infinite" }}>
      <img 
        src={isDay 
          ? "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Sun/3D/sun_3d.png" 
          : "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Crescent%20moon/3D/crescent_moon_3d.png"
        } 
        alt={isDay ? "Sun" : "Moon"}
        style={{ width: 32, height: 32, objectFit: "contain", display: "block", filter: "drop-shadow(0px 8px 12px rgba(0,0,0,0.15))" }}
      />
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
      `}</style>
    </span>
  );

  const PAGE_TITLES = {
    dashboard: { 
      title: "Dashboard", 
      subtitle: (
        <span style={{ display: "flex", alignItems: "center" }}>
          {getGreeting()}, {name} <Sticker />
        </span>
      )
    },
    links: { title: "My Links", subtitle: "Manage and track your shortened links" },
    analytics: { title: "Analytics", subtitle: "Detailed performance insights" },
    settings: { title: "Settings", subtitle: "Account preferences" },
  };

  const [sidebarTab, setSidebarTab] = useState("dashboard");
  const { toast, showToast } = useToast();
  const [qrUrl, setQrUrl] = useState(null);
  const [generatedUrl, setGeneratedUrl] = useState("");

  const handleGenerate = (shortUrl) => {
    setGeneratedUrl(shortUrl);
    navigate("/generated");
  };

  const handleCopy = (txt) => {
    navigator.clipboard.writeText(txt).catch(() => {});
    showToast("Link copied!");
  };

  const goHome = async () => {
    await supabase.auth.signOut();
    setSidebarTab("dashboard");
    navigate("/");
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

      <Routes>
        <Route path="/" element={<LandingPage onGenerate={handleGenerate} />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        
        <Route path="/generated" element={
          <GeneratedPage
            shortUrl={generatedUrl}
            onBack={() => navigate("/")}
            onSignup={() => navigate("/signup")}
            onCopy={handleCopy}
            onShowQR={setQrUrl}
          />
        } />
        
        <Route path="/login" element={
          user ? <Navigate to="/dashboard" /> : 
          <LoginPage
            onLogin={() => navigate("/dashboard")}
            onSignup={() => navigate("/signup")}
            onClose={() => navigate("/")}
          />
        } />
        
        <Route path="/signup" element={
          user ? <Navigate to="/dashboard" /> : 
          <SignupPage
            onSignup={() => navigate("/dashboard")}
            onLogin={() => navigate("/login")}
            onClose={() => navigate("/")}
          />
        } />
        
        <Route path="/dashboard" element={
          !user ? <Navigate to="/login" /> : 
          <DashboardShell
            sidebarTab={sidebarTab}
            setSidebarTab={setSidebarTab}
            onLogout={goHome}
            onCopy={handleCopy}
            onShowQR={setQrUrl}
            onShowToast={showToast}
            pageTitles={PAGE_TITLES}
          />
        } />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

function DashboardShell({ sidebarTab, setSidebarTab, onLogout, onCopy, onShowQR, onShowToast, pageTitles }) {
  const { bg, text, sf } = useTheme();
  const { title, subtitle } = pageTitles[sidebarTab];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: bg, transition: "background 0.3s" }}>
      <Sidebar activePage={sidebarTab} onNavigate={setSidebarTab} onLogout={onLogout} />
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
        {sidebarTab === "dashboard" && <OverviewTab onCopy={onCopy} onShowQR={onShowQR} onShowToast={onShowToast} />}
        {sidebarTab === "links" && <LinksTab onCopy={onCopy} onShowQR={onShowQR} onShowToast={onShowToast} />}
        {sidebarTab === "analytics" && <AnalyticsTab />}
        {sidebarTab === "settings" && <SettingsTab />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}