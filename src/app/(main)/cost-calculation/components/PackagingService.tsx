// components/PackagingService.tsx
import { useState } from "react";

interface PackagingItem {
  name: string;
  quantity: number;
  tariff: string;
  cost: number;
  selected: boolean;
}

const PackagingService = () => {
  const [items, setItems] = useState<PackagingItem[]>([
    {
      name: "Скотч",
      quantity: 1,
      tariff: "Большой",
      cost: 5000,
      selected: true,
    },
    {
      name: "Стрэйч",
      quantity: 2,
      tariff: "Средний",
      cost: 5000,
      selected: true,
    },
    {
      name: "Пупырчатая пленка",
      quantity: 0,
      tariff: "Маленький",
      cost: 5000,
      selected: false,
    },
    {
      name: "Картонная коробка",
      quantity: 1,
      tariff: "Маленький",
      cost: 5000,
      selected: true,
    },
    {
      name: "Лист пенопласт",
      quantity: 1,
      tariff: "Маленький",
      cost: 5000,
      selected: true,
    },
    {
      name: "Стяжная лента",
      quantity: 1,
      tariff: "Маленький",
      cost: 5000,
      selected: true,
    },
  ]);

  const handleCheckboxChange = (index: number) => {
    const updatedItems = [...items];
    updatedItems[index].selected = !updatedItems[index].selected;
    setItems(updatedItems);
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        name: "",
        quantity: 0,
        tariff: "Маленький",
        cost: 5000,
        selected: false,
      },
    ]);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    field: keyof PackagingItem
  ) => {
    const updatedItems = [...items];
    updatedItems[index][field] =
      field === "quantity" ? parseInt(e.target.value) : e.target.value;
    setItems(updatedItems);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Услуга упаковки
      </h2>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="text-sm font-medium text-gray-700 bg-gray-100">
            <th className="p-2 w-10 text-center"></th>
            <th className="p-2">Наименование упаковки</th>
            <th className="p-2 w-20 text-center">Кол-во</th>
            <th className="p-2 w-28 text-center">Тариф</th>
            <th className="p-2 w-28 text-center">Стоимость</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr
              key={index}
              className={`${
                item.selected ? "bg-green-50" : "bg-white"
              } hover:bg-gray-50 border-t border-b border-gray-200`}
            >
              <td className="p-2 text-center">
                <input
                  type="checkbox"
                  checked={item.selected}
                  onChange={() => handleCheckboxChange(index)}
                  className="checkbox checkbox-sm"
                />
              </td>
              <td className="p-2">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => handleInputChange(e, index, "name")}
                  className="input input-bordered w-full"
                  placeholder="Наименование"
                />
              </td>
              <td className="p-2 text-center">
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleInputChange(e, index, "quantity")}
                  className="input input-bordered w-full text-center"
                />
              </td>
              <td className="p-2 text-center">
                <input
                  type="text"
                  value={item.tariff}
                  onChange={(e) => handleInputChange(e, index, "tariff")}
                  className="input input-bordered w-full text-center"
                />
              </td>
              <td className="p-2 text-center">
                <input
                  type="number"
                  value={item.cost}
                  onChange={(e) => handleInputChange(e, index, "cost")}
                  className="input input-bordered w-full text-center"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={handleAddItem}
        className="btn btn-outline mt-4 text-gray-700 border-gray-300 hover:border-gray-500 hover:text-gray-800"
      >
        Добавить еще
      </button>
    </div>
  );
};

export default PackagingService;
