export interface LatestSensorReading {
  device_id: string;
  ingredient: string;
  weight: number;
  created_at: string;
}

export interface DashboardSummary {
  total_inventory_items: number;
  low_stock_items: number;
  total_stock: number;
  latest_sensor_reading: LatestSensorReading | null;
}

export interface DashboardSummaryResponse {
  success: boolean;
  data: DashboardSummary;
}