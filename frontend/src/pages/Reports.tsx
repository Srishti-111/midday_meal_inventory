import { useMemo, useState } from "react";
import {
  BarChart3,
  CalendarDays,
  Download,
  FileText,
  Package,
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

interface ReportData {
  label: string;
  stockIn: number;
  stockOut: number;
}

const Reports = () => {
  const [reportType, setReportType] = useState("inventory");
  const [dateRange, setDateRange] = useState("7");

  /*
   * The current FastAPI backend does not expose a dedicated reports
   * endpoint. Keep report data empty until real backend data is available.
   */
  const [reportData] = useState<ReportData[]>([]);

  const totalStockIn = useMemo(
    () =>
      reportData.reduce(
        (total, item) => total + item.stockIn,
        0
      ),
    [reportData]
  );

  const totalStockOut = useMemo(
    () =>
      reportData.reduce(
        (total, item) => total + item.stockOut,
        0
      ),
    [reportData]
  );

  const netMovement = totalStockIn - totalStockOut;

  const handleExport = () => {
    if (reportData.length === 0) {
      alert("No report data is available to export yet.");
      return;
    }

    const header = "Date,Stock In,Stock Out\n";

    const rows = reportData
      .map(
        (item) =>
          `${item.label},${item.stockIn},${item.stockOut}`
      )
      .join("\n");

    const csv = header + rows;

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `inventory-report-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Analyze inventory movement and generate operational reports."
        action={
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-green-700"
          >
            <Download size={17} />
            Export CSV
          </button>
        }
      />

      {/* Report Controls */}
      <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Report Type
            </label>

            <select
              value={reportType}
              onChange={(event) =>
                setReportType(event.target.value)
              }
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
            >
              <option value="inventory">
                Inventory Movement
              </option>
              <option value="consumption">
                Consumption Report
              </option>
              <option value="reorder">
                Reorder Report
              </option>
              <option value="sensor">
                Sensor Report
              </option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Date Range
            </label>

            <select
              value={dateRange}
              onChange={(event) =>
                setDateRange(event.target.value)
              }
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
              <option value="365">Last 1 Year</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Report Period
            </label>

            <div className="flex h-[42px] items-center gap-2 rounded-lg border border-gray-200 px-3 text-sm text-gray-600">
              <CalendarDays size={17} className="text-green-600" />
              Last {dateRange} days
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Stock Received"
          value={totalStockIn}
          subtitle="Total stock in"
          icon={TrendingUp}
          iconBgClass="bg-green-100"
          iconColorClass="text-green-700"
        />

        <StatCard
          title="Stock Issued"
          value={totalStockOut}
          subtitle="Total stock out"
          icon={TrendingDown}
          iconBgClass="bg-orange-100"
          iconColorClass="text-orange-700"
        />

        <StatCard
          title="Net Movement"
          value={netMovement}
          subtitle="In minus out"
          icon={BarChart3}
          iconBgClass="bg-blue-100"
          iconColorClass="text-blue-700"
        />

        <StatCard
          title="Report Records"
          value={reportData.length}
          subtitle="Available records"
          icon={FileText}
          iconBgClass="bg-purple-100"
          iconColorClass="text-purple-700"
        />
      </div>

      {/* Chart */}
      {reportData.length > 0 ? (
        <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h3 className="text-base font-semibold text-green-900">
              Inventory Movement
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Stock received versus stock issued.
            </p>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reportData}>
                <CartesianGrid {...gridProps} />

                <XAxis dataKey="label" {...axisProps} />

                <YAxis {...axisProps} />

                <Tooltip {...tooltipProps} />

                <Bar
                  dataKey="stockIn"
                  name="Stock In"
                  fill={CHART_COLORS.primary}
                  radius={[4, 4, 0, 0]}
                />

                <Bar
                  dataKey="stockOut"
                  name="Stock Out"
                  fill={CHART_COLORS.accent}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <EmptyState
          title="No report data available"
          message="Report charts and detailed analytics will appear here once the backend provides report or transaction data."
        />
      )}

      {/* Report Information */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100">
              <Package size={20} className="text-green-700" />
            </div>

            <div>
              <h3 className="text-base font-semibold text-green-900">
                Inventory Reports
              </h3>

              <p className="mt-1 text-sm leading-6 text-gray-500">
                Track stock received, stock issued, inventory
                movement and replenishment activity over a selected
                period.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100">
              <FileText size={20} className="text-blue-700" />
            </div>

            <div>
              <h3 className="text-base font-semibold text-green-900">
                Available Report Types
              </h3>

              <p className="mt-1 text-sm leading-6 text-gray-500">
                Inventory, consumption, reorder and sensor reports
                are structured in the frontend and can be connected
                to their respective backend data sources.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Note */}
      {reportData.length === 0 && (
        <div className="rounded-2xl border border-green-100 bg-green-50 p-5">
          <div className="flex items-start gap-3">
            <BarChart3
              size={21}
              className="mt-0.5 shrink-0 text-green-700"
            />

            <div>
              <h3 className="text-sm font-semibold text-green-800">
                Reports module ready
              </h3>

              <p className="mt-1 text-sm leading-6 text-green-700">
                The current FastAPI backend does not expose a
                dedicated reports endpoint. This page is ready for
                future report APIs and can export the received data
                as CSV.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;