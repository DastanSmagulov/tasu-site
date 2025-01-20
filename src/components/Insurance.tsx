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
        Укажите коэффициент/ставку на страхование груза по формуле.
      </p>
      <div className="flex flex-wrap items-center gap-4 md:gap-6">
        {/* Cargo Value Input */}
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
          <input
            type="text"
            value={cargoValue}
            onChange={(e) => setCargoValue(e.target.value)}
            placeholder="Стоимость груза"
            className="border border-gray-300 rounded px-4 py-2 text-base md:text-lg font-medium focus:outline-none w-full md:w-36"
          />
        </div>

        <span className="text-base md:text-lg font-medium text-gray-600">
          ×
        </span>

        {/* Rate Input */}
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
          <div className="flex items-center">
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="border border-gray-300 rounded px-3 py-2 text-base md:text-lg font-medium focus:outline-none w-full md:w-16"
            />
            <span className="text-base md:text-lg font-medium text-gray-600 ml-1">
              %
            </span>
          </div>
        </div>

        <span className="text-base md:text-lg font-medium text-gray-600">
          =
        </span>

        {/* Insurance Sum Display */}
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
          <div className="border border-gray-300 rounded px-4 py-2 text-base md:text-lg font-medium text-gray-700 bg-gray-100 w-full md:w-36">
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
