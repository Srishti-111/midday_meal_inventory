import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorMessage = ({
  message = "Something went wrong. Please try again.",
  onRetry,
}: ErrorMessageProps) => {
  return (
    <div className="flex min-h-[260px] items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-7 text-center shadow-card">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
          <AlertCircle size={26} className="text-red-600" />
        </div>

        <h3 className="mt-4 font-display text-lg font-semibold text-gray-800">
          Unable to load data
        </h3>

        <p className="mt-2 text-sm leading-6 text-gray-600">{message}</p>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
