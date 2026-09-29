import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

const PageHeader = ({ title, description, action }: PageHeaderProps) => {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex items-stretch gap-3">
        <span className="w-1 shrink-0 rounded-full bg-yellow-400" aria-hidden="true" />

        <div>
          <h2 className="font-display text-2xl font-bold text-green-900 sm:text-3xl">
            {title}
          </h2>

          {description && (
            <p className="mt-1 max-w-xl text-sm text-gray-500">{description}</p>
          )}
        </div>
      </div>

      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  );
};

export default PageHeader;
