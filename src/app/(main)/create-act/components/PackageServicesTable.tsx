import React, { useState } from "react";

const initialServicesData = [
  { id: 1, name: "Скотч", small: "", medium: "", large: 5000, selected: false },
  {
    id: 2,
    name: "Стрейч",
    small: "2",
    medium: "",
    large: 5000,
    selected: false,
  },
  {
    id: 3,
    name: "Пупырчатая пленка",
    small: "0",
    medium: "",
    large: 5000,
    selected: false,
  },
  {
    id: 4,
    name: "Картонная коробка",
    small: "1",
    medium: "",
    large: 5000,
    selected: false,
  },
  {
    id: 5,
    name: "Лист пенопласт",
    small: "1",
    medium: "Маленький",
    large: 5000,
    selected: false,
  },
  {
    id: 6,
    name: "Стяжная лента",
    small: "1",
    medium: "Маленький",
    large: 5000,
    selected: false,
  },
];

const initialAdditionalServices = [
  { id: 1, name: "Перевозка", qty: 1, price: 5000 },
  { id: 2, name: "Перемещение", qty: 1, price: 5000 },
];

function PackingServicesTable() {
  const [services, setServices] = useState(initialServicesData);
  const [additionalServices, setAdditionalServices] = useState(
    initialAdditionalServices
  );

  const toggleSelection = (id) => {
    setServices(
      services.map((service) =>
        service.id === id
          ? { ...service, selected: !service.selected }
          : service
      )
    );
  };

  const addService = () => {
    const newService = {
      id: services.length + 1,
      name: "",
      small: "",
      medium: "",
      large: 5000,
      selected: false,
    };
    setServices([...services, newService]);
  };

  const updateService = (id, field, value) => {
    setServices(
      services.map((service) =>
        service.id === id ? { ...service, [field]: value } : service
      )
    );
  };

  const addAdditionalService = () => {
    const newService = {
      id: additionalServices.length + 1,
      name: "",
      qty: 1,
      price: 5000,
    };
    setAdditionalServices([...additionalServices, newService]);
  };

  const updateAdditionalService = (id, field, value) => {
    setAdditionalServices(
      additionalServices.map((service) =>
        service.id === id ? { ...service, [field]: value } : service
      )
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Услуга упаковки</h2>
      <table className="w-full border-collapse mb-6">
        <thead>
          <tr>
            <th className="border p-2 w-12"></th>
            <th className="border p-2 text-left">Наименование упаковки</th>
            <th className="border p-2 text-left">Тариф Маленький</th>
            <th className="border p-2 text-left">Тариф Средний</th>
            <th className="border p-2 text-left">Тариф Большой</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.id}>
              <td className="border p-2 text-center">
                <input
                  type="checkbox"
                  checked={service.selected}
                  onChange={() => toggleSelection(service.id)}
                  className="h-5 w-5 rounded-full text-green-500"
                />
              </td>
              <td className="border p-2">
                <input
                  type="text"
                  value={service.name}
                  onChange={(e) =>
                    updateService(service.id, "name", e.target.value)
                  }
                  placeholder="Введите наименование"
                  className="w-full p-1 text-center border rounded"
                />
              </td>
              <td className="border p-2">
                <input
                  type="text"
                  value={service.small}
                  onChange={(e) =>
                    updateService(service.id, "small", e.target.value)
                  }
                  className="w-full p-1 text-center border rounded"
                />
              </td>
              <td className="border p-2">
                <input
                  type="text"
                  value={service.medium}
                  onChange={(e) =>
                    updateService(service.id, "medium", e.target.value)
                  }
                  className="w-full p-1 text-center border rounded"
                />
              </td>
              <td className="border p-2">
                <input
                  type="text"
                  value={service.large}
                  onChange={(e) =>
                    updateService(service.id, "large", e.target.value)
                  }
                  className="w-full p-1 text-center border rounded"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={addService}
        className="py-2 px-4 bg-blue-600 text-white rounded shadow"
      >
        Добавить еще
      </button>
    </div>
  );
}

export default PackingServicesTable;
