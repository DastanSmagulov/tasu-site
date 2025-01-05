import React, { useState } from "react";

type CityItem = {
  checked: boolean;
  name: string;
};

type CityTableProps = {
  title: string;
};

const CityTable: React.FC<CityTableProps> = ({ title }) => {
  const [cities, setCities] = useState<CityItem[]>([
    { checked: true, name: "Астана" },
    { checked: true, name: "Алматы" },
    { checked: false, name: "Шымкент" },
    { checked: true, name: "Караганда" },
    { checked: true, name: "Актобе" },
    { checked: false, name: "" },
  ]);

  const handleCheckboxChange = (index: number) => {
    const updatedCities = [...cities];
    updatedCities[index].checked = !updatedCities[index].checked;
    setCities(updatedCities);
  };

  const handleAddRow = () => {
    setCities([...cities, { checked: false, name: "" }]);
  };

  const handleDeleteRows = () => {
    setCities(cities.filter((city) => !city.checked));
  };

  const handleNameChange = (index: number, value: string) => {
    const updatedCities = [...cities];
    updatedCities[index].name = value;
    setCities(updatedCities);
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-lg font-medium mb-4">{title}</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="text-left bg-gray-200">
              <th className="p-4">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setCities(
                      cities.map((city) => ({
                        ...city,
                        checked: e.target.checked,
                      }))
                    )
                  }
                />
              </th>
              <th className="p-4">№</th>
              <th className="p-4">Наименование</th>
            </tr>
          </thead>
          <tbody>
            {cities.map((city, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-gray-100`}
              >
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={city.checked}
                    onChange={() => handleCheckboxChange(index)}
                  />
                </td>
                <td className="p-4">{index + 1}</td>
                <td className="p-4">
                  <input
                    type="text"
                    value={city.name}
                    onChange={(e) => handleNameChange(index, e.target.value)}
                    className="w-full px-2 py-1 border rounded"
                    placeholder="Город"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex mt-4 space-x-4">
        <button
          onClick={handleDeleteRows}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Удалить
        </button>
        <button
          onClick={handleAddRow}
          className="bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-500"
        >
          + Добавить ещё
        </button>
      </div>
    </div>
  );
};

export default CityTable;

const CityFrom = () => {
  return <CityTable title="Города отправление" />;
};

const CityTo = () => {
  return <CityTable title="Города получение" />;
};

export { CityFrom, CityTo };
