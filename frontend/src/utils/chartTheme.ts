import type { CSSProperties } from "react";

export const CHART_COLORS = {
  primary: "#1f6b45",
  accent: "#f2b01e",
  grid: "#dde3df",
  axis: "#6b7a72",
} as const;

export const axisProps = {
  tick: { fill: CHART_COLORS.axis, fontSize: 12 },
  tickLine: false,
  axisLine: { stroke: CHART_COLORS.grid },
} as const;

export const gridProps = {
  stroke: CHART_COLORS.grid,
  strokeDasharray: "4 4",
  vertical: false,
} as const;

export const tooltipProps = {
  cursor: { fill: "rgba(31, 107, 69, 0.07)" },
  contentStyle: {
    borderRadius: 12,
    border: "1px solid #c3d9c9",
    boxShadow: "0 8px 24px rgba(16, 40, 30, 0.12)",
    fontSize: 13,
  } as CSSProperties,
  labelStyle: { fontWeight: 600, color: "#232f29" } as CSSProperties,
};
