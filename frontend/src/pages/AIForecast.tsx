import { useState } from "react";
import {
  Brain,
  Calculator,
  Lightbulb,
  Package,
  Sparkles,
} from "lucide-react";

import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";

import { mlApi } from "../services/api";
import type {
  MLPredictionRequest,
  MLPredictionResponse,
} from "../types/ml";
import { formatNumber, formatStock } from "../utils/formatters";

const AIForecast = () => {
  const [formData, setFormData] = useState<MLPredictionRequest>({
    ingredient: "Rice",
    students_present: 500,
    meals_served: 480,
    previous_day_consumption: 40,
    rolling_7_day_consumption: 38,
    day_of_week_num: new Date().getDay() || 7,
    month_num: new Date().getMonth() + 1,
    holiday: 0,
    current_stock: 82,
    received_quantity: 20,
  });

  const [prediction, setPrediction] =
    useState<MLPredictionResponse | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getPredictionValue = (
    result: MLPredictionResponse
  ): number | null => {
    const possibleValues = [
      result.predicted_consumption,
      result.predicted_demand,
      result.recommended_quantity,
      result.prediction,
      result.data?.predicted_consumption,
      result.data?.predicted_demand,
      result.data?.recommended_quantity,
    ];

    const value = possibleValues.find(
      (item) => typeof item === "number"
    );

    return typeof value === "number" ? value : null;
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");
      setPrediction(null);

      const response = await mlApi.predict({
        ...formData,
        students_present: Number(formData.students_present),
        meals_served: Number(formData.meals_served),
        previous_day_consumption: Number(
          formData.previous_day_consumption
        ),
        rolling_7_day_consumption: Number(
          formData.rolling_7_day_consumption
        ),
        day_of_week_num: Number(formData.day_of_week_num),
        month_num: Number(formData.month_num),
        holiday: Number(formData.holiday),
        current_stock: Number(formData.current_stock),
        received_quantity: Number(formData.received_quantity),
      });

      setPrediction(response.data);
    } catch (err) {
      console.error("ML prediction error:", err);

      setError(
        "Unable to generate AI forecast. Please check that the FastAPI backend and ML service are running."
      );
    } finally {
      setLoading(false);
    }
  };

  const predictionValue = prediction
    ? getPredictionValue(prediction)
    : null;

  const updateNumberField = (
    field: keyof MLPredictionRequest,
    value: string
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: Number(value),
    }));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Forecast"
        description="Use historical consumption and inventory data to generate an AI-based demand prediction."
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Input Form */}
        <div className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="mb-6 flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-100">
              <Brain size={22} className="text-green-700" />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-green-900">
                Forecast Inputs
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Provide the required parameters for the ML prediction
                model.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-5 md:grid-cols-2"
          >
            {/* Ingredient */}
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Ingredient
              </label>

              <input
                type="text"
                value={formData.ingredient}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    ingredient: event.target.value,
                  })
                }
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>

            {/* Students */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Students Present
              </label>

              <input
                type="number"
                min="0"
                value={formData.students_present}
                onChange={(event) =>
                  updateNumberField(
                    "students_present",
                    event.target.value
                  )
                }
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>

            {/* Meals */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Meals Served
              </label>

              <input
                type="number"
                min="0"
                value={formData.meals_served}
                onChange={(event) =>
                  updateNumberField(
                    "meals_served",
                    event.target.value
                  )
                }
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>

            {/* Previous Consumption */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Previous Day Consumption
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.previous_day_consumption}
                onChange={(event) =>
                  updateNumberField(
                    "previous_day_consumption",
                    event.target.value
                  )
                }
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>

            {/* Rolling 7 Day */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                7-Day Average Consumption
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.rolling_7_day_consumption}
                onChange={(event) =>
                  updateNumberField(
                    "rolling_7_day_consumption",
                    event.target.value
                  )
                }
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>

            {/* Day */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Day of Week
              </label>

              <select
                value={formData.day_of_week_num}
                onChange={(event) =>
                  updateNumberField(
                    "day_of_week_num",
                    event.target.value
                  )
                }
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              >
                <option value="1">Monday</option>
                <option value="2">Tuesday</option>
                <option value="3">Wednesday</option>
                <option value="4">Thursday</option>
                <option value="5">Friday</option>
                <option value="6">Saturday</option>
                <option value="7">Sunday</option>
              </select>
            </div>

            {/* Month */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Month
              </label>

              <select
                value={formData.month_num}
                onChange={(event) =>
                  updateNumberField(
                    "month_num",
                    event.target.value
                  )
                }
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              >
                {Array.from({ length: 12 }, (_, index) => (
                  <option key={index + 1} value={index + 1}>
                    {new Date(2000, index).toLocaleString("en-IN", {
                      month: "long",
                    })}
                  </option>
                ))}
              </select>
            </div>

            {/* Holiday */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Holiday
              </label>

              <select
                value={formData.holiday}
                onChange={(event) =>
                  updateNumberField(
                    "holiday",
                    event.target.value
                  )
                }
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              >
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
            </div>

            {/* Current Stock */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Current Stock
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.current_stock}
                onChange={(event) =>
                  updateNumberField(
                    "current_stock",
                    event.target.value
                  )
                }
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>

            {/* Received */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Received Quantity
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.received_quantity}
                onChange={(event) =>
                  updateNumberField(
                    "received_quantity",
                    event.target.value
                  )
                }
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>

            {/* Submit */}
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Sparkles size={18} className="animate-pulse" />
                    Generating Forecast...
                  </>
                ) : (
                  <>
                    <Calculator size={18} />
                    Generate AI Forecast
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Result Panel */}
        <div className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100">
              <Sparkles size={22} className="text-green-700" />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-green-900">
                AI Result
              </h3>

              <p className="text-sm text-gray-500">
                Model prediction
              </p>
            </div>
          </div>

          {error && (
            <div className="mt-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {!prediction && !error && (
            <div className="mt-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                <Brain size={30} className="text-green-600" />
              </div>

              <h4 className="mt-4 font-semibold text-gray-800">
                Ready for prediction
              </h4>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Enter the required inputs and generate an AI forecast
                using the connected ML service.
              </p>
            </div>
          )}

          {prediction && (
            <div className="mt-6 space-y-5">
              <div className="rounded-2xl bg-green-50 p-5 text-center">
                <p className="text-sm font-medium text-green-700">
                  Predicted Demand / Consumption
                </p>

                <p className="mt-2 text-4xl font-bold text-green-800">
                  {predictionValue !== null
                    ? formatStock(predictionValue)
                    : "—"}
                </p>

                <div className="mt-3">
                  <StatusBadge
                    status="healthy"
                    label="Prediction Generated"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-gray-100 p-4">
                <div className="flex items-start gap-3">
                  <Lightbulb
                    size={20}
                    className="mt-0.5 text-yellow-500"
                  />

                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      Forecast Insight
                    </p>

                    <p className="mt-1 text-sm leading-6 text-gray-500">
                      The prediction is based on the values submitted
                      for student presence, meals served, historical
                      consumption, calendar information and current
                      inventory.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-green-100 bg-white p-4">
                <div className="flex items-center gap-2">
                  <Package size={18} className="text-green-700" />

                  <span className="text-sm font-semibold text-gray-800">
                    Current Inventory
                  </span>
                </div>

                <p className="mt-2 text-xl font-bold text-gray-800">
                  {formatNumber(formData.current_stock)} kg
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {formData.ingredient}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIForecast;