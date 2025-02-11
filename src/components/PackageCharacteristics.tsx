import React, { useState, useEffect, useMemo } from "react";
import { axiosInstance } from "@/helper/utils";
import { ActDataProps } from "@/helper/types";

interface Option {
  id: number;
  name: string;
}

interface CityOption {
  sender_city: Option;
  receiver_cities: Option[];
}

interface PackageOption {
  id: number;
  name_ru: string;
}

const PackageCharacteristics: React.FC<ActDataProps> = ({ data, setData }) => {
  // --- Local state for characteristic fields ---
  // We expect senderCity and receiverCity to be the city names.
  const [cargoCost, setCargoCost] = useState(
    data?.characteristic?.cargo_cost || ""
  );
  const [senderCity, setSenderCity] = useState<string>(
    data?.characteristic?.sender_city || ""
  );
  const [receiverCity, setReceiverCity] = useState<string>(
    data?.characteristic?.receiver_city || ""
  );
  const [additionalInfo, setAdditionalInfo] = useState(
    data?.characteristic?.additional_info || ""
  );

  // --- Local state for packages ---
  const [packages, setPackages] = useState<any>(data?.cargo || []);

  // --- Local state for package options (characteristics) ---
  const [packageOptions, setPackageOptions] = useState<PackageOption[]>([]);

  // --- Local state for available city options ---
  const [cityOptions, setCityOptions] = useState<CityOption[]>([]);

  // --- Dropdown toggles for cities ---
  const [senderDropdownOpen, setSenderDropdownOpen] = useState(false);
  const [receiverDropdownOpen, setReceiverDropdownOpen] = useState(false);

  // --- Fetch package options ---
  const fetchPackageOptions = async () => {
    try {
      const response = await axiosInstance.get("/admin/characteristics/");
      setPackageOptions(response.data.results);
    } catch (error) {
      console.error("Error fetching package options:", error);
    }
  };
  useEffect(() => {
    fetchPackageOptions();
  }, []);

  // --- Fetch city options ---
  const fetchCityOptions = async () => {
    try {
      const response = await axiosInstance.get(
        "/admin/city-transportations/available-cities/"
      );
      setCityOptions(response.data);
    } catch (error) {
      console.error("Error fetching city options:", error);
    }
  };
  useEffect(() => {
    fetchCityOptions();
  }, []);

  // --- Memoize unique sender cities ---
  const uniqueSenderCities = useMemo(() => {
    return Array.from(
      new Map(
        cityOptions.map((item) => [item.sender_city.id, item.sender_city])
      ).values()
    );
  }, [cityOptions]);

  // --- Memoize available receiver cities based on senderCity ---
  const availableReceiverCities = useMemo(() => {
    if (!senderCity) return [];
    const found = cityOptions.find(
      (item) => String(item.sender_city.name) === senderCity
    );
    return found ? found.receiver_cities : [];
  }, [cityOptions, senderCity]);

  // --- When city options are available, initialize local state from server data ---
  useEffect(() => {
    if (cityOptions.length > 0) {
      if (data?.characteristic?.sender_city) {
        setSenderCity(data.characteristic.sender_city);
      }
      if (data?.characteristic?.receiver_city) {
        setReceiverCity(data.characteristic.receiver_city);
      }
    }
  }, [cityOptions, data]);

  // --- Update parent state when cargoCost, senderCity, additionalInfo change ---
  useEffect(() => {
    // Look up the sender city object from uniqueSenderCities.
    const senderObj = uniqueSenderCities.find(
      (city) => String(city.name) === senderCity
    );
    setData((prevData: any) => ({
      ...prevData,
      characteristic: {
        ...prevData?.characteristic,
        cargo_cost: cargoCost,
        sender_city: senderObj?.name || senderCity,
        additional_info: additionalInfo,
      },
    }));
  }, [cargoCost, senderCity, additionalInfo, setData, uniqueSenderCities]);

  // --- Update parent state for receiverCity ---
  useEffect(() => {
    const receiverObj = availableReceiverCities.find(
      (city) => String(city.name) === receiverCity
    );
    setData((prevData: any) => ({
      ...prevData,
      characteristic: {
        ...prevData?.characteristic,
        receiver_city: receiverObj?.name || receiverCity,
      },
    }));
  }, [receiverCity, setData, availableReceiverCities]);

  // --- Update parent state for packages ---
  useEffect(() => {
    setData((prevData: any) => ({
      ...prevData,
      cargo: packages,
    }));
  }, [packages, setData]);

  // --- Add a new package ---
  const handleAddPackage = () => {
    setPackages((prev: any) => [
      ...prev,
      {
        characteristics: "", // will store the display name after selection
        slots: "0",
        weight: "0",
        dimensions: {
          length: "0",
          width: "0",
          height: "0",
          amount: "0",
        },
      },
    ]);
  };

  // --- Generic handler to update package values ---
  const handleChange = (index: number, field: string, value: any) => {
    setPackages((prev: any) => {
      const newPackages = [...prev];
      if (field.includes(".")) {
        const [parent, child] = field.split(".");
        newPackages[index] = {
          ...newPackages[index],
          [parent]: {
            ...newPackages[index][parent],
            [child]: value,
          },
        };
      } else {
        newPackages[index] = {
          ...newPackages[index],
          [field]: value,
        };
      }
      return newPackages;
    });
  };

  // --- Inline component for package characteristic dropdown ---
  const PackageCharacteristicDropdown = ({
    index,
    currentValue,
    onSelect,
  }: {
    index: number;
    currentValue: string;
    onSelect: (val: string) => void;
  }) => {
    const [open, setOpen] = useState(false);
    const toggleOpen = () => setOpen((prev) => !prev);
    return (
      <div className="relative">
        <button
          onClick={toggleOpen}
          className="w-full border bg-white hover:bg-white border-gray-300 rounded-md p-2 text-left focus:outline-none focus:ring-2 focus:ring-[#09BD3C]"
        >
          {currentValue || "Выберите характеристику груза"}
        </button>
        {open && (
          <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-auto">
            {packageOptions.map((option) => (
              <li
                key={option.id}
                onClick={() => {
                  onSelect(option.name_ru);
                  setOpen(false);
                }}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {option.name_ru}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  // --- Render UI ---
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8 relative">
      <h2 className="text-lg font-semibold mb-4 text-[#1D1B23]">
        Характер и Вес Груза
      </h2>

      {/* Cargo Cost Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-[#1D1B23] mb-1">
          Стоимость груза
        </label>
        <input
          type="text"
          value={cargoCost}
          onChange={(e) => setCargoCost(e.target.value)}
          placeholder="Укажите стоимость"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#09BD3C]"
        />
      </div>

      {/* Cities Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 relative">
        {/* Sender City */}
        <div>
          <label className="block text-sm font-medium text-[#1D1B23] mb-1">
            Город отправителя
          </label>
          <button
            onClick={() => {
              setSenderDropdownOpen((prev) => !prev);
              setReceiverDropdownOpen(false);
            }}
            className="w-full border bg-white hover:bg-white border-gray-300 rounded-md p-2 text-left focus:outline-none focus:ring-2 focus:ring-[#09BD3C]"
          >
            {senderCity || "Выберите город отправителя"}
          </button>
          {senderDropdownOpen && (
            <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-auto">
              {uniqueSenderCities.map((city) => (
                <li
                  key={city.id}
                  onClick={() => {
                    setSenderCity(city.name);
                    setSenderDropdownOpen(false);
                    setReceiverCity(""); // reset receiver when sender changes
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {city.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Receiver City */}
        <div>
          <label className="block text-sm font-medium text-[#1D1B23] mb-1">
            Город получателя
          </label>
          <button
            onClick={() => setReceiverDropdownOpen((prev) => !prev)}
            disabled={!senderCity}
            className="w-full border bg-white hover:bg-white border-gray-300 rounded-md p-2 text-left focus:outline-none focus:ring-2 focus:ring-[#09BD3C]"
          >
            {receiverCity || "Выберите город получателя"}
          </button>
          {receiverDropdownOpen && (
            <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-auto">
              {availableReceiverCities.map((city: any) => (
                <li
                  key={city.id}
                  onClick={() => {
                    setReceiverCity(city.name);
                    setReceiverDropdownOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {city.name}
                </li>
              ))}
            </ul>
          )}
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
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#09BD3C]"
          rows={3}
        />
      </div>

      {/* Package (Cargo) Details */}
      <div className="space-y-6">
        {packages.map((pkg: any, index: number) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 mb-4"
          >
            <h3 className="text-lg font-semibold mb-4 text-[#1D1B23]">
              Груз №{index + 1}
            </h3>
            <div className="mb-2">
              <label className="block text-sm font-medium text-[#1D1B23] mb-1">
                Характеристика груза
              </label>
              <PackageCharacteristicDropdown
                index={index}
                currentValue={pkg.characteristics}
                onSelect={(val: string) =>
                  handleChange(index, "characteristics", val)
                }
              />
            </div>
            {/* Other package inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-2">
                <label className="block text-sm font-medium text-[#1D1B23] mb-1">
                  Слоты
                </label>
                <input
                  type="number"
                  value={pkg.slots}
                  onChange={(e) => handleChange(index, "slots", e.target.value)}
                  placeholder="Количество"
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#09BD3C]"
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium text-[#1D1B23] mb-1">
                  Вес
                </label>
                <input
                  type="number"
                  value={pkg.weight}
                  onChange={(e) =>
                    handleChange(index, "weight", e.target.value)
                  }
                  placeholder="Вес"
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#09BD3C]"
                />
              </div>
            </div>
            {/* Dimensions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-[#1D1B23] mb-1">
                  Длина
                </label>
                <input
                  type="number"
                  value={pkg.dimensions?.length || ""}
                  onChange={(e) =>
                    handleChange(index, "dimensions.length", e.target.value)
                  }
                  placeholder="Длина"
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#09BD3C]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1D1B23] mb-1">
                  Ширина
                </label>
                <input
                  type="number"
                  value={pkg.dimensions?.width || ""}
                  onChange={(e) =>
                    handleChange(index, "dimensions.width", e.target.value)
                  }
                  placeholder="Ширина"
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#09BD3C]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1D1B23] mb-1">
                  Высота
                </label>
                <input
                  type="number"
                  value={pkg.dimensions?.height || ""}
                  onChange={(e) =>
                    handleChange(index, "dimensions.height", e.target.value)
                  }
                  placeholder="Высота"
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#09BD3C]"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() =>
                  setPackages((prev: any) =>
                    prev.filter((_: any, i: number) => i !== index)
                  )
                }
                className="text-gray-500 bg-transparent hover:bg-transparent hover:text-red-500"
              >
                🗑️ Удалить
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleAddPackage}
        className="mt-4 bg-yellow-300 text-black rounded-md px-4 py-2 hover:bg-yellow-400 text-sm font-semibold"
      >
        + Добавить еще
      </button>
    </div>
  );
};

export default PackageCharacteristics;
