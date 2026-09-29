export interface MLPredictionRequest {
  ingredient: string;
  students_present: number;
  meals_served: number;
  previous_day_consumption: number;
  rolling_7_day_consumption: number;
  day_of_week_num: number;
  month_num: number;
  holiday: number;
  current_stock: number;
  received_quantity: number;
}

export interface MLPredictionResponse {
  success?: boolean;
  data?: {
    predicted_consumption?: number;
    predicted_demand?: number;
    recommended_quantity?: number;
    [key: string]: unknown;
  };
  prediction?: number;
  predicted_consumption?: number;
  predicted_demand?: number;
  recommended_quantity?: number;
  [key: string]: unknown;
}