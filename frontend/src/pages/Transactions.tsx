import { useMemo, useState } from "react";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  ClipboardList,
  Filter,
  SlidersHorizontal,
} from "lucide-react";

import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";

import type {
  InventoryTransaction,
  TransactionType,
} from "../types/transaction";
import { formatDateTime, formatNumber } from "../utils/formatters";

const Transactions = () => {
  /*
   * The current FastAPI backend does not expose a dedicated
   * transactions endpoint. The UI is prepared for future integration.
   */
  const [transactions] = useState<InventoryTransaction[]>([]);

  const [typeFilter, setTypeFilter] = useState<
    "ALL" | TransactionType
  >("ALL");

  const [search, setSearch] = useState("");

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesType =
        typeFilter === "ALL" || transaction.type === typeFilter;

      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        transaction.ingredient.toLowerCase().includes(searchText) ||
        transaction.reference
          ?.toLowerCase()
          .includes(searchText) ||
        transaction.remarks?.toLowerCase().includes(searchText);

      return matchesType && matchesSearch;
    });
  }, [transactions, typeFilter, search]);

  const totalIn = transactions
    .filter((transaction) => transaction.type === "IN")
    .reduce((total, transaction) => total + transaction.quantity, 0);

  const totalOut = transactions
    .filter((transaction) => transaction.type === "OUT")
    .reduce((total, transaction) => total + transaction.quantity, 0);

  const totalAdjustments = transactions
    .filter((transaction) => transaction.type === "ADJUSTMENT")
    .reduce((total, transaction) => total + transaction.quantity, 0);

  const getTypeIcon = (type: TransactionType) => {
    if (type === "IN") {
      return <ArrowDownToLine size={17} />;
    }

    if (type === "OUT") {
      return <ArrowUpFromLine size={17} />;
    }

    return <SlidersHorizontal size={17} />;
  };

  const getTypeLabel = (type: TransactionType) => {
    if (type === "IN") {
      return "Stock In";
    }

    if (type === "OUT") {
      return "Stock Out";
    }

    return "Adjustment";
  };

  const getTypeStatus = (type: TransactionType) => {
    if (type === "IN") {
      return "healthy";
    }

    if (type === "OUT") {
      return "low";
    }

    return "medium";
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transactions"
        description="Track inventory movements, stock receipts, consumption and adjustments."
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Transactions"
          value={transactions.length}
          subtitle="Recorded movements"
          icon={ClipboardList}
          iconBgClass="bg-green-100"
          iconColorClass="text-green-700"
        />

        <StatCard
          title="Stock In"
          value={formatNumber(totalIn)}
          subtitle="Received quantity"
          icon={ArrowDownToLine}
          iconBgClass="bg-emerald-100"
          iconColorClass="text-emerald-700"
        />

        <StatCard
          title="Stock Out"
          value={formatNumber(totalOut)}
          subtitle="Issued quantity"
          icon={ArrowUpFromLine}
          iconBgClass="bg-orange-100"
          iconColorClass="text-orange-700"
        />

        <StatCard
          title="Adjustments"
          value={formatNumber(totalAdjustments)}
          subtitle="Manual corrections"
          icon={SlidersHorizontal}
          iconBgClass="bg-blue-100"
          iconColorClass="text-blue-700"
        />
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Filter size={18} className="text-green-700" />

          <h3 className="text-base font-semibold text-green-900">
            Transaction Filters
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Search
            </label>

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search ingredient, reference or remarks..."
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Transaction Type
            </label>

            <select
              value={typeFilter}
              onChange={(event) =>
                setTypeFilter(
                  event.target.value as "ALL" | TransactionType
                )
              }
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
            >
              <option value="ALL">All Transactions</option>
              <option value="IN">Stock In</option>
              <option value="OUT">Stock Out</option>
              <option value="ADJUSTMENT">Adjustment</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      {filteredTransactions.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border border-green-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left">
              <thead className="bg-green-50">
                <tr>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-green-800">
                    Ingredient
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-green-800">
                    Type
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-green-800">
                    Quantity
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-green-800">
                    Previous Stock
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-green-800">
                    New Stock
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-green-800">
                    Reference
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-green-800">
                    Timestamp
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="transition hover:bg-green-50/50"
                  >
                    <td className="px-5 py-4 text-sm font-semibold text-gray-800">
                      {transaction.ingredient}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                            transaction.type === "IN"
                              ? "bg-green-100 text-green-700"
                              : transaction.type === "OUT"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {getTypeIcon(transaction.type)}
                        </span>

                        <StatusBadge
                          status={getTypeStatus(transaction.type)}
                          label={getTypeLabel(transaction.type)}
                        />
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm font-medium text-gray-700">
                      {formatNumber(transaction.quantity)}{" "}
                      {transaction.unit}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {formatNumber(transaction.previous_stock)}{" "}
                      {transaction.unit}
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-gray-800">
                      {formatNumber(transaction.new_stock)}{" "}
                      {transaction.unit}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {transaction.reference || "—"}

                      {transaction.remarks && (
                        <p className="mt-1 text-xs text-gray-400">
                          {transaction.remarks}
                        </p>
                      )}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {formatDateTime(transaction.timestamp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          title="No transactions found"
          message="Inventory movement records will appear here when the transaction API is connected."
        />
      )}

      {/* Integration Note */}
      {transactions.length === 0 && (
        <div className="rounded-2xl border border-green-100 bg-green-50 p-5">
          <div className="flex items-start gap-3">
            <ClipboardList
              size={21}
              className="mt-0.5 shrink-0 text-green-700"
            />

            <div>
              <h3 className="text-sm font-semibold text-green-800">
                Transaction module ready
              </h3>

              <p className="mt-1 text-sm leading-6 text-green-700">
                The current FastAPI backend does not expose a dedicated
                transaction endpoint. The frontend structure is ready
                for stock-in, stock-out and adjustment records.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;