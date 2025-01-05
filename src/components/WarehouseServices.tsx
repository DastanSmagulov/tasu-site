"use client";
import React, { useState } from "react";

const WarehouseServices: React.FC = () => {
  const [services, setServices] = useState([
    {
      id: 1,
      name: "Хранение",
      checked: false,
      type: "По месту",
      quantity: "",
      price: "",
    },
    {
      id: 2,
      name: "Р/П",
      checked: false,
      type: "Россыпь",
      quantity: "",
      price: "",
    },
    {
      id: 3,
      name: "Оформление пропуска",
      checked: false,
      quantity: "",
      price: "",
    },
  ]);

  const [cargoCost, setCargoCost] = useState("");
  const [currency, setCurrency] = useState("kzt");
  const [total, setTotal] = useState(1900239);

  const handleServiceChange = (
    id: number,
    key: string,
    value: string | boolean
  ) => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === id ? { ...service, [key]: value } : service
      )
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-gray-800">
      <h2 className="text-xl font-semibold mb-4">Складские Услуги</h2>

      {/* Cargo Cost */}
      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Укажите цену"
          value={cargoCost}
          onChange={(e) => setCargoCost(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-3/4"
        />
        <div className="relative w-1/4">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          >
            <option value="kzt">kzt</option>
            <option value="usd">usd</option>
            <option value="eur">eur</option>
          </select>
        </div>
      </div>

      {/* Services List */}
      {services.map((service) => (
        <div key={service.id} className="flex items-center gap-4 mb-4">
          {/* Checkbox */}
          <input
            type="checkbox"
            checked={service.checked}
            onChange={(e) =>
              handleServiceChange(service.id, "checked", e.target.checked)
            }
            className="form-checkbox h-5 w-5 text-yellow-500"
          />
          <span className="w-1/4">{service.name}</span>

          {/* Type Dropdown */}
          {service.name !== "Оформление пропуска" && (
            <select
              value={service.type}
              onChange={(e) =>
                handleServiceChange(service.id, "type", e.target.value)
              }
              className="border border-gray-300 rounded px-3 py-2 w-1/4"
            >
              <option value="По месту">По месту</option>
              <option value="Россыпь">Россыпь</option>
            </select>
          )}

          {/* Quantity */}
          <input
            type="text"
            placeholder="Укажите кол-во"
            value={service.quantity}
            onChange={(e) =>
              handleServiceChange(service.id, "quantity", e.target.value)
            }
            className="border border-gray-300 rounded px-3 py-2 w-1/4"
          />

          {/* Price */}
          <input
            type="text"
            placeholder="Укажите цену"
            value={service.price}
            onChange={(e) =>
              handleServiceChange(service.id, "price", e.target.value)
            }
            className="border border-gray-300 rounded px-3 py-2 w-1/4"
          />
        </div>
      ))}

      {/* Total */}
      <div className="flex justify-end mt-6 text-[#1D1B23] font-semibold">
        <span>Итог: </span>
        <span className="ml-2">{total.toLocaleString()} тг.</span>
      </div>
    </div>
  );
};

export default WarehouseServices;
