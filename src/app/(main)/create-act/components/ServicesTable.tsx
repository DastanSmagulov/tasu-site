import React, { useState } from "react";

interface Service {
  id: string;
  name: string;
  quantity: number | "";
  price: number | "";
  total: number | "";
  selected: boolean;
}

const initialServices: Service[] = [
  {
    id: "1",
    name: "Перевозка",
    quantity: 1,
    price: 5000,
    total: 5000,
    selected: true,
  },
  {
    id: "2",
    name: "Перемещение",
    quantity: 1,
    price: 5000,
    total: 5000,
    selected: true,
  },
  {
    id: "3",
    name: "Доставка",
    quantity: "",
    price: "",
    total: "",
    selected: false,
  },
  {
    id: "4",
    name: "Р/П",
    quantity: 1,
    price: 5000,
    total: 5000,
    selected: true,
  },
  {
    id: "5",
    name: "Упаковка ?",
    quantity: 1,
    price: 5000,
    total: 5000,
    selected: true,
  },
  {
    id: "6",
    name: "Страхование",
    quantity: 1,
    price: 5000,
    total: 5000,
    selected: true,
  },
];

const ServicesTable: React.FC = () => {
  const [services, setServices] = useState<Service[]>(initialServices);

  const handleCheckboxChange = (id: string) => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === id
          ? { ...service, selected: !service.selected }
          : service
      )
    );
  };

  const handleInputChange = (
    id: string,
    field: "quantity" | "price",
    value: number | ""
  ) => {
    setServices((prev) =>
      prev.map((service) => {
        if (service.id === id) {
          const updatedService = {
            ...service,
            [field]: value,
            total:
              service.quantity && service.price
                ? service.quantity * service.price
                : "",
          };
          return updatedService;
        }
        return service;
      })
    );
  };

  const handleAddService = () => {
    setServices((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: "",
        quantity: "",
        price: "",
        total: "",
        selected: false,
      },
    ]);
  };

  const calculateTotal = () =>
    services
      .filter((service) => service.selected && service.total)
      .reduce((acc, service) => acc + (service.total as number), 0);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Услуги по перевозке</h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="border-b px-2 py-2"> </th>
            <th className="border-b px-2 py-2 text-gray-700 font-semibold">
              Наименование
            </th>
            <th className="border-b px-2 py-2 text-gray-700 font-semibold">
              шт
            </th>
            <th className="border-b px-2 py-2 text-gray-700 font-semibold">
              цена
            </th>
            <th className="border-b px-2 py-2 text-gray-700 font-semibold">
              Стоимость
            </th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.id} className="border-b">
              <td className="px-2 py-2">
                <div
                  className={`w-5 h-5 flex items-center justify-center rounded-full cursor-pointer ${
                    service.selected
                      ? "bg-green-500 text-white"
                      : "border-2 border-gray-400"
                  }`}
                  onClick={() => handleCheckboxChange(service.id)}
                >
                  {service.selected && <span>&#10003;</span>}
                </div>
              </td>
              <td className="px-2 py-2 text-gray-700">{service.name}</td>
              <td className="px-2 py-2 text-gray-700">
                <input
                  type="number"
                  value={service.quantity || ""}
                  onChange={(e) =>
                    handleInputChange(
                      service.id,
                      "quantity",
                      parseFloat(e.target.value)
                    )
                  }
                  className="w-full px-2 py-1 border rounded text-center"
                />
              </td>
              <td className="px-2 py-2 text-gray-700">
                <input
                  type="number"
                  value={service.price || ""}
                  onChange={(e) =>
                    handleInputChange(
                      service.id,
                      "price",
                      parseFloat(e.target.value)
                    )
                  }
                  className="w-full px-2 py-1 border rounded text-center"
                />
              </td>
              <td className="px-2 py-2 text-gray-700">{service.total || ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={handleAddService}
          className="px-4 py-2 bg-gray-100 text-gray-500 rounded-lg border border-gray-300"
        >
          Добавить еще
        </button>
        <div className="text-lg font-bold">
          Итог Услуг:{" "}
          <span className="border border-gray-300 px-4 py-1">
            {calculateTotal()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ServicesTable;
