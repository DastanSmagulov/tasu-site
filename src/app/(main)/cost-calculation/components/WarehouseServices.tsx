"use client";
import React, { useState } from "react";

const WarehouseServices: React.FC = () => {
  const [storageType, setStorageType] = useState("Мест");
  const [quantity, setQuantity] = useState(1);
  const [weight, setWeight] = useState(14.5);
  const [cost, setCost] = useState(500);
  const [unit, setUnit] = useState("KG");

  return (
    <div className="bg-white p-6 rounded-lg shadow text-gray-800">
      <h2 className="text-xl font-semibold mb-4">Складские услуги</h2>

      {/* Storage by Place */}
      <div className="flex items-center gap-4 mb-4">
        <select
          value={storageType}
          onChange={(e) => setStorageType(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-1/4"
        >
          <option value="Мест">Мест</option>
          <option value="Вес">Вес</option>
          <option value="Куб">Куб</option>
        </select>
        <input
          type="text"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="border border-gray-300 rounded px-3 py-2 w-1/4"
          placeholder="Кол-во"
        />
        <input
          type="text"
          value={cost}
          onChange={(e) => setCost(Number(e.target.value))}
          className="border border-gray-300 rounded px-3 py-2 w-1/4"
          placeholder="Стоимость"
        />
      </div>

      {/* Conditional Weight and Cube Options */}
      {storageType === "Вес" && (
        <div className="flex items-center gap-4 mb-4">
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-1/6"
          >
            <option value="KG">KG</option>
            <option value="LB">LB</option>
          </select>
          <input
            type="text"
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            className="border border-gray-300 rounded px-3 py-2 w-1/4"
            placeholder="Вес"
          />
          <input
            type="text"
            value={cost}
            onChange={(e) => setCost(Number(e.target.value))}
            className="border border-gray-300 rounded px-3 py-2 w-1/4"
            placeholder="Стоимость"
          />
        </div>
      )}

      {storageType === "Куб" && (
        <div className="flex items-center gap-4">
          <input
            type="text"
            className="border border-gray-300 rounded px-3 py-2 w-1/4"
            placeholder="Объем"
          />
          <input
            type="text"
            value={cost}
            onChange={(e) => setCost(Number(e.target.value))}
            className="border border-gray-300 rounded px-3 py-2 w-1/4"
            placeholder="Стоимость"
          />
        </div>
      )}
    </div>
  );
};

export default WarehouseServices;
