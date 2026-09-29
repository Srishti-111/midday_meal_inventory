import { useMemo, useState } from "react";
import {
  CheckCircle2,
  PackageCheck,
  ShoppingCart,
  Truck,
} from "lucide-react";

import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";

import type { ReorderItem, ReorderPriority } from "../types/reorder";
import { formatNumber, formatStock } from "../utils/formatters";

const Reorder = () => {
  /*
   * The current backend does not expose a dedicated reorder endpoint.
   * This structure is ready for future reorder/AI recommendation data.
   */
  const [reorderItems] = useState<ReorderItem[]>([]);

  const [priorityFilter, setPriorityFilter] = useState<
    "all" | ReorderPriority
  >("all");

  const filteredItems = useMemo(() => {
    if (priorityFilter === "all") {
      return reorderItems;
    }

    return reorderItems.filter(
      (item) => item.priority === priorityFilter
    );
  }, [reorderItems, priorityFilter]);

  const urgentCount = reorderItems.filter(
    (item) => item.priority === "urgent"
  ).length;

  const highCount = reorderItems.filter(
    (item) => item.priority === "high"
  ).length;

  const totalSuggestedQuantity = reorderItems.reduce(
    (total, item) => total + item.suggested_quantity,
    0
  );

  const handleCreateOrder = (item: ReorderItem) => {
    alert(
      `Reorder request prepared for ${item.ingredient}: ${formatNumber(
        item.suggested_quantity
      )} ${item.unit}`
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reorder Management"
        description="Review low-stock items and suggested replenishment quantities."
      />

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Items to Reorder"
          value={reorderItems.length}
          subtitle="Suggested replenishments"
          icon={ShoppingCart}
          iconBgClass="bg-green-100"
          iconColorClass="text-green-700"
        />

        <StatCard
          title="Urgent"
          value={urgentCount}
          subtitle="Immediate attention"
          icon={Truck}
          iconBgClass="bg-red-100"
          iconColorClass="text-red-700"
        />

        <StatCard
          title="High Priority"
          value={highCount}
          subtitle="Needs quick action"
          icon={PackageCheck}
          iconBgClass="bg-orange-100"
          iconColorClass="text-orange-700"
        />

        <StatCard
          title="Suggested Quantity"
          value={formatNumber(totalSuggestedQuantity)}
          subtitle="Total replenishment"
          icon={CheckCircle2}
          iconBgClass="bg-emerald-100"
          iconColorClass="text-emerald-700"
        />
      </div>

      {/* Filter */}
      <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-base font-semibold text-green-900">
              Reorder Recommendations
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Filter recommended purchases by priority.
            </p>
          </div>

          <div className="w-full sm:w-52">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Priority
            </label>

            <select
              value={priorityFilter}
              onChange={(event) =>
                setPriorityFilter(
                  event.target.value as "all" | ReorderPriority
                )
              }
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reorder Table */}
      {filteredItems.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border border-green-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left">
              <thead className="bg-green-50">
                <tr>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-green-800">
                    Ingredient
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-green-800">
                    Current Stock
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-green-800">
                    Minimum Stock
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-green-800">
                    Suggested Qty
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-green-800">
                    Priority
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-green-800">
                    Days Remaining
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-green-800">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className="transition hover:bg-green-50/50"
                  >
                    <td className="px-5 py-4 text-sm font-semibold text-gray-800">
                      {item.ingredient}

                      {item.reason && (
                        <p className="mt-1 max-w-xs text-xs font-normal text-gray-400">
                          {item.reason}
                        </p>
                      )}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-700">
                      {formatStock(item.current_stock, item.unit)}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {formatStock(item.minimum_stock, item.unit)}
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-green-700">
                      {formatStock(
                        item.suggested_quantity,
                        item.unit
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={item.priority} />
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {item.estimated_days_remaining !== undefined
                        ? `${formatNumber(
                            item.estimated_days_remaining
                          )} days`
                        : "—"}
                    </td>

                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => handleCreateOrder(item)}
                        className="rounded-lg bg-green-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-green-700"
                      >
                        Create Order
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          title="No reorder recommendations"
          message="Items requiring replenishment will appear here when inventory or AI reorder data becomes available."
        />
      )}

      {/* Integration Note */}
      {reorderItems.length === 0 && (
        <div className="rounded-2xl border border-green-100 bg-green-50 p-5">
          <div className="flex items-start gap-3">
            <PackageCheck
              size={21}
              className="mt-0.5 shrink-0 text-green-700"
            />

            <div>
              <h3 className="text-sm font-semibold text-green-800">
                Reorder module ready
              </h3>

              <p className="mt-1 text-sm leading-6 text-green-700">
                The current FastAPI backend does not expose a dedicated
                reorder endpoint. This frontend module is ready for
                inventory-based and AI-based reorder recommendations.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reorder;