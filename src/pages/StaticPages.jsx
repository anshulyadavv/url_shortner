import { useTheme } from "../context/ThemeContext";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Icon } from "../components/UI";
import { Icons } from "../data/icons";
import { useNavigate } from "react-router-dom";

function AnimatedGrid({ dark }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      <style>{`
        @keyframes gridMove {
          0% { transform: perspective(500px) rotateX(45deg) translateY(0px); }
          100% { transform: perspective(500px) rotateX(45deg) translateY(80px); }
        }
        .grid-layer {
          position: absolute;
          inset: -100%;
          width: 300%;
          height: 300%;
          background-image:
            linear-gradient(rgba(0,122,255,0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,122,255,0.12) 1px, transparent 1px);
          background-size: 80px 80px;
          animation: gridMove 4s linear infinite;
          transform-origin: center top;
        }
        .grid-fade {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 50% 0%, transparent 0%, ${dark ? "#0f0f10" : "#f5f5f7"} 70%);
        }
      `}</style>
      <div className="grid-layer" />
      <div className="grid-fade" />
    </div>
  );
}

function PageLayout({ children, title, subtitle }) {
  const { dark, bg, text, sf, sub, btnSecondary } = useTheme();
  const navigate = useNavigate();

  return (
    <div style={{ background: bg, minHeight: "100vh", fontFamily: sf, color: text, transition: "all 0.3s", display: "flex", flexDirection: "column" }}>
      <AnimatedGrid dark={dark} />
      <Navbar />
      <div style={{ maxWidth: 800, margin: "0 auto", width: "100%", padding: "32px 24px 0", position: "relative", zIndex: 1, textAlign: "left" }}>
        <button
          onClick={() => navigate("/")}
          style={{ ...btnSecondary(), padding: "8px 14px", fontSize: 14, display: "inline-flex", alignItems: "center", gap: 6, borderRadius: 8, cursor: "pointer" }}
        >
          <Icon path={Icons.arrowLeft} size={14} /> Back
        </button>
      </div>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px 80px", position: "relative", zIndex: 1, textAlign: "center", flex: 1 }}>
        <h1
          key={dark}
          style={{
            fontSize: "clamp(40px, 5vw, 56px)",
            fontWeight: 700,
            letterSpacing: -1.5,
            marginBottom: 16,
            background: dark ? "linear-gradient(180deg, #fff 50%, rgba(255,255,255,0.4))" : "linear-gradient(180deg, #1d1d1f 50%, rgba(29,29,31,0.4))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {title}
        </h1>
        <p style={{ fontSize: 18, color: sub, marginBottom: 48, lineHeight: 1.6, maxWidth: 600, margin: "0 auto 48px" }}>
          {subtitle}
        </p>
        <div style={{ textAlign: "left" }}>
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export function FeaturesPage() {
  const { dark, cardStyle, sub } = useTheme();
  return (
    <PageLayout title="Features" subtitle="Everything you need to manage your links, beautifully built into one platform.">
      <div style={{ display: "grid", gap: 16 }}>
        {[
          { icon: Icons.link, title: "Temporary Links", desc: "Create instant short links that auto-expire after 24 hours. No account needed — paste, shorten, share.", color: "#007AFF" },
          { icon: Icons.edit, title: "Custom Slugs", desc: "Brand your links with custom aliases. Make your URLs memorable and on-brand for every campaign.", color: "#30D158" },
          { icon: Icons.chart, title: "Link Analytics", desc: "Track every click with detailed insights — device types, countries, referrers, and time-based trends.", color: "#FF9F0A" },
          { icon: Icons.sun, title: "Dark Mode Ready", desc: "A beautiful UI that respects your system preferences, built natively with dark mode support.", color: "#BF5AF2" }
        ].map(({ icon, title, desc, color }) => (
          <div key={title} style={{ ...cardStyle(), padding: 24, display: "flex", gap: 20, alignItems: "center", backdropFilter: "blur(20px)", background: dark ? "rgba(28,28,30,0.6)" : "rgba(255,255,255,0.6)" }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: `${color}1A`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon path={icon} size={24} color={color} />
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4, letterSpacing: -0.3 }}>{title}</h3>
              <p style={{ fontSize: 15, color: sub, lineHeight: 1.5 }}>{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}

export function DocsPage() {
  const { dark, cardStyle, sub } = useTheme();
  return (
    <PageLayout title="Documentation" subtitle="Learn how to get the most out of blink.ly">
      <div style={{ ...cardStyle(), padding: 32, backdropFilter: "blur(20px)", background: dark ? "rgba(28,28,30,0.6)" : "rgba(255,255,255,0.6)" }}>
        <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>Getting Started</h2>
        <p style={{ color: sub, marginBottom: 24, lineHeight: 1.6 }}>
          blink.ly is designed to be intuitive. Guests can instantly create temporary links that expire in 24 hours directly from the home page.
        </p>
        <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16, marginTop: 32 }}>Managing Links</h2>
        <p style={{ color: sub, marginBottom: 24, lineHeight: 1.6 }}>
          By creating an account, you gain access to the dashboard. Here you can generate links with custom aliases, define custom expiration dates, and view your link library.
        </p>
        <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16, marginTop: 32 }}>Analytics</h2>
        <p style={{ color: sub, marginBottom: 24, lineHeight: 1.6 }}>
          Our analytics engine tracks clicks in real-time. Navigate to the Analytics tab in your dashboard to view charts breaking down clicks by device, referrer, and geographic location.
        </p>
      </div>
    </PageLayout>
  );
}

export function PricingPage() {
  const { dark, cardStyle, sub, btnPrimary } = useTheme();
  const navigate = useNavigate();
  return (
    <PageLayout title="Simple Pricing" subtitle="A free-tier to get you started without limits being an obstacle.">
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ ...cardStyle(), padding: "40px 32px", width: "100%", maxWidth: 400, textAlign: "center", position: "relative", overflow: "hidden", backdropFilter: "blur(20px)", background: dark ? "rgba(28,28,30,0.8)" : "rgba(255,255,255,0.8)" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "#007AFF" }} />
          <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>Free Tier</h2>
          <div style={{ fontSize: 48, fontWeight: 700, margin: "24px 0 8px", letterSpacing: -1 }}>$0<span style={{ fontSize: 16, color: sub, fontWeight: 400 }}>/mo</span></div>
          <p style={{ color: sub, marginBottom: 32 }}>For personal use</p>
          
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", textAlign: "left" }}>
            {[
              "30 Short Links per day",
              "100 Requests per month",
              "Real-time Analytics",
              "Custom Slug Aliases",
              "API Access (Coming Soon)"
            ].map((feature, i) => (
              <li key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, fontSize: 15 }}>
                <Icon path={Icons.check} size={14} color="#30D158" />
                {feature}
              </li>
            ))}
          </ul>
          <button onClick={() => navigate("/signup")} style={{ ...btnPrimary, width: "100%", padding: "14px 24px", borderRadius: 12, fontSize: 16 }}>
            Start for free
          </button>
        </div>
      </div>
    </PageLayout>
  );
}

