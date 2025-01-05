import React, { useState } from "react";

interface PackagingItem {
  id: string;
  name: string;
  quantity: number | "";
  tariff: string;
  cost: number | "";
  selected: boolean;
}

const initialPackagingItems: PackagingItem[] = [
  {
    id: "1",
    name: "Скотч",
    quantity: 1,
    tariff: "Большой",
    cost: 5000,
    selected: true,
  },
  {
    id: "2",
    name: "Стрэйч",
    quantity: 2,
    tariff: "Средний",
    cost: 5000,
    selected: true,
  },
  {
    id: "3",
    name: "Пупырчатая пленка",
    quantity: "",
    tariff: "Маленький",
    cost: "",
    selected: false,
  },
  {
    id: "4",
    name: "Картонная коробка",
    quantity: 1,
    tariff: "Маленький",
    cost: 5000,
    selected: true,
  },
  {
    id: "5",
    name: "Лист пенопласт",
    quantity: 1,
    tariff: "Маленький",
    cost: 5000,
    selected: true,
  },
  {
    id: "6",
    name: "Стяжная лента",
    quantity: 1,
    tariff: "Маленький",
    cost: 5000,
    selected: true,
  },
];

const PackagingService: React.FC = () => {
  const [items, setItems] = useState<PackagingItem[]>(initialPackagingItems);

  const handleCheckboxChange = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const handleInputChange = (
    id: string,
    field: "quantity" | "cost",
    value: number | ""
  ) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updatedItem = {
            ...item,
            [field]: value,
          };
          return updatedItem;
        }
        return item;
      })
    );
  };

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: "",
        quantity: "",
        tariff: "Маленький",
        cost: "",
        selected: false,
      },
    ]);
  };

  const calculateTotal = () =>
    items
      .filter((item) => item.selected && item.quantity && item.cost)
      .reduce(
        (acc, item) => acc + (item.quantity as number) * (item.cost as number),
        0
      );

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Услуга упаковки</h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="border-b border-gray-200 px-2 py-2"></th>
            <th className="border-b border-gray-200 px-2 py-2 text-gray-700 font-semibold">
              Наименование упаковки
            </th>
            <th className="border-b border-gray-200 px-2 py-2 text-gray-700 font-semibold">
              Кол-во
            </th>
            <th className="border-b border-gray-200 px-2 py-2 text-gray-700 font-semibold">
              Тариф
            </th>
            <th className="border-b border-gray-200 px-2 py-2 text-gray-700 font-semibold">
              Стоимость
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-gray-200">
              <td className="px-2 py-2">
                <div
                  className={`w-5 h-5 flex items-center justify-center rounded-full cursor-pointer ${
                    item.selected
                      ? "bg-green-500 text-white"
                      : "border-2 border-gray-400"
                  }`}
                  onClick={() => handleCheckboxChange(item.id)}
                >
                  {item.selected && <span>&#10003;</span>}
                </div>
              </td>
              <td className="px-2 py-2 text-gray-700">{item.name}</td>
              <td className="px-2 py-2 text-gray-700">
                <input
                  type="number"
                  value={item.quantity || ""}
                  onChange={(e) =>
                    handleInputChange(
                      item.id,
                      "quantity",
                      parseFloat(e.target.value) || ""
                    )
                  }
                  className="w-full px-2 py-1 border border-gray-300 rounded text-center"
                />
              </td>
              <td className="px-2 py-2 text-gray-700">{item.tariff}</td>
              <td className="px-2 py-2 text-gray-700">
                <input
                  type="number"
                  value={item.cost || ""}
                  onChange={(e) =>
                    handleInputChange(
                      item.id,
                      "cost",
                      parseFloat(e.target.value) || ""
                    )
                  }
                  className="w-full px-2 py-1 border border-gray-300 rounded text-center"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={handleAddItem}
          className="px-4 py-2 bg-gray-100 text-gray-500 rounded-lg border border-gray-300"
        >
          Добавить еще
        </button>
        <div className="text-lg font-bold">
          Итог Упаковки:{" "}
          <span className="border border-gray-300 px-4 py-1">
            {calculateTotal()} тг.
          </span>
        </div>
      </div>
    </div>
  );
};

export default PackagingService;
