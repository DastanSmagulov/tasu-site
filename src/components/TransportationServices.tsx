import React, { useState } from "react";

const TransportationServices: React.FC = () => {
  const [services, setServices] = useState([
    { id: 1, name: "Стоимость перевозки", price: "", checked: false },
    { id: 2, name: "Доставка в другом городе", price: "", checked: false },
    {
      id: 3,
      name: "Забор груза с города нахождения",
      price: "",
      checked: false,
    },
    { id: 4, name: "Разг-погр работы", price: "3000", checked: true },
  ]);

  const [total, setTotal] = useState(1900239);

  const handleCheckboxChange = (id: number) => {
    const updatedServices = services.map((service) =>
      service.id === id ? { ...service, checked: !service.checked } : service
    );
    setServices(updatedServices);
  };

  const handlePriceChange = (id: number, price: string) => {
    const updatedServices = services.map((service) =>
      service.id === id ? { ...service, price } : service
    );
    setServices(updatedServices);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-auto">
      <h2 className="text-lg font-semibold mb-4 text-[#1D1B23]">
        Услуга Перевозки
      </h2>

      <div className="space-y-4">
        {services.map((service) => (
          <div key={service.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={service.checked}
                onChange={() => handleCheckboxChange(service.id)}
                className="form-checkbox h-5 w-5 text-yellow-500 rounded"
              />
              <span className="text-[#1D1B23]">{service.name}</span>
            </div>
            <input
              type="text"
              value={service.price}
              onChange={(e) => handlePriceChange(service.id, e.target.value)}
              placeholder="Цена"
              className="border border-gray-300 rounded-md p-2 w-24 text-center focus:ring-[#09BD3C] focus:outline-none"
            />
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="flex justify-end mt-6 text-[#1D1B23] font-semibold">
        <span>Итог: </span>
        <span className="ml-2">{total.toLocaleString()} тг.</span>
      </div>
    </div>
  );
};

export default TransportationServices;
