import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://172.18.32.94:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export const inventoryApi = {
  getAll: () => api.get("/api/inventory"),

  create: (data: {
    ingredient: string;
    current_stock: number;
    minimum_stock: number;
    unit: string;
  }) => api.post("/api/inventory", data),

  update: (
    id: number,
    data: {
      ingredient?: string;
      current_stock?: number;
      minimum_stock?: number;
      unit?: string;
    }
  ) => api.put(`/api/inventory/${id}`, data),

  remove: (id: number) => api.delete(`/api/inventory/${id}`),

  getLowStock: () => api.get("/api/inventory/low-stock"),
};

export const dashboardApi = {
  getSummary: () => api.get("/api/dashboard/summary"),
};

export const sensorsApi = {
  getReadings: () => api.get("/api/sensors/readings"),

  createReading: (data: {
    device_id: string;
    ingredient: string;
    weight: number;
  }) => api.post("/api/sensors/readings", data),
};

export const mlApi = {
  predict: (data: {
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
  }) => api.post("/api/ml/predict", data),
};

export default api;