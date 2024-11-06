"use client";
import React, { useState } from "react";

interface Service {
  itemName: string;
  quantity: number;
  size: string;
  cost: number;
}

const PackagingService: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("большой");
  const [cost, setCost] = useState(500);

  const handleAddService = () => {
    const newService: Service = { itemName, quantity, size, cost };
    setServices([...services, newService]);
    setItemName(""); // Clear input fields after adding
    setQuantity(1);
    setSize("большой");
    setCost(500);
  };

  const handleDeleteService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6 text-gray-800">
      <h2 className="text-xl font-semibold mb-4">Услуга упаковки</h2>

      {/* Input fields for a new service */}
      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          placeholder="Услуга по хранению"
          className="border border-gray-300 rounded px-3 py-2 w-1/2"
        />
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="border border-gray-300 rounded px-3 py-2 w-1/6"
          placeholder="Кол-во"
        />
        <select
          value={size}
          onChange={(e) => setSize(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-1/4"
        >
          <option value="большой">большой</option>
          <option value="средний">средний</option>
          <option value="маленький">маленький</option>
        </select>
        <input
          type="number"
          value={cost}
          onChange={(e) => setCost(Number(e.target.value))}
          className="border border-gray-300 rounded px-3 py-2 w-1/4"
          placeholder="Стоимость"
        />
      </div>

      {/* Button to add new service */}
      <button onClick={handleAddService} className="text-blue-500 mb-4">
        Добавить еще
      </button>

      {/* Render the list of added services */}
      {services.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Добавленные услуги:</h3>
          {services.map((service, index) => (
            <div key={index} className="flex items-center gap-4 mb-2">
              <span className="w-1/2">{service.itemName}</span>
              <span className="w-1/6">{service.quantity}</span>
              <span className="w-1/4">{service.size}</span>
              <span className="w-1/4">{service.cost} тенге</span>
              <button
                onClick={() => handleDeleteService(index)}
                className="text-red-500"
              >
                Удалить
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PackagingService;
