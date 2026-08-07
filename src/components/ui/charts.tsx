"use client";

/** Mini sparkline / bar chart sem libs externas */
export function MiniBars({
  values,
  color = "#002060",
  height = 72,
}: {
  values: number[];
  color?: string;
  height?: number;
}) {
  if (!values.length) {
    return <div className="text-xs text-black/40">Sem dados</div>;
  }
  const max = Math.max(...values, 1);
  return (
    <div className="flex items-end gap-1" style={{ height }}>
      {values.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-sm transition-all"
          style={{
            height: `${Math.max(4, (v / max) * 100)}%`,
            background: color,
            opacity: 0.55 + (i / values.length) * 0.45,
          }}
          title={String(v)}
        />
      ))}
    </div>
  );
}

export function MiniLine({
  values,
  color = "#002060",
  height = 72,
}: {
  values: number[];
  color?: string;
  height?: number;
}) {
  if (values.length < 2) return <MiniBars values={values} color={color} height={height} />;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = Math.max(max - min, 1);
  const w = 100;
  const h = 100;
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }} preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        points={points}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
