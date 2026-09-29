export type TransactionType = "IN" | "OUT" | "ADJUSTMENT";

export interface InventoryTransaction {
  id: number;
  ingredient: string;
  type: TransactionType;
  quantity: number;
  unit: string;
  previous_stock: number;
  new_stock: number;
  timestamp: string;
  reference?: string;
  remarks?: string;
}