import { useEffect, useState } from "react";
import { Activity, RefreshCw, Wifi } from "lucide-react";

import DataTable from "../components/DataTable";
import ErrorMessage from "../components/ErrorMessage";
import Loading from "../components/Loading";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";

import { sensorsApi } from "../services/api";
import type { SensorReading } from "../types/sensor";
import { formatDateTime, formatStock } from "../utils/formatters";

const LiveSensors = () => {
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReadings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await sensorsApi.getReadings();

      setReadings(response.data.data ?? response.data);
    } catch (err) {
      console.error("Sensor API error:", err);

      setError(
        "Unable to load sensor readings. Please check the backend connection."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReadings();

    const interval = window.setInterval(() => {
      fetchReadings();
    }, 30000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  const latestReading = readings[0];

  const columns = [
    {
      key: "device_id",
      header: "Device",
      render: (reading: SensorReading) => (
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
            <Wifi size={16} className="text-green-700" />
          </div>

          <span className="font-medium text-gray-800">
            {reading.device_id}
          </span>
        </div>
      ),
    },
    {
      key: "ingredient",
      header: "Ingredient",
      render: (reading: SensorReading) => (
        <span className="font-semibold text-gray-800">
          {reading.ingredient}
        </span>
      ),
    },
    {
      key: "weight",
      header: "Weight",
      render: (reading: SensorReading) => (
        <span className="font-medium text-green-700">
          {formatStock(reading.weight)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: () => <StatusBadge status="healthy" label="Received" />,
    },
    {
      key: "created_at",
      header: "Timestamp",
      render: (reading: SensorReading) => (
        <span className="text-gray-600">
          {reading.created_at
            ? formatDateTime(reading.created_at)
            : "—"}
        </span>
      ),
    },
  ];

  if (loading && readings.length === 0) {
    return <Loading message="Connecting to sensor system..." />;
  }

  if (error && readings.length === 0) {
    return <ErrorMessage message={error} onRetry={fetchReadings} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Live Sensors"
        description="Monitor real-time ESP32 and HX711 inventory weight readings."
        action={
          <button
            type="button"
            onClick={fetchReadings}
            className="inline-flex items-center gap-2 rounded-lg border border-green-200 bg-white px-4 py-2 text-sm font-medium text-green-700 transition hover:bg-green-50"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        }
      />

      {error && (
        <div className="rounded-xl border border-yellow-100 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
          {error}
        </div>
      )}

      {/* Live Status */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Sensor Connection
              </p>

              <p className="mt-2 text-xl font-bold text-green-700">
                {readings.length > 0 ? "Active" : "Waiting"}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100">
              <Wifi size={22} className="text-green-700" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Latest Weight
              </p>

              <p className="mt-2 text-xl font-bold text-gray-800">
                {latestReading
                  ? formatStock(latestReading.weight)
                  : "—"}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100">
              <Activity size={22} className="text-emerald-700" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Latest Ingredient
              </p>

              <p className="mt-2 text-xl font-bold text-gray-800">
                {latestReading?.ingredient || "—"}
              </p>
            </div>

            <StatusBadge
              status={latestReading ? "healthy" : "low"}
              label={latestReading ? "Live" : "No Data"}
            />
          </div>
        </div>
      </div>

      {/* Sensor Table */}
      <div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-green-900">
            Sensor Readings
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Latest readings received from connected devices.
          </p>
        </div>

        <DataTable
          columns={columns}
          data={readings}
          getRowKey={(reading, index) =>
            reading.id ?? `${reading.device_id}-${reading.created_at}-${index}`
          }
          emptyMessage="No sensor readings received yet."
        />
      </div>
    </div>
  );
};

export default LiveSensors;