import React, { useState } from "react";

const PackageCharacteristics: React.FC = () => {
  const [cargoCost, setCargoCost] = useState("");
  const [senderCity, setSenderCity] = useState("");
  const [receiverCity, setReceiverCity] = useState("");
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
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-lg font-semibold mb-4 text-[#1D1B23]">
        Характер и Вес Груза
      </h2>

      {/* Cost of Cargo */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-[#1D1B23] mb-1">
          Стоимость груза
        </label>
        <input
          type="text"
          value={cargoCost}
          onChange={(e) => setCargoCost(e.target.value)}
          placeholder="Укажите стоимость"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#09BD3C] focus:border-transparent"
        />
      </div>

      {/* Sender and Receiver Cities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-[#1D1B23] mb-1">
            Город отправителя
          </label>
          <input
            type="text"
            value={senderCity}
            onChange={(e) => setSenderCity(e.target.value)}
            placeholder="Введите город"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#09BD3C] focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1D1B23] mb-1">
            Город получателя
          </label>
          <input
            type="text"
            value={receiverCity}
            onChange={(e) => setReceiverCity(e.target.value)}
            placeholder="Введите город"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#09BD3C] focus:border-transparent"
          />
        </div>
      </div>

      {/* Additional Information */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-[#1D1B23] mb-1">
          Дополнительно
        </label>
        <textarea
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
          placeholder="Любые дополнения относительно характера груза и веса товара"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#09BD3C] focus:border-transparent"
          rows={3}
        />
        <p className="text-xs text-gray-500 mt-1">
          Поле не обязательно для заполнения
        </p>
      </div>

      {/* Package Details */}
      <div className="space-y-6">
        {packages.map((pkg, index) => (
          <div
            key={pkg.id}
            className="border border-gray-200 rounded-lg p-4 mb-4"
          >
            <h3 className="text-lg font-semibold mb-4 text-[#1D1B23]">
              №{index + 1} Груз
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
              {/* Places */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-[#1D1B23]">
                  Мест
                </label>
                <input
                  type="number"
                  value={pkg.places}
                  onChange={(e) =>
                    handleChange(index, "places", Number(e.target.value))
                  }
                  className="border border-gray-300 rounded-md p-1 w-16 text-center"
                />
              </div>

              {/* Length */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-[#1D1B23]">
                  Длина
                </label>
                <input
                  type="number"
                  value={pkg.length}
                  onChange={(e) =>
                    handleChange(index, "length", Number(e.target.value))
                  }
                  className="border border-gray-300 rounded-md p-1 w-16 text-center"
                />
              </div>

              {/* Width */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-[#1D1B23]">
                  Ширина
                </label>
                <input
                  type="number"
                  value={pkg.width}
                  onChange={(e) =>
                    handleChange(index, "width", Number(e.target.value))
                  }
                  className="border border-gray-300 rounded-md p-1 w-16 text-center"
                />
              </div>

              {/* Height */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-[#1D1B23]">
                  Высота
                </label>
                <input
                  type="number"
                  value={pkg.height}
                  onChange={(e) =>
                    handleChange(index, "height", Number(e.target.value))
                  }
                  className="border border-gray-300 rounded-md p-1 w-16 text-center"
                />
              </div>

              {/* Weight */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-[#1D1B23]">
                  Вес
                </label>
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
              </div>

              {/* Volume */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-[#1D1B23]">
                  Куб
                </label>
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
              </div>
            </div>

            {/* Delete Button */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() =>
                  setPackages((prev) => prev.filter((_, i) => i !== index))
                }
                className="text-gray-500 hover:text-red-500 bg-transparent hover:bg-transparent"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleAddPackage}
        className="mt-4 bg-[#FDE107] text-[#1D1B23] rounded-md px-4 py-2 hover:bg-[#f4e04a] text-sm font-semibold"
      >
        + Добавить еще
      </button>
    </div>
  );
};

export default PackageCharacteristics;
