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

  // --- Synchronize parent's data to local state on every change ---
  useEffect(() => {
    if (data) {
      setCargoCost(data?.characteristic?.cargo_cost || "");
      setSenderCity(data?.characteristic?.sender_city || "");
      setReceiverCity(data?.characteristic?.receiver_city || "");
      setAdditionalInfo(data?.characteristic?.additional_info || "");
      setPackages(data?.cargo || []);
    }
  }, [data]);

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

  // --- Update parent state when cargoCost, senderCity, additionalInfo change ---
  useEffect(() => {
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
        characteristics: null, // Will store the characteristic id
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
  interface PackageCharacteristicDropdownProps {
    index: number;
    currentValue: number | null; // expecting the id
    onSelect: (val: number) => void;
  }

  const PackageCharacteristicDropdown: React.FC<
    PackageCharacteristicDropdownProps
  > = ({ index, currentValue, onSelect }) => {
    const [open, setOpen] = useState(false);
    const toggleOpen = () => setOpen((prev) => !prev);

    // Find the selected option by its id and show its display label.
    const selectedOption = packageOptions.find((opt) =>
      typeof currentValue === "string"
        ? opt.name_ru + "" === currentValue + ""
        : opt.id === currentValue
    );
    const displayValue = selectedOption
      ? selectedOption.name_ru
      : "Выберите характеристику груза";

    return (
      <div className="relative">
        <button
          onClick={toggleOpen}
          className="w-full border bg-white hover:bg-white border-gray-300 rounded-md p-2 text-left text-sm focus:outline-none focus:ring-2 focus:ring-[#09BD3C]"
        >
          {displayValue}
        </button>
        {open && (
          <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-auto text-sm">
            {packageOptions.map((option) => (
              <li
                key={option.id}
                onClick={() => {
                  onSelect(option.id);
                  setOpen(false);
                }}
                className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
              >
                {option.name_ru}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

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
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#09BD3C] text-sm"
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
            className="w-full border bg-white hover:bg-white border-gray-300 rounded-md p-2 text-left text-sm focus:outline-none focus:ring-2 focus:ring-[#09BD3C]"
          >
            {data?.characteristic?.sender_city || "Выберите город отправителя"}
          </button>
          {senderDropdownOpen && (
            <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-auto text-sm">
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
            className="w-full border bg-white hover:bg-white border-gray-300 rounded-md p-2 text-left text-sm focus:outline-none focus:ring-2 focus:ring-[#09BD3C]"
          >
            {data?.characteristic?.receiver_city || "Выберите город получателя"}
          </button>
          {receiverDropdownOpen && (
            <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-auto text-sm">
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
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#09BD3C] text-sm"
          rows={3}
        />
      </div>

      {/* Package (Cargo) Details as a Table */}
      <div className="overflow-x-auto mb-4 max-w-full md:max-w-3xl mx-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                №
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Характеристика груза
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Слоты
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Вес
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Длина
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ширина
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Высота
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {packages.map((pkg: any, index: number) => (
              <tr key={index}>
                <td className="px-4 py-2 whitespace-nowrap">{index + 1}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <PackageCharacteristicDropdown
                    index={index}
                    currentValue={
                      pkg.characteristics ? pkg.characteristics : null
                    }
                    onSelect={(val: number) =>
                      handleChange(index, "characteristics", val)
                    }
                  />
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <input
                    type="number"
                    value={pkg.slots}
                    onChange={(e) =>
                      handleChange(index, "slots", e.target.value)
                    }
                    placeholder="Слоты"
                    className="border border-gray-300 rounded-md p-1 w-16 text-sm"
                  />
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <input
                    type="number"
                    value={pkg.weight}
                    onChange={(e) =>
                      handleChange(index, "weight", e.target.value)
                    }
                    placeholder="Вес"
                    className="border border-gray-300 rounded-md p-1 w-16 text-sm"
                  />
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <input
                    type="number"
                    value={pkg.dimensions?.length || ""}
                    onChange={(e) =>
                      handleChange(index, "dimensions.length", e.target.value)
                    }
                    placeholder="Длина"
                    className="border border-gray-300 rounded-md p-1 w-16 text-sm"
                  />
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <input
                    type="number"
                    value={pkg.dimensions?.width || ""}
                    onChange={(e) =>
                      handleChange(index, "dimensions.width", e.target.value)
                    }
                    placeholder="Ширина"
                    className="border border-gray-300 rounded-md p-1 w-16 text-sm"
                  />
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <input
                    type="number"
                    value={pkg.dimensions?.height || ""}
                    onChange={(e) =>
                      handleChange(index, "dimensions.height", e.target.value)
                    }
                    placeholder="Высота"
                    className="border border-gray-300 rounded-md p-1 w-16 text-sm"
                  />
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <button
                    onClick={() =>
                      setPackages((prev: any) =>
                        prev.filter((_: any, i: number) => i !== index)
                      )
                    }
                    className="bg-transparent hover:bg-transparent text-red-500"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
