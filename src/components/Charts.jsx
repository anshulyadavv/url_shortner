import { useEffect, useRef, useState } from "react";

// ─── Rolling Number ────────────────────────────────────────────────────────────
export function RollingNumber({ value, duration = 1200, style = {} }) {
  const [display, setDisplay] = useState(0);
  const startRef = useRef(null);
  const rafRef = useRef(null);
  const prevValue = useRef(0);

  useEffect(() => {
    const from = prevValue.current;
    const to =
      typeof value === "number"
        ? value
        : parseInt(value?.toString().replace(/,/g, "") || "0");
    prevValue.current = to;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    startRef.current = null;

    const animate = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const progress = Math.min((ts - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
      setDisplay(Math.round(from + (to - from) * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value]);

  return <span style={style}>{display.toLocaleString()}</span>;
}

// ─── Sparkline with interactive cursor ────────────────────────────────────────
export function Sparkline({ data, color = "#007AFF", height = 60 }) {
  const svgRef = useRef(null);
  const [hover, setHover] = useState(null); // { x, y, value, index }

  if (!data || data.length === 0) return null;

  const W = 280;
  const H = height;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;

  const getX = (i) => (i / (data.length - 1)) * W;
  const getY = (v) => H - ((v - min) / range) * (H - 12) - 6;

  const pts = data.map((v, i) => `${getX(i)},${getY(v)}`).join(" ");
  const area = `0,${H} ${pts} ${W},${H}`;
  const gradId = `grad-${color.replace("#", "")}`;

  const handleMouseMove = (e) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * W;
    // snap directly without rounding to nearest point
    const exactIndex = (mouseX / W) * (data.length - 1);
    const clamped = Math.max(
      0,
      Math.min(data.length - 1, Math.round(exactIndex)),
    );
    const snappedX = (clamped / (data.length - 1)) * W;
    setHover({
      x: snappedX,
      y: getY(data[clamped]),
      value: data[clamped],
      index: clamped,
    });
  };

  return (
    <div style={{ position: "relative" }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", height, cursor: "crosshair" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={area} fill={`url(#${gradId})`} />
        <polyline
          points={pts}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {hover && (
          <>
            {/* Vertical line */}
            <line
              x1={hover.x}
              y1={0}
              x2={hover.x}
              y2={H}
              stroke={color}
              strokeWidth="1"
              strokeDasharray="3 3"
              opacity="0.5"
            />
            {/* Dot */}
            <circle
              cx={hover.x}
              cy={hover.y}
              r={4}
              fill={color}
              stroke="white"
              strokeWidth="2"
            />
          </>
        )}
      </svg>

      {/* Tooltip */}
      {hover && (
        <div
          style={{
            position: "absolute",
            top: Math.max(0, hover.y * (100 / height) - 40) + "%",
            left: `${(hover.x / 280) * 100}%`,
            transform: hover.x > 200 ? "translateX(-110%)" : "translateX(10px)",
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(8px)",
            color: "white",
            borderRadius: 8,
            padding: "4px 10px",
            fontSize: 12,
            fontWeight: 600,
            pointerEvents: "none",
            whiteSpace: "nowrap",
            zIndex: 10,
          }}
        >
          {hover.value} clicks
        </div>
      )}
    </div>
  );
}

// ─── Bar Chart ────────────────────────────────────────────────────────────────
export function BarChart({ data, labels, color = "#007AFF", dark }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, []);

  const max = Math.max(...data, 1);
  return (
    <div
      style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 80 }}
    >
      {data.map((v, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
          }}
        >
          <div
            style={{
              width: "100%",
              borderRadius: 4,
              height: animated ? `${(v / max) * 64}px` : "0px",
              background: color,
              opacity: 0.7 + (v / max) * 0.3,
              transition: `height 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 60}ms`,
            }}
          />
          <span
            style={{
              fontSize: 9,
              color: dark ? "#555" : "#aaa",
              fontFamily: "sans-serif",
            }}
          >
            {labels[i]}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Donut Chart with clockwise animation ─────────────────────────────────────
export function DonutChart({ segments }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 150);
    return () => clearTimeout(t);
  }, [segments]);

  const r = 36;
  const cx = 48;
  const cy = 48;
  const strokeW = 10;
  const circ = 2 * Math.PI * r;

  let cumulative = 0;

  return (
    <svg viewBox="0 0 96 96" style={{ width: 96, height: 96 }}>
      {/* Background track */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="rgba(128,128,128,0.1)"
        strokeWidth={strokeW}
      />

      {segments.map(({ value, color }, i) => {
        const dash = animated
          ? (value / 100) * circ - (segments.length > 1 ? 2 : 0)
          : 0;
        const gap = circ - dash;
        const offset = circ - (cumulative * circ) / 100;
        cumulative += value;

        return (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={strokeW}
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              transform: "rotate(-90deg)",
              transformOrigin: "50% 50%",
              transition: `stroke-dasharray 0.9s cubic-bezier(0.34, 1.2, 0.64, 1) ${i * 150}ms`,
            }}
          />
        );
      })}
    </svg>
  );
}
