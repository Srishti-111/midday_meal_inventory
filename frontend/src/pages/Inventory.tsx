import { useEffect, useState } from "react";
import { Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";

import DataTable from "../components/DataTable";
import ErrorMessage from "../components/ErrorMessage";
import Loading from "../components/Loading";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";

import { inventoryApi } from "../services/api";
import type {
  CreateInventoryItem,
  InventoryItem,
  UpdateInventoryItem,
} from "../types/inventory";
import {
  formatNumber,
  formatStock,
  getStockStatus,
} from "../utils/formatters";

const Inventory = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const [formData, setFormData] = useState<CreateInventoryItem>({
    ingredient: "",
    current_stock: 0,
    minimum_stock: 0,
    unit: "kg",
  });

  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await inventoryApi.getAll();

      setItems(response.data.data ?? response.data);
    } catch (err) {
      console.error("Inventory API error:", err);
      setError(
        "Unable to load inventory. Please check that the backend server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const resetForm = () => {
    setFormData({
      ingredient: "",
      current_stock: 0,
      minimum_stock: 0,
      unit: "kg",
    });

    setEditingItem(null);
    setShowForm(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      if (editingItem) {
        const updateData: UpdateInventoryItem = {
          ingredient: formData.ingredient,
          current_stock: Number(formData.current_stock),
          minimum_stock: Number(formData.minimum_stock),
          unit: formData.unit,
        };

        await inventoryApi.update(editingItem.id, updateData);
      } else {
        await inventoryApi.create({
          ingredient: formData.ingredient,
          current_stock: Number(formData.current_stock),
          minimum_stock: Number(formData.minimum_stock),
          unit: formData.unit,
        });
      }

      resetForm();
      await fetchInventory();
    } catch (err) {
      console.error("Inventory save error:", err);
      alert("Unable to save inventory item.");
    }
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);

    setFormData({
      ingredient: item.ingredient,
      current_stock: item.current_stock,
      minimum_stock: item.minimum_stock,
      unit: item.unit,
    });

    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this inventory item?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await inventoryApi.remove(id);
      await fetchInventory();
    } catch (err) {
      console.error("Inventory delete error:", err);
      alert("Unable to delete inventory item.");
    }
  };

  const columns = [
    {
      key: "ingredient",
      header: "Ingredient",
      render: (item: InventoryItem) => (
        <span className="font-semibold text-gray-800">
          {item.ingredient}
        </span>
      ),
    },
    {
      key: "current_stock",
      header: "Current Stock",
      render: (item: InventoryItem) => (
        <span className="font-medium text-gray-700">
          {formatStock(item.current_stock, item.unit)}
        </span>
      ),
    },
    {
      key: "minimum_stock",
      header: "Minimum Stock",
      render: (item: InventoryItem) => (
        <span className="text-gray-600">
          {formatStock(item.minimum_stock, item.unit)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: InventoryItem) => (
        <StatusBadge
          status={getStockStatus(
            item.current_stock,
            item.minimum_stock
          )}
        />
      ),
    },
    {
      key: "stock_percentage",
      header: "Stock Level",
      render: (item: InventoryItem) => {
        const percentage =
          item.minimum_stock > 0
            ? Math.min(
                (item.current_stock / item.minimum_stock) * 100,
                100
              )
            : 100;

        return (
          <div className="min-w-[130px]">
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-gray-500">Level</span>
              <span className="font-medium text-gray-700">
                {formatNumber(percentage)}%
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-green-500 transition-all"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      key: "actions",
      header: "Actions",
      render: (item: InventoryItem) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleEdit(item)}
            className="rounded-lg p-2 text-green-700 transition hover:bg-green-100"
            aria-label={`Edit ${item.ingredient}`}
          >
            <Pencil size={17} />
          </button>

          <button
            type="button"
            onClick={() => handleDelete(item.id)}
            className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
            aria-label={`Delete ${item.ingredient}`}
          >
            <Trash2 size={17} />
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <Loading message="Loading inventory..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchInventory} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory"
        description="Manage ingredients, stock levels and minimum stock thresholds."
        action={
          <>
            <button
              type="button"
              onClick={fetchInventory}
              className="inline-flex items-center gap-2 rounded-lg border border-green-200 bg-white px-4 py-2 text-sm font-medium text-green-700 transition hover:bg-green-50"
            >
              <RefreshCw size={16} />
              Refresh
            </button>

            <button
              type="button"
              onClick={() => {
                if (showForm) {
                  resetForm();
                } else {
                  setEditingItem(null);
                  setFormData({
                    ingredient: "",
                    current_stock: 0,
                    minimum_stock: 0,
                    unit: "kg",
                  });
                  setShowForm(true);
                }
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
            >
              <Plus size={17} />
              Add Item
            </button>
          </>
        }
      />

      {showForm && (
        <div className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-green-900">
              {editingItem
                ? "Edit Inventory Item"
                : "Add Inventory Item"}
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Enter the ingredient and stock information below.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
          >
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Ingredient
              </label>

              <input
                type="text"
                value={formData.ingredient}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    ingredient: event.target.value,
                  })
                }
                placeholder="e.g. Rice"
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Current Stock
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.current_stock}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    current_stock: Number(event.target.value),
                  })
                }
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Minimum Stock
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.minimum_stock}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    minimum_stock: Number(event.target.value),
                  })
                }
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Unit
              </label>

              <select
                value={formData.unit}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    unit: event.target.value,
                  })
                }
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              >
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="litre">litre</option>
                <option value="unit">unit</option>
              </select>
            </div>

            <div className="flex items-end gap-2 md:col-span-2 lg:col-span-4">
              <button
                type="submit"
                className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-green-700"
              >
                {editingItem ? "Update Item" : "Save Item"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <DataTable
        columns={columns}
        data={items}
        getRowKey={(item) => item.id}
        emptyMessage="No inventory items found. Add your first ingredient."
      />
    </div>
  );
};

export default Inventory;