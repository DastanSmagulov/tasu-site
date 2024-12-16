import React, { useState } from "react";

interface Service {
  id: string;
  name: string;
  qty: number;
  weight: number;
  price: number;
  cost: number;
}

const AdditionalServiceTable: React.FC = () => {
  const [isAdditionalServiceEnabled, setIsAdditionalServiceEnabled] =
    useState(false);
  const [additionalServices, setAdditionalServices] = useState<Service[]>([
    { id: "1", name: "Перевозка", qty: 5000, weight: 0, price: 0, cost: 5000 },
    {
      id: "2",
      name: "Перемещение",
      qty: 5000,
      weight: 0,
      price: 0,
      cost: 5000,
    },
  ]);

  const addAdditionalService = () => {
    setAdditionalServices((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: "",
        qty: 0,
        weight: 0,
        price: 0,
        cost: 0,
      },
    ]);
  };

  const updateAdditionalService = (
    id: string,
    field: keyof Service,
    value: number | string
  ) => {
    setAdditionalServices((prev) =>
      prev.map((service) =>
        service.id === id ? { ...service, [field]: value } : service
      )
    );
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-lg mt-8">
      <h3 className="text-xl font-semibold mb-4">Доп услуги</h3>
      <label className="flex items-center mb-4">
        <input
          type="checkbox"
          checked={isAdditionalServiceEnabled}
          onChange={() =>
            setIsAdditionalServiceEnabled(!isAdditionalServiceEnabled)
          }
          className="h-5 w-5 text-green-500 rounded mr-2"
        />
        <span className="text-gray-700">Нужен доп услуга?</span>
      </label>

      {isAdditionalServiceEnabled && (
        <div>
          <table className="w-full border-collapse mb-4 text-gray-700">
            <thead>
              <tr>
                <th className="border p-2 text-left bg-gray-100">
                  Наименование
                </th>
                <th className="border p-2 text-left bg-gray-100">шт</th>
                <th className="border p-2 text-left bg-gray-100">цена</th>
                <th className="border p-2 text-left bg-gray-100">Стоимость</th>
              </tr>
            </thead>
            <tbody>
              {additionalServices.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50">
                  <td className="border p-2 text-center">
                    <input
                      type="text"
                      value={service.name}
                      onChange={(e) =>
                        updateAdditionalService(
                          service.id,
                          "name",
                          e.target.value
                        )
                      }
                      placeholder="Введите наименование"
                      className="w-full p-2 border rounded"
                    />
                  </td>
                  <td className="border p-2 text-center">
                    <input
                      type="number"
                      value={service.qty}
                      onChange={(e) =>
                        updateAdditionalService(
                          service.id,
                          "qty",
                          Number(e.target.value)
                        )
                      }
                      className="w-full p-2 border rounded text-center"
                    />
                  </td>
                  <td className="border p-2 text-center">
                    <input
                      type="number"
                      value={service.price}
                      onChange={(e) =>
                        updateAdditionalService(
                          service.id,
                          "price",
                          Number(e.target.value)
                        )
                      }
                      className="w-full p-2 border rounded text-center"
                    />
                  </td>
                  <td className="border p-2 text-center">
                    {service.qty * service.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={addAdditionalService}
            className="mb-4 py-2 px-4 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
          >
            Добавить еще
          </button>

          <div className="mt-4 flex justify-end items-center gap-2">
            <span className="text-lg font-semibold">Итог доп услуг:</span>
            <input
              type="text"
              className="border rounded p-2 w-24 text-center"
              readOnly
              value={additionalServices.reduce(
                (sum, service) => sum + service.qty * service.price,
                0
              )}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdditionalServiceTable;
