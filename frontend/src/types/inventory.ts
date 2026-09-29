export interface InventoryItem {
  id: number;
  ingredient: string;
  current_stock: number;
  minimum_stock: number;
  unit: string;
}

export interface CreateInventoryItem {
  ingredient: string;
  current_stock: number;
  minimum_stock: number;
  unit: string;
}

export interface UpdateInventoryItem {
  ingredient?: string;
  current_stock?: number;
  minimum_stock?: number;
  unit?: string;
}