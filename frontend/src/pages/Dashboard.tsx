import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Boxes,
  Package,
  RefreshCw,
} from "lucide-react";

import StatCard from "../components/StatCard";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";

import { dashboardApi } from "../services/api";
import type { DashboardSummary } from "../types/dashboard";
import { formatDateTime, formatStock } from "../utils/formatters";

const Dashboard = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await dashboardApi.getSummary();

      setSummary(response.data.data);
    } catch (err) {
      console.error("Dashboard API error:", err);
      setError(
        "Unable to connect to the backend. Please check that the FastAPI server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return <Loading message="Loading dashboard..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchDashboard} />;
  }

  if (!summary) {
    return (
      <ErrorMessage
        message="Dashboard data is not available."
        onRetry={fetchDashboard}
      />
    );
  }

  const latestReading = summary.latest_sensor_reading;

  const sensorStatus = latestReading ? "healthy" : "low";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Monitor your mid-day meal inventory and smart sensor system."
        action={
          <button
            type="button"
            onClick={fetchDashboard}
            className="inline-flex items-center gap-2 rounded-lg border border-green-200 bg-white px-4 py-2 text-sm font-medium text-green-700 transition hover:bg-green-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Inventory Items"
          value={summary.total_inventory_items}
          subtitle="Items currently tracked"
          icon={Boxes}
          iconBgClass="bg-green-100"
          iconColorClass="text-green-700"
        />

        <StatCard
          title="Low Stock Items"
          value={summary.low_stock_items}
          subtitle="Need attention"
          icon={AlertTriangle}
          iconBgClass="bg-yellow-100"
          iconColorClass="text-yellow-700"
        />

        <StatCard
          title="Total Stock"
          value={formatStock(summary.total_stock)}
          subtitle="Across tracked inventory"
          icon={Package}
          iconBgClass="bg-emerald-100"
          iconColorClass="text-emerald-700"
        />

        <StatCard
          title="Sensor Status"
          value={latestReading ? "Online" : "No Data"}
          subtitle={
            latestReading
              ? `Device: ${latestReading.device_id}`
              : "Waiting for sensor data"
          }
          icon={Activity}
          iconBgClass="bg-green-100"
          iconColorClass="text-green-700"
        />
      </div>

      {/* Latest Sensor Reading */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-green-900">
                Latest Sensor Reading
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Most recent ESP32/HX711 inventory measurement
              </p>
            </div>

            <StatusBadge status={sensorStatus} />
          </div>

          {latestReading ? (
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-green-50 p-4">
                <p className="text-xs font-medium text-gray-500">
                  Ingredient
                </p>

                <p className="mt-2 text-lg font-semibold text-green-900">
                  {latestReading.ingredient}
                </p>
              </div>

              <div className="rounded-xl bg-green-50 p-4">
                <p className="text-xs font-medium text-gray-500">
                  Current Weight
                </p>

                <p className="mt-2 text-lg font-semibold text-green-700">
                  {formatStock(latestReading.weight)}
                </p>
              </div>

              <div className="rounded-xl bg-green-50 p-4">
                <p className="text-xs font-medium text-gray-500">
                  Device
                </p>

                <p className="mt-2 text-lg font-semibold text-green-900">
                  {latestReading.device_id}
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-xl bg-gray-50 p-6 text-center">
              <p className="text-sm text-gray-500">
                No sensor reading is available yet.
              </p>
            </div>
          )}
        </div>

        {/* System Overview */}
        <div className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-green-900">
            System Overview
          </h3>

          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Inventory Monitoring
              </span>

              <StatusBadge status="healthy" label="Active" />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Sensor Connection
              </span>

              <StatusBadge
                status={latestReading ? "healthy" : "low"}
                label={latestReading ? "Connected" : "Waiting"}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Low Stock Alerts
              </span>

              <StatusBadge
                status={summary.low_stock_items > 0 ? "low" : "healthy"}
                label={
                  summary.low_stock_items > 0
                    ? `${summary.low_stock_items} Alert${
                        summary.low_stock_items > 1 ? "s" : ""
                      }`
                    : "All Clear"
                }
              />
            </div>
          </div>

          {latestReading?.created_at && (
            <div className="mt-6 border-t border-gray-100 pt-4">
              <p className="text-xs text-gray-400">Last sensor update</p>

              <p className="mt-1 text-sm font-medium text-gray-700">
                {formatDateTime(latestReading.created_at)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;