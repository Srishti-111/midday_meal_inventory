export interface ConsumptionRecord {
  id?: number;
  ingredient: string;
  quantity: number;
  unit: string;
  date: string;
  meals_served?: number;
}

export interface ConsumptionSummary {
  total_consumption: number;
  average_daily_consumption: number;
  highest_consumption: number;
  lowest_consumption: number;
}

export interface ConsumptionChartData {
  date: string;
  consumption: number;
}