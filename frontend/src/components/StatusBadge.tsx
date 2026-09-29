interface StatusBadgeProps {
  status: string;
  label?: string;
}

const StatusBadge = ({ status, label }: StatusBadgeProps) => {
  const normalizedStatus = status.toLowerCase();

  const statusClasses: Record<string, string> = {
    healthy: "bg-green-100 text-green-800 ring-green-200",
    low: "bg-yellow-100 text-yellow-800 ring-yellow-200",
    critical: "bg-red-100 text-red-700 ring-red-200",
    open: "bg-red-100 text-red-700 ring-red-200",
    investigating: "bg-yellow-100 text-yellow-800 ring-yellow-200",
    resolved: "bg-green-100 text-green-800 ring-green-200",
    high: "bg-orange-100 text-orange-800 ring-orange-200",
    medium: "bg-yellow-100 text-yellow-800 ring-yellow-200",
    urgent: "bg-red-100 text-red-700 ring-red-200",
  };

  const className =
    statusClasses[normalizedStatus] || "bg-gray-100 text-gray-700 ring-gray-200";

  const displayLabel =
    label ||
    status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${className}`}
    >
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
      {displayLabel}
    </span>
  );
};

export default StatusBadge;
