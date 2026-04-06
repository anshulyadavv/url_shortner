import { useTheme } from "../context/ThemeContext";
import { Navbar } from "../components/Navbar";
import { Icon } from "../components/UI";
import { Icons } from "../data/icons";

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
  const { dark, bg, text, sf, sub } = useTheme();
  return (
    <div style={{ background: bg, minHeight: "100vh", fontFamily: sf, color: text, transition: "all 0.3s" }}>
      <AnimatedGrid dark={dark} />
      <Navbar />
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "80px 24px", position: "relative", zIndex: 1, textAlign: "center" }}>
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
    <PageLayout title="Documentation" subtitle="Learn how to get the most out of short.ly">
      <div style={{ ...cardStyle(), padding: 32, backdropFilter: "blur(20px)", background: dark ? "rgba(28,28,30,0.6)" : "rgba(255,255,255,0.6)" }}>
        <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>Getting Started</h2>
        <p style={{ color: sub, marginBottom: 24, lineHeight: 1.6 }}>
          short.ly is designed to be intuitive. Guests can instantly create temporary links that expire in 24 hours directly from the home page.
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
          <button style={{ ...btnPrimary, width: "100%", padding: "14px 24px", borderRadius: 12, fontSize: 16 }}>
            Start for free
          </button>
        </div>
      </div>
    </PageLayout>
  );
}
