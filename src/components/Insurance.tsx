"use client";
import React from "react";

interface InsuranceProps {
  cargoValue: string;
  onChange: (value: string) => void;
}

const Insurance: React.FC<InsuranceProps> = ({ cargoValue, onChange }) => {
  const rate = 12; // Default rate of 12%

  const calculateInsurance = () => {
    const value = parseFloat(cargoValue);
    if (isNaN(value)) return "0.00";
    return ((value * rate) / 100).toFixed(2);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow text-gray-800 mb-6">
      <h2 className="text-lg font-bold mb-2">Страховка</h2>
      <p className="text-sm text-gray-600 mb-4">
        Укажите стоимость груза для расчета страховой суммы.
      </p>
      <div className="flex items-center gap-4">
        <input
          type="text"
          value={cargoValue}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Стоимость груза"
          className="border border-gray-300 rounded px-4 py-2 focus:outline-none w-full md:w-36"
        />
        <span className="text-base font-medium text-gray-600">× {rate}% =</span>
        <div className="border border-gray-300 rounded px-4 py-2 text-base font-medium text-gray-700 bg-gray-100 w-full md:w-36">
          {calculateInsurance()}
        </div>
      </div>
    </div>
  );
};

export default Insurance;
