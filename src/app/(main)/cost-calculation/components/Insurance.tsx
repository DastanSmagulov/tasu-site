"use client";
import React, { useState } from "react";

const Insurance: React.FC = () => {
  const [cargoValue, setCargoValue] = useState(500000);
  const [currency, setCurrency] = useState("kzt");

  const calculateInsurance = () => {
    return cargoValue * 0.01;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6 text-gray-800">
      <h2 className="text-xl font-semibold mb-4">Страховка</h2>
      <div className="flex items-center justify-between gap-6">
        {/* Cargo Value Input */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1 text-gray-600">
            стоимость груза
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={cargoValue}
              onChange={(e) => setCargoValue(Number(e.target.value))}
              className="border border-gray-300 rounded px-4 py-2 w-36 text-lg font-medium focus:outline-none"
            />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-lg font-medium focus:outline-none"
            >
              <option value="kzt">kzt</option>
              <option value="usd">usd</option>
              <option value="eur">eur</option>
            </select>
          </div>
        </div>

        {/* Insurance Sum Display */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1 text-gray-600">
            сумма страховки
          </label>
          <div className="border border-gray-300 rounded px-4 py-2 w-60 text-lg font-medium text-gray-500 bg-gray-100">
            {cargoValue > 0
              ? `${calculateInsurance().toFixed(2)} ${currency}`
              : "зависит от стоимости груза"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insurance;
