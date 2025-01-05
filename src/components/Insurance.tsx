"use client";

import React, { useState } from "react";

const Insurance: React.FC = () => {
  const [cargoValue, setCargoValue] = useState<number | string>(""); // Cargo value input
  const [rate, setRate] = useState<number>(12); // Default rate is 12%

  const calculateInsurance = () => {
    if (!cargoValue || isNaN(Number(cargoValue))) return 0;
    return (Number(cargoValue) * rate) / 100;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow text-gray-800">
      <h2 className="text-lg font-bold mb-2">Страховка</h2>
      <p className="text-sm text-gray-600 mb-4">
        Укажите коэффициент/ставку на страхование груза по формуле
      </p>
      <div className="flex items-center gap-4">
        {/* Cargo Value Input */}
        <div className="flex items-center">
          <input
            type="text"
            value={cargoValue}
            onChange={(e) => setCargoValue(e.target.value)}
            placeholder="Стоимость груза"
            className="border border-gray-300 rounded px-4 py-2 w-36 text-lg font-medium focus:outline-none"
          />
        </div>

        <span className="text-lg font-medium text-gray-600">×</span>

        {/* Rate Input */}
        <div className="flex items-center">
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="border border-gray-300 rounded px-3 py-2 w-16 text-lg font-medium focus:outline-none"
          />
          <span className="text-lg font-medium text-gray-600 ml-1">%</span>
        </div>

        <span className="text-lg font-medium text-gray-600">=</span>

        {/* Insurance Sum Display */}
        <div className="flex items-center">
          <div className="border border-gray-300 rounded px-4 py-2 text-lg font-medium text-gray-700 bg-gray-100 w-36">
            {cargoValue && !isNaN(Number(cargoValue))
              ? calculateInsurance().toFixed(2)
              : "0.00"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insurance;
