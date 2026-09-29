export const APP_NAME = "Smart Mid-Day Meal Inventory";

export const NAVIGATION_ITEMS = [
  {
    label: "Dashboard",
    path: "/",
  },
  {
    label: "Inventory",
    path: "/inventory",
  },
  {
    label: "Live Sensors",
    path: "/sensors",
  },
  {
    label: "Consumption",
    path: "/consumption",
  },
  {
    label: "AI Forecast",
    path: "/forecast",
  },
  {
    label: "Anomalies",
    path: "/anomalies",
  },
  {
    label: "Reorder",
    path: "/reorder",
  },
  {
    label: "Transactions",
    path: "/transactions",
  },
  {
    label: "Reports",
    path: "/reports",
  },
] as const;

export const DEFAULT_UNIT = "kg";

export const STOCK_STATUS = {
  HEALTHY: "healthy",
  LOW: "low",
  CRITICAL: "critical",
} as const;

export const TRANSACTION_TYPES = {
  IN: "IN",
  OUT: "OUT",
  ADJUSTMENT: "ADJUSTMENT",
} as const;

export const REFRESH_INTERVAL = 30000;