import React, { useState } from "react";

const PackageCharacteristics: React.FC = () => {
  const [cargoType, setCargoType] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [packages, setPackages] = useState([
    {
      id: 1,
      places: 2,
      length: 2.0,
      width: 1.5,
      height: 1.5,
      weight: 14.5,
      volume: 1.6,
      weightUnit: "KG",
      volumeUnit: "M",
    },
  ]);

  const handleAddPackage = () => {
    setPackages((prev) => [
      ...prev,
      { id: prev.length + 1, places: 1, length: 0, width: 0, height: 0, weight: 0, volume: 0, weightUnit: "KG", volumeUnit: "M" },
    ]);
  };

  const handleChange = (index: number, field: string, value: any) => {
    setPackages((prev) => {
      const newPackages = [...prev];
      (newPackages[index] as any)[field] = value;
      return newPackages;
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Характер и вес груза</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Характеристика груза
        </label>
        <select
          value={cargoType}
          onChange={(e) => setCargoType(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#09BD3C] focus:border-transparent"
        >
          <option value="" disabled>
            Список грузов
          </option>
          {/* Add your cargo options here */}
          <option value="option1">Груз 1</option>
          <option value="option2">Груз 2</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Дополнительно
        </label>
        <textarea
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
          placeholder="Введите дополнительные сведения"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#09BD3C] focus:border-transparent"
        />
      </div>

      <table className="w-full mb-4">
        <thead>
          <tr>
            <th className="text-left">№</th>
            <th className="text-left">Мест</th>
            <th className="text-left">Длина</th>
            <th className="text-left">Ширина</th>
            <th className="text-left">Высота</th>
            <th className="text-left">Вес</th>
            <th className="text-left">Куб</th>
          </tr>
        </thead>
        <tbody>
          {packages.map((pkg, index) => (
            <tr key={pkg.id}>
              <td>{index + 1}</td>
              <td>
                <input
                  type="number"
                  value={pkg.places}
                  onChange={(e) => handleChange(index, "places", Number(e.target.value))}
                  className="border border-gray-300 rounded-md p-1 w-16"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={pkg.length}
                  onChange={(e) => handleChange(index, "length", Number(e.target.value))}
                  className="border border-gray-300 rounded-md p-1 w-20"
                />
                <select
                  value={pkg.volumeUnit}
                  onChange={(e) => handleChange(index, "volumeUnit", e.target.value)}
                  className="border border-gray-300 rounded-md p-1 w-16"
                >
                  <option value="M">M</option>
                </select>
              </td>
              <td>
                <input
                  type="number"
                  value={pkg.width}
                  onChange={(e) => handleChange(index, "width", Number(e.target.value))}
                  className="border border-gray-300 rounded-md p-1 w-20"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={pkg.height}
                  onChange={(e) => handleChange(index, "height", Number(e.target.value))}
                  className="border border-gray-300 rounded-md p-1 w-20"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={pkg.weight}
                  onChange={(e) => handleChange(index, "weight", Number(e.target.value))}
                  className="border border-gray-300 rounded-md p-1 w-20"
                />
                <select
                  value={pkg.weightUnit}
                  onChange={(e) => handleChange(index, "weightUnit", e.target.value)}
                  className="border border-gray-300 rounded-md p-1 w-16"
                >
                  <option value="KG">KG</option>
                </select>
              </td>
              <td>
                <input
                  type="number"
                  value={pkg.volume}
                  onChange={(e) => handleChange(index, "volume", Number(e.target.value))}
                  className="border border-gray-300 rounded-md p-1 w-20"
                />
                <select
                  value={pkg.volumeUnit}
                  onChange={(e) => handleChange(index, "volumeUnit", e.target.value)}
                  className="border border-gray-300 rounded-md p-1 w-16"
                >
                  <option value="M">M</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={handleAddPackage}
        className="mt-4 bg-[#09BD3C] text-white rounded-md px-4 py-2 hover:bg-green-600"
      >
        Добавить еще
      </button>
    </div>
  );
};

export default PackageCharacteristics;
