import { useMemo, useState } from "react";
import {
  BarChart3,
  CalendarDays,
  Download,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  CHART_COLORS,
  axisProps,
  gridProps,
  tooltipProps,
} from "../utils/chartTheme";
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import type {
  ConsumptionChartData,
  ConsumptionRecord,
} from "../types/consumption";
import { formatNumber, formatStock } from "../utils/formatters";

const Consumption = () => {
  /*
   * Consumption API is not available in the current FastAPI backend.
   * Therefore this page is prepared with a frontend data structure.
   * Later, replace demoRecords with API data without changing the UI.
   */
  const [selectedIngredient, setSelectedIngredient] =
    useState("All Ingredients");

  const demoRecords: ConsumptionRecord[] = [];

  const ingredients = useMemo(() => {
    const uniqueIngredients = Array.from(
      new Set(demoRecords.map((record) => record.ingredient))
    );

    return ["All Ingredients", ...uniqueIngredients];
  }, []);

  const filteredRecords = useMemo(() => {
    if (selectedIngredient === "All Ingredients") {
      return demoRecords;
    }

    return demoRecords.filter(
      (record) => record.ingredient === selectedIngredient
    );
  }, [selectedIngredient]);

  const chartData: ConsumptionChartData[] = filteredRecords.map(
    (record) => ({
      date: record.date,
      consumption: record.quantity,
    })
  );

  const totalConsumption = filteredRecords.reduce(
    (total, record) => total + record.quantity,
    0
  );

  const averageConsumption =
    filteredRecords.length > 0
      ? totalConsumption / filteredRecords.length
      : 0;

  const highestConsumption =
    filteredRecords.length > 0
      ? Math.max(...filteredRecords.map((record) => record.quantity))
      : 0;

  const lowestConsumption =
    filteredRecords.length > 0
      ? Math.min(...filteredRecords.map((record) => record.quantity))
      : 0;

  const handleExport = () => {
    if (filteredRecords.length === 0) {
      alert("No consumption data available to export.");
      return;
    }

    const headers = [
      "Ingredient",
      "Quantity",
      "Unit",
      "Date",
      "Meals Served",
    ];

    const rows = filteredRecords.map((record) => [
      record.ingredient,
      record.quantity,
      record.unit,
      record.date,
      record.meals_served ?? "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "consumption-report.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Consumption"
        description="Analyze daily ingredient consumption and meal usage trends."
        action={
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
          >
            <Download size={16} />
            Export CSV
          </button>
        }
      />

      {/* Filters */}
      <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="w-full sm:max-w-xs">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Ingredient
            </label>

            <select
              value={selectedIngredient}
              onChange={(event) =>
                setSelectedIngredient(event.target.value)
              }
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
            >
              {ingredients.map((ingredient) => (
                <option key={ingredient} value={ingredient}>
                  {ingredient}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-2.5 text-sm text-green-700">
            <CalendarDays size={17} />
            <span>Consumption History</span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Consumption"
          value={formatStock(totalConsumption)}
          subtitle="Selected period"
          icon={BarChart3}
          iconBgClass="bg-green-100"
          iconColorClass="text-green-700"
        />

        <StatCard
          title="Average Daily"
          value={formatStock(averageConsumption)}
          subtitle="Average consumption"
          icon={TrendingUp}
          iconBgClass="bg-emerald-100"
          iconColorClass="text-emerald-700"
        />

        <StatCard
          title="Highest Usage"
          value={formatStock(highestConsumption)}
          subtitle="Maximum recorded"
          icon={TrendingUp}
          iconBgClass="bg-orange-100"
          iconColorClass="text-orange-700"
        />

        <StatCard
          title="Lowest Usage"
          value={formatStock(lowestConsumption)}
          subtitle="Minimum recorded"
          icon={TrendingDown}
          iconBgClass="bg-blue-100"
          iconColorClass="text-blue-700"
        />
      </div>

      {/* Consumption Chart */}
      <div className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-green-900">
            Consumption Trend
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Daily ingredient consumption over time.
          </p>
        </div>

        {chartData.length > 0 ? (
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="date" {...axisProps} />
                <YAxis {...axisProps} />
                <Tooltip {...tooltipProps} />
                <Bar
                  dataKey="consumption"
                  name="Consumption"
                  fill={CHART_COLORS.primary}
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyState
            title="No consumption data yet"
            message="Consumption records will appear here once the backend provides consumption history."
          />
        )}
      </div>

      {/* Data Availability Note */}
      {demoRecords.length === 0 && (
        <div className="rounded-2xl border border-green-100 bg-green-50 p-5">
          <div className="flex items-start gap-3">
            <BarChart3
              size={21}
              className="mt-0.5 shrink-0 text-green-700"
            />

            <div>
              <h3 className="text-sm font-semibold text-green-800">
                Consumption module ready
              </h3>

              <p className="mt-1 text-sm leading-6 text-green-700">
                The current FastAPI backend does not expose a dedicated
                consumption endpoint. The UI is ready for integration when
                consumption data becomes available.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Consumption Table */}
      {filteredRecords.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-green-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-4">
            <h3 className="text-lg font-semibold text-green-900">
              Consumption Records
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead className="bg-green-50">
                <tr>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-green-800">
                    Ingredient
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-green-800">
                    Quantity
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-green-800">
                    Date
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-green-800">
                    Meals Served
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredRecords.map((record, index) => (
                  <tr
                    key={`${record.ingredient}-${record.date}-${index}`}
                    className="transition hover:bg-green-50/50"
                  >
                    <td className="px-5 py-4 text-sm font-medium text-gray-800">
                      {record.ingredient}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-700">
                      {formatNumber(record.quantity)} {record.unit}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {record.date}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {record.meals_served ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Consumption;