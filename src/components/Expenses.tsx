import React, { useState } from "react";

const initialExpenseItems = [
  { id: 1, name: "Перевозка", quantity: 1, price: 5000, selected: false },
];

const Expenses = () => {
  const [hasExpenses, setHasExpenses] = useState(true);
  const [items, setItems] = useState(initialExpenseItems);

  const handleCheckboxChange = () => setHasExpenses(!hasExpenses);

  const addItem = () => {
    const newItem = {
      id: items.length + 1,
      name: "",
      quantity: 1,
      price: 0,
      selected: false,
    };
    setItems([...items, newItem]);
  };

  const updateItem = (id: number, field: any, value: number) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const toggleSelection = (id: number) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const calculateTotal = () => {
    return items
      .filter((item) => item.selected)
      .reduce((total, item) => total + item.quantity * item.price, 0);
  };

  return (
    <div className="expenses-component p-4">
      <h2 className="text-2xl font-bold mb-4">Расходы</h2>
      <label className="mb-4 flex items-center">
        <input
          type="checkbox"
          checked={hasExpenses}
          onChange={handleCheckboxChange}
          className="mr-2"
        />
        Есть расходы?
      </label>
      {hasExpenses && (
        <>
          <table className="w-full border-collapse mb-4">
            <thead>
              <tr>
                <th className="border p-2 w-12"></th>
                <th className="border p-2 text-left">Наименование</th>
                <th className="border p-2 text-left">Количество</th>
                <th className="border p-2 text-left">Цена</th>
                <th className="border p-2 text-left">Стоимость</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="border p-2 text-center">
                    <input
                      type="checkbox"
                      checked={item.selected}
                      onChange={() => toggleSelection(item.id)}
                      className="h-5 w-5 rounded-full text-green-500"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) =>
                        updateItem(item.id, "name", Number(e.target.value))
                      }
                      placeholder="Введите наименование"
                      className="w-full p-1 text-center border rounded"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(
                          item.id,
                          "quantity",
                          parseInt(e.target.value, 10)
                        )
                      }
                      className="w-full p-1 text-center border rounded"
                      min="1"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) =>
                        updateItem(
                          item.id,
                          "price",
                          parseInt(e.target.value, 10)
                        )
                      }
                      className="w-full p-1 text-center border rounded"
                      min="0"
                    />
                  </td>
                  <td className="border p-2 text-center">
                    {item.quantity * item.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={addItem}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Добавить еще
          </button>
          <div className="mt-4 font-bold">
            Итого Расходов:{" "}
            <input
              type="text"
              value={calculateTotal()}
              readOnly
              className="ml-2 p-1 border rounded text-center w-24"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Expenses;
