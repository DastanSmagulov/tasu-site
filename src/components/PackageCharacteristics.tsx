"use client";
import React, {
  useState,
  useEffect,
  useCallback,
  FC,
  useRef,
  CSSProperties,
} from "react";
import { axiosInstance } from "@/helper/utils";
import { ActDataProps } from "@/helper/types";
import { createPortal } from "react-dom";

interface City {
  id: number;
  country: string;
  name_ru: string;
  name_kz: string;
  name_en: string;
}

interface PackageOption {
  id: number;
  name_ru: string;
}

interface GlobalPackageCharacteristicDropdownProps {
  currentValue: number | string | null;
  onSelect: (val: number) => void;
}

const PackageCharacteristics: FC<ActDataProps> = ({ data, setData }) => {
  // Use local state with fallbacks so that inputs are always controlled.
  const [cargoCost, setCargoCost] = useState(
    data?.characteristic?.cargo_cost ?? ""
  );
  const [senderCity, setSenderCity] = useState<number | string>(
    data?.characteristic?.sender_city ?? ""
  );
  const [receiverCity, setReceiverCity] = useState<number | string>(
    data?.characteristic?.receiver_city ?? ""
  );
  const [receiverAddress, setReceiverAddress] = useState(
    data?.characteristic?.receiver_address ?? ""
  );
  const [additionalInfo, setAdditionalInfo] = useState(
    data?.characteristic?.additional_info ?? ""
  );
  const [cargoCharacteristics, setCargoCharacteristics] = useState<
    number | string | null
  >(data?.cargo_characteristics ?? "");
  const [cargoSlots, setCargoSlots] = useState<number>(
    Number(data?.cargo_slots) || 0
  );
  const [packages, setPackages] = useState<any[]>(data?.cargo || []);

  // Other local states
  const [packageOptions, setPackageOptions] = useState<PackageOption[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [senderDropdownOpen, setSenderDropdownOpen] = useState(false);
  const [receiverDropdownOpen, setReceiverDropdownOpen] = useState(false);

  // --- Fetch package options ---
  useEffect(() => {
    const fetchPackageOptions = async () => {
      try {
        const response = await axiosInstance.get("/admin/characteristics/");
        setPackageOptions(response.data.results);
      } catch (error) {
        console.error("Error fetching package options:", error);
      }
    };
    fetchPackageOptions();
  }, []);

  // --- Fetch cities ---
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axiosInstance.get("/admin/cities");
        setCities(response.data.results);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    fetchCities();
  }, []);

  // --- Combine updating parent's state in one effect ---
  useEffect(() => {
    setData((prev: any) => ({
      ...prev,
      characteristic: {
        ...prev?.characteristic,
        cargo_cost: cargoCost,
        sender_city: senderCity,
        receiver_city: receiverCity,
        receiver_address: receiverAddress, // New field added here
        additional_info: additionalInfo,
      },
      cargo_characteristics: cargoCharacteristics,
      cargo_slots: cargoSlots,
      cargo: packages,
    }));
  }, [
    cargoCost,
    senderCity,
    receiverCity,
    receiverAddress,
    additionalInfo,
    cargoCharacteristics,
    cargoSlots,
    packages,
    setData,
  ]);

  // --- Helper Functions for Package Details ---
  const handleAddPackage = useCallback(() => {
    setPackages((prev) => [
      ...prev,
      {
        weight: "0",
        dimensions: {
          length: "0",
          width: "0",
          height: "0",
          amount: "0",
        },
      },
    ]);
  }, []);

  const handleChange = useCallback(
    (index: number, field: string, value: any) => {
      setPackages((prev) => {
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
          newPackages[index] = { ...newPackages[index], [field]: value };
        }
        return newPackages;
      });
    },
    []
  );

  // --- Global Package Characteristic Dropdown ---
  const GlobalPackageCharacteristicDropdown: FC<
    GlobalPackageCharacteristicDropdownProps
  > = ({ currentValue, onSelect }) => {
    const [open, setOpen] = useState(false);
    const [dropdownStyles, setDropdownStyles] = useState<CSSProperties>({});
    const buttonRef = useRef<HTMLButtonElement>(null);

    const toggleOpen = () => setOpen((prev) => !prev);

    useEffect(() => {
      if (open && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setDropdownStyles({
          position: "absolute",
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          zIndex: 1000,
        });
      }
    }, [open]);

    const selectedOption = packageOptions.find((opt) =>
      typeof currentValue === "string"
        ? opt.name_ru === currentValue
        : opt.id === currentValue
    );
    const displayValue = selectedOption
      ? selectedOption.name_ru
      : "Выберите характеристику груза";

    const dropdownList = (
      <ul
        className="bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto text-sm"
        style={dropdownStyles}
      >
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
    );

    return (
      <>
        <div className="relative">
          <button
            ref={buttonRef}
            onClick={toggleOpen}
            className="w-full border bg-white hover:bg-white border-gray-300 rounded-md p-2 text-left text-sm focus:outline-none focus:ring-2 focus:ring-[#09BD3C]"
          >
            {displayValue}
          </button>
        </div>
        {open && createPortal(dropdownList, document.body)}
      </>
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
          value={data?.characteristic?.cargo_cost || ""}
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
            {cities.find((city) => {
              return typeof senderCity === "number"
                ? city.id === senderCity
                : city.name_ru === data?.characteristic?.sender_city || "";
            })?.name_ru || "Выберите город отправителя"}
          </button>
          {senderDropdownOpen && (
            <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-auto text-sm">
              {cities.map((city) => (
                <li
                  key={city.id}
                  onClick={() => {
                    setSenderCity(city.name_ru);
                    setSenderDropdownOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {city.name_ru}
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
            {cities.find((city) => {
              return typeof receiverCity === "number"
                ? city.id === receiverCity
                : city.name_ru === data?.characteristic?.receiver_city || "";
            })?.name_ru || "Выберите город получателя"}
          </button>
          {receiverDropdownOpen && (
            <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-auto text-sm">
              {cities.map((city) => (
                <li
                  key={city.id}
                  onClick={() => {
                    setReceiverCity(city.name_ru);
                    setReceiverDropdownOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {city.name_ru}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Receiver Address Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-[#1D1B23] mb-1">
          Адрес получателя
        </label>
        <input
          type="text"
          value={data?.characteristic?.receiver_address || ""}
          onChange={(e) => setReceiverAddress(e.target.value)}
          placeholder="Введите адрес получателя"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#09BD3C] text-sm"
        />
      </div>

      {/* Additional Information */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-[#1D1B23] mb-1">
          Дополнительно
        </label>
        <textarea
          value={data?.characteristic?.additional_info || ""}
          onChange={(e) => setAdditionalInfo(e.target.value)}
          placeholder="Любые дополнения относительно характера груза и веса товара"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#09BD3C] text-sm"
          rows={3}
        />
      </div>

      {/* Global Cargo Characteristics */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-[#1D1B23] mb-1">
          Характеристика груза
        </label>
        <GlobalPackageCharacteristicDropdown
          currentValue={data?.cargo_characteristics || ""}
          onSelect={(val: number) => setCargoCharacteristics(val)}
        />
      </div>

      {/* Global Cargo Slots */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-[#1D1B23] mb-1">
          Количество мест
        </label>
        <input
          type="number"
          value={data?.cargo_slots || ""}
          onChange={(e) => setCargoSlots(Number(e.target.value))}
          placeholder="Укажите места"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#09BD3C] text-sm"
        />
      </div>

      <div className="overflow-x-auto mb-4 max-w-full md:max-w-3xl mx-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                №
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
                {data?.transportation_type == "AVIATION"
                  ? "Объемный вес"
                  : "Объем"}
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data?.cargo?.map((pkg, index) => (
              <tr key={index}>
                <td className="px-4 py-2 whitespace-nowrap">{index + 1}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <input
                    type="number"
                    value={pkg.weight || ""}
                    onChange={(e) =>
                      handleChange(index, "weight", Number(e.target.value))
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
                      handleChange(
                        index,
                        "dimensions.length",
                        Number(e.target.value)
                      )
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
                      handleChange(
                        index,
                        "dimensions.width",
                        Number(e.target.value)
                      )
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
                      handleChange(
                        index,
                        "dimensions.height",
                        Number(e.target.value)
                      )
                    }
                    placeholder="Высота"
                    className="border border-gray-300 rounded-md p-1 w-16 text-sm"
                  />
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {(() => {
                    const length = Number(pkg.dimensions?.length) || 0;
                    const width = Number(pkg.dimensions?.width) || 0;
                    const height = Number(pkg.dimensions?.height) || 0;
                    const volume = length * width * height;
                    return data?.transportation_type == "AVIATION"
                      ? (volume / 6000).toFixed(2)
                      : volume.toFixed(2);
                  })()}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <button
                    onClick={() =>
                      setPackages((prev) => prev.filter((_, i) => i !== index))
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