export function TermsPage() {
  const { dark, cardStyle, sub } = useTheme();
  return (
    <PageLayout title="Terms & Conditions" subtitle="Please read these terms carefully before using blink.ly.">
      <div style={{ ...cardStyle(), padding: 32, backdropFilter: "blur(20px)", background: dark ? "rgba(28,28,30,0.6)" : "rgba(255,255,255,0.6)" }}>
        <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>Acceptance of Terms</h2>
        <p style={{ color: sub, marginBottom: 24, lineHeight: 1.6 }}>By using blink.ly, you agree to comply with and be bound by these terms. If you do not agree, please do not use our services.</p>
        <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>Service Usage</h2>
        <p style={{ color: sub, marginBottom: 24, lineHeight: 1.6 }}>Our services are provided "as is". You must not use our short links for sending spam, phishing, distributing malware, or any other illegal activities. We reserve the right to remove any link at our discretion without notice.</p>
        <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>Limitation of Liability</h2>
        <p style={{ color: sub, marginBottom: 24, lineHeight: 1.6 }}>We are not responsible for any issues or damages caused by links generated through our platform. Links redirect to external platforms beyond our control.</p>
      </div>
    </PageLayout>
  );
}

export function PrivacyPage() {
  const { dark, cardStyle, sub } = useTheme();
  return (
    <PageLayout title="Privacy Policy" subtitle="How we handle and respect your data.">
      <div style={{ ...cardStyle(), padding: 32, backdropFilter: "blur(20px)", background: dark ? "rgba(28,28,30,0.6)" : "rgba(255,255,255,0.6)" }}>
        <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>Data Collection</h2>
        <p style={{ color: sub, marginBottom: 24, lineHeight: 1.6 }}>We collect minimal data to provide you with the best possible service. If you create an account, we store your email and associated name securely.</p>
        <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>Link Analytics</h2>
        <p style={{ color: sub, marginBottom: 24, lineHeight: 1.6 }}>We track clicks on short links, including IP address generalizations (for geographic location), referring pages, and device/browser types. This data is exclusively made available in aggregate to the link creator.</p>
        <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>Your Rights</h2>
        <p style={{ color: sub, marginBottom: 24, lineHeight: 1.6 }}>You have the right to request deletion of your account and any associated links at any time. We will not share or sell your data to third-party advertising companies.</p>
      </div>
    </PageLayout>
  );
}
