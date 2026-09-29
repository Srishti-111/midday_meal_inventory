import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  message?: string;
}

const EmptyState = ({
  title = "No data available",
  message = "There is nothing to display here yet.",
}: EmptyStateProps) => {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-green-200 bg-white/70 p-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-100">
        <Inbox size={26} className="text-yellow-700" />
      </div>

      <h3 className="mt-4 font-display text-base font-semibold text-green-900">
        {title}
      </h3>

      <p className="mt-1 max-w-sm text-sm text-gray-500">{message}</p>
    </div>
  );
};

export default EmptyState;
