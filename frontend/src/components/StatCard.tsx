import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconBgClass?: string;
  iconColorClass?: string;
}

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBgClass = "bg-green-100",
  iconColorClass = "text-green-700",
}: StatCardProps) => {
  return (
    <div className="group rounded-2xl border border-green-100 bg-white p-5 shadow-card transition duration-200 hover:-translate-y-0.5 hover:shadow-lift">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-500">{title}</p>

          <h3 className="mt-2 truncate font-display text-3xl font-bold text-green-900">
            {value}
          </h3>

          {subtitle && (
            <p className="mt-1.5 text-xs text-gray-500">{subtitle}</p>
          )}
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconBgClass}`}
        >
          <Icon size={23} className={iconColorClass} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
