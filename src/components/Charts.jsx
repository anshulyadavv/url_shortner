// ─── Sparkline (line + area) ───────────────────────────────────────────────────
export function Sparkline({ data, color = "#007AFF", height = 60 }) {
  const max = Math.max(...data);
  const min = Math.min(...data);

  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 280;
      const y = height - ((v - min) / (max - min)) * (height - 10) - 5;
      return `${x},${y}`;
    })
    .join(" ");

  const area = `0,${height} ${pts} 280,${height}`;
  const gradId = `grad-${color.replace("#", "")}`;

  return (
    <svg viewBox={`0 0 280 ${height}`} style={{ width: "100%", height }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
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
    </svg>
  );
}

// ─── Bar Chart ────────────────────────────────────────────────────────────────
export function BarChart({ data, labels, color = "#007AFF", dark }) {
  const max = Math.max(...data);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 80 }}>
      {data.map((v, i) => (
        <div
          key={i}
          style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}
        >
          <div
            style={{
              width: "100%",
              borderRadius: 4,
              height: `${(v / max) * 64}px`,
              background: color,
              opacity: 0.7 + (v / max) * 0.3,
              transition: "height 0.3s",
            }}
          />
          <span style={{ fontSize: 9, color: dark ? "#555" : "#aaa", fontFamily: "sans-serif" }}>
            {labels[i]}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Donut Chart ──────────────────────────────────────────────────────────────
/**
 * segments: Array<{ value: number (0–100, should sum to 100), color: string }>
 */
export function DonutChart({ segments }) {
  const r = 36;
  const cx = 48;
  const cy = 48;
  const strokeW = 10;
  const circ = 2 * Math.PI * r;

  let cumulative = 0;
  return (
    <svg viewBox="0 0 96 96" style={{ width: 96, height: 96 }}>
      {segments.map(({ value, color }, i) => {
        const dash = (value / 100) * circ;
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
            style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
          />
        );
      })}
    </svg>
  );
}
