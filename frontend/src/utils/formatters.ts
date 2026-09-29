export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatStock = (
  value: number,
  unit: string = "kg"
): string => {
  return `${formatNumber(value)} ${unit}`;
};

export const formatDate = (date: string | Date): string => {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatDateTime = (date: string | Date): string => {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getStockStatus = (
  currentStock: number,
  minimumStock: number
): "healthy" | "low" | "critical" => {
  if (currentStock <= minimumStock * 0.5) {
    return "critical";
  }

  if (currentStock <= minimumStock) {
    return "low";
  }

  return "healthy";
};