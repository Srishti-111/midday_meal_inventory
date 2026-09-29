export interface SensorReading {
  id?: number;
  device_id: string;
  ingredient: string;
  weight: number;
  created_at?: string;
}

export interface CreateSensorReading {
  device_id: string;
  ingredient: string;
  weight: number;
}