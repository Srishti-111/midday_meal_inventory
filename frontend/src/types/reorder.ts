export type ReorderPriority = "low" | "medium" | "high" | "urgent";

export interface ReorderItem {
  id: number;
  ingredient: string;
  current_stock: number;
  minimum_stock: number;
  unit: string;
  suggested_quantity: number;
  priority: ReorderPriority;
  estimated_days_remaining?: number;
  reason?: string;
}