export type AnomalySeverity = "low" | "medium" | "high" | "critical";

export type AnomalyStatus = "open" | "investigating" | "resolved";

export interface Anomaly {
  id: number;
  ingredient: string;
  type: string;
  description: string;
  detected_at: string;
  severity: AnomalySeverity;
  status: AnomalyStatus;
  current_value?: number;
  expected_value?: number;
  unit?: string;
}