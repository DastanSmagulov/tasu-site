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
      {
        id: prev.length + 1,
        places: 1,
        length: 0,
        width: 0,
        height: 0,
        weight: 0,
        volume: 0,
        weightUnit: "KG",
        volumeUnit: "M",
      },
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
      <h2 className="text-lg font-semibold mb-4 text-[#1D1B23]">
        Характер и вес груза
      </h2>

      {/* Characteristics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-[#1D1B23] mb-1">
            Характеристика груза
          </label>
          <select
            value={cargoType}
            onChange={(e) => setCargoType(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#09BD3C] focus:border-transparent"
          >
            <option value="" disabled>
              Список грузов
            </option>
            <option value="option1">Груз 1</option>
            <option value="option2">Груз 2</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1D1B23] mb-1">
            Дополнительно
          </label>
          <textarea
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            placeholder="Введите дополнительные сведения"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#09BD3C] focus:border-transparent"
            rows={3}
          />
        </div>
      </div>

      {/* Package Details */}
      <div className="space-y-6">
        {packages.map((pkg, index) => (
          <div
            key={pkg.id}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center border-b border-gray-200 pb-4"
          >
            <div className="flex items-center gap-2">
              <span className="w-8 text-sm font-medium">{index + 1}</span>
              <input
                type="number"
                value={pkg.places}
                onChange={(e) =>
                  handleChange(index, "places", Number(e.target.value))
                }
                className="border border-gray-300 rounded-md p-1 w-16 text-center"
              />
              <span className="text-sm">Мест</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                value={pkg.length}
                onChange={(e) =>
                  handleChange(index, "length", Number(e.target.value))
                }
                className="border border-gray-300 rounded-md p-1 w-16 text-center"
              />
              <span className="text-sm">Длина</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                value={pkg.width}
                onChange={(e) =>
                  handleChange(index, "width", Number(e.target.value))
                }
                className="border border-gray-300 rounded-md p-1 w-16 text-center"
              />
              <span className="text-sm">Ширина</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                value={pkg.height}
                onChange={(e) =>
                  handleChange(index, "height", Number(e.target.value))
                }
                className="border border-gray-300 rounded-md p-1 w-16 text-center"
              />
              <span className="text-sm">Высота</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                value={pkg.weight}
                onChange={(e) =>
                  handleChange(index, "weight", Number(e.target.value))
                }
                className="border border-gray-300 rounded-md p-1 w-16 text-center"
              />
              <select
                value={pkg.weightUnit}
                onChange={(e) =>
                  handleChange(index, "weightUnit", e.target.value)
                }
                className="border border-gray-300 rounded-md p-1 w-16 text-center"
              >
                <option value="KG">KG</option>
              </select>
              <span className="text-sm">Вес</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                value={pkg.volume}
                onChange={(e) =>
                  handleChange(index, "volume", Number(e.target.value))
                }
                className="border border-gray-300 rounded-md p-1 w-16 text-center"
              />
              <select
                value={pkg.volumeUnit}
                onChange={(e) =>
                  handleChange(index, "volumeUnit", e.target.value)
                }
                className="border border-gray-300 rounded-md p-1 w-16 text-center"
              >
                <option value="M">M</option>
              </select>
              <span className="text-sm">Куб</span>
            </div>

            <button
              onClick={() =>
                setPackages((prev) => prev.filter((_, i) => i !== index))
              }
              className="text-gray-500 hover:text-red-500"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={handleAddPackage}
        className="mt-4 bg-[#E5E7EB] text-[#1D1B23] rounded-md px-4 py-2 hover:bg-gray-300 text-sm font-semibold"
      >
        Добавить еще
      </button>
    </div>
  );
};

export default PackageCharacteristics;
