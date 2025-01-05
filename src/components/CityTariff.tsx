import React, { useState } from "react";

interface Service {
  id: string;
  name: string;
  quantity: number | "";
  price: number | "";
  total: number | "";
  selected: boolean;
}

const initialAdditionalServices: Service[] = [
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
];

const AdditionalServiceTable: React.FC = () => {
  const [services, setServices] = useState<Service[]>(
    initialAdditionalServices
  );

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
    value: number | string
  ) => {
    setServices((prev) =>
      prev.map((service) => {
        if (service.id === id) {
          const updatedService = {
            ...service,
            [field]: value,
            total:
              field === "quantity" || field === "price"
                ? Number(value) *
                  (field === "quantity"
                    ? Number(service.price)
                    : Number(service.quantity))
                : service.total,
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
      .filter((service) => service.selected && service.total !== "")
      .reduce((acc, service) => acc + (service.total as number), 0);

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Дополнительные услуги</h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="border-b border-gray-200 px-2 py-2"></th>
            <th className="border-b border-gray-200 px-2 py-2 text-gray-700 font-semibold">
              Город отправления
            </th>
            <th className="border-b border-gray-200 px-2 py-2 text-gray-700 font-semibold">
              Город получения
            </th>
            <th className="border-b border-gray-200 px-2 py-2 text-gray-700 font-semibold">
              Тариф
            </th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.id} className="border-b border-gray-200">
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
              <td className="px-2 py-2">
                <input
                  type="text"
                  value={service.name}
                  placeholder="Город отправления"
                  onChange={(e) =>
                    handleInputChange(service.id, "quantity", e.target.value)
                  }
                  className="w-full p-2 border rounded"
                />
              </td>
              <td className="px-2 py-2">
                <input
                  type="text"
                  value={service.quantity}
                  onChange={(e) =>
                    handleInputChange(
                      service.id,
                      "quantity",
                      Number(e.target.value) || ""
                    )
                  }
                  className="w-full p-2 border rounded text-center"
                />
              </td>
              <td className="px-2 py-2">
                <input
                  type="number"
                  value={service.price}
                  onChange={(e) =>
                    handleInputChange(
                      service.id,
                      "price",
                      Number(e.target.value) || ""
                    )
                  }
                  className="w-full p-2 border rounded text-center"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={handleAddService}
        className="mt-4 py-2 px-4 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
      >
        Добавить услугу
      </button>

      <div className="mt-4 flex justify-end items-center gap-2">
        <span className="text-lg font-semibold">Итого:</span>
        <span className="text-lg font-bold">{calculateTotal()}</span>
      </div>
    </div>
  );
};

export default AdditionalServiceTable;
