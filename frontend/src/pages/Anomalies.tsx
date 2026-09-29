import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Search,
  ShieldAlert,
} from "lucide-react";

import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";

import type {
  Anomaly,
  AnomalySeverity,
  AnomalyStatus,
} from "../types/anomaly";
import { formatDateTime, formatNumber } from "../utils/formatters";

const Anomalies = () => {
  /*
   * The current backend does not expose a dedicated anomaly endpoint.
   * Keep this page ready for future API integration.
   */
  const [anomalies] = useState<Anomaly[]>([]);

  const [statusFilter, setStatusFilter] = useState<
    "all" | AnomalyStatus
  >("all");

  const [severityFilter, setSeverityFilter] = useState<
    "all" | AnomalySeverity
  >("all");

  const [search, setSearch] = useState("");

  const filteredAnomalies = useMemo(() => {
    return anomalies.filter((anomaly) => {
      const matchesStatus =
        statusFilter === "all" || anomaly.status === statusFilter;

      const matchesSeverity =
        severityFilter === "all" ||
        anomaly.severity === severityFilter;

      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        anomaly.ingredient.toLowerCase().includes(searchText) ||
        anomaly.type.toLowerCase().includes(searchText) ||
        anomaly.description.toLowerCase().includes(searchText);

      return matchesStatus && matchesSeverity && matchesSearch;
    });
  }, [anomalies, statusFilter, severityFilter, search]);

  const openCount = anomalies.filter(
    (item) => item.status === "open"
  ).length;

  const investigatingCount = anomalies.filter(
    (item) => item.status === "investigating"
  ).length;

  const criticalCount = anomalies.filter(
    (item) =>
      item.severity === "critical" || item.severity === "high"
  ).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Anomalies"
        description="Detect and monitor unusual inventory, consumption and sensor behavior."
      />

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Anomalies"
          value={anomalies.length}
          subtitle="Detected events"
          icon={AlertTriangle}
          iconBgClass="bg-yellow-100"
          iconColorClass="text-yellow-700"
        />

        <StatCard
          title="Open"
          value={openCount}
          subtitle="Require attention"
          icon={ShieldAlert}
          iconBgClass="bg-red-100"
          iconColorClass="text-red-700"
        />

        <StatCard
          title="Investigating"
          value={investigatingCount}
          subtitle="Currently under review"
          icon={Clock3}
          iconBgClass="bg-orange-100"
          iconColorClass="text-orange-700"
        />

        <StatCard
          title="High Priority"
          value={criticalCount}
          subtitle="High or critical severity"
          icon={CheckCircle2}
          iconBgClass="bg-green-100"
          iconColorClass="text-green-700"
        />
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Search
            </label>

            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search anomalies..."
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Status
            </label>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as "all" | AnomalyStatus
                )
              }
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="investigating">Investigating</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Severity
            </label>

            <select
              value={severityFilter}
              onChange={(event) =>
                setSeverityFilter(
                  event.target.value as "all" | AnomalySeverity
                )
              }
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
            >
              <option value="all">All Severities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Anomaly List */}
      {filteredAnomalies.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border border-green-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left">
              <thead className="bg-green-50">
                <tr>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-green-800">
                    Ingredient
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-green-800">
                    Type
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-green-800">
                    Details
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-green-800">
                    Severity
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-green-800">
                    Status
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-green-800">
                    Detected
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredAnomalies.map((anomaly) => (
                  <tr
                    key={anomaly.id}
                    className="transition hover:bg-green-50/50"
                  >
                    <td className="px-5 py-4 text-sm font-semibold text-gray-800">
                      {anomaly.ingredient}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-700">
                      {anomaly.type}
                    </td>

                    <td className="max-w-sm px-5 py-4 text-sm text-gray-600">
                      <p>{anomaly.description}</p>

                      {anomaly.current_value !== undefined &&
                        anomaly.expected_value !== undefined && (
                          <p className="mt-1 text-xs text-gray-400">
                            Current:{" "}
                            {formatNumber(anomaly.current_value)}{" "}
                            {anomaly.unit ?? ""} · Expected:{" "}
                            {formatNumber(anomaly.expected_value)}{" "}
                            {anomaly.unit ?? ""}
                          </p>
                        )}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={anomaly.severity} />
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={anomaly.status} />
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {formatDateTime(anomaly.detected_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          title="No anomalies detected"
          message="Anomaly records will appear here when the anomaly detection module starts providing data."
        />
      )}

      {/* Integration Note */}
      {anomalies.length === 0 && (
        <div className="rounded-2xl border border-green-100 bg-green-50 p-5">
          <div className="flex items-start gap-3">
            <ShieldAlert
              size={21}
              className="mt-0.5 shrink-0 text-green-700"
            />

            <div>
              <h3 className="text-sm font-semibold text-green-800">
                Anomaly module ready
              </h3>

              <p className="mt-1 text-sm leading-6 text-green-700">
                The current FastAPI backend does not expose a dedicated
                anomaly endpoint. This page is structured so the future
                anomaly API can be connected without changing the main UI.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Anomalies;