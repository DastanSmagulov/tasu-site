import React from "react";

const CalculationDescription = () => {
  return (
    <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
      {/* Header */}
      <h2 className="text-2xl font-bold mb-6">Описание расчета</h2>

      {/* Input: Название расчета */}
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
          value="Расчет №132"
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          readOnly
        />
      </div>

      {/* Input: Дополнительная информация о расчете */}
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
          value="Асылбекова Алина Ерлановна"
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          readOnly
        />
      </div>
    </div>
  );
};

export default CalculationDescription;
