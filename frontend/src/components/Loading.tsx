import { LoaderCircle } from "lucide-react";

interface LoadingProps {
  message?: string;
}

const Loading = ({ message = "Loading..." }: LoadingProps) => {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center gap-3">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-card ring-1 ring-green-100">
        <LoaderCircle size={28} className="animate-spin text-green-600" />
      </div>

      <p className="text-sm font-medium text-gray-500">{message}</p>
    </div>
  );
};

export default Loading;
