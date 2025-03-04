"use client";
import React from "react";

interface CalculationDescriptionProps {
  calculationData: { name: string; additional_info: string } | null;
  setCalculationData: React.Dispatch<React.SetStateAction<any>>;
}

const CalculationDescription: React.FC<CalculationDescriptionProps> = ({
  calculationData,
  setCalculationData,
}) => {
  return (
    <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-2xl font-bold mb-6">Описание расчета</h2>
      {/* Название расчета */}
      <div className="mb-4">
        <label
          htmlFor="calculationName"
          className="block text-gray-500 text-sm mb-1"
        >
          Название расчета
        </label>
        <input
          id="calculationName"
          type="text"
          value={calculationData?.name || ""}
          onChange={(e) =>
            setCalculationData((prev: any) => ({
              ...prev,
              name: e.target.value,
            }))
          }
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {/* Дополнительная информация */}
      <div>
        <label
          htmlFor="additionalInfo"
          className="block text-gray-500 text-sm mb-1"
        >
          Дополнительная информация о расчете
        </label>
        <input
          id="additionalInfo"
          type="text"
          value={calculationData?.additional_info || ""}
          onChange={(e) =>
            setCalculationData((prev: any) => ({
              ...prev,
              additional_info: e.target.value,
            }))
          }
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

export default CalculationDescription;
