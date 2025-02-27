"use client";
import React, { FC, useState, useEffect } from "react";
import { ActDataProps } from "@/helper/types";
import { axiosInstance } from "@/helper/utils";

interface DriverOption {
  id: string;
  name?: string;
  train_number?: string;
  train_route?: string;
  railway_company?: string;
  flight_number?: string;
  airline?: string;
}

const DriverInfo: FC<ActDataProps> = ({ data, setData }) => {
  const transportationType = data?.transportation_type || "AUTO_SINGLE";
  const isManual = transportationType === "AUTO_SINGLE";

  // Local state for driver info
  const [driverInfo, setDriverInfo] = useState({
    full_name: data?.driver_data?.full_name || "",
    id_card_number: data?.driver_data?.id_card_number || "",
    technical_passport: data?.driver_data?.technical_passport || "",
    partner_id: data?.driver_data?.partner_id || "",
    plane_id: data?.driver_data?.plane_id || "",
    train_id: data?.driver_data?.train_id || "",
  });

  const [options, setOptions] = useState<DriverOption[]>([]);

  // Fetch options from the appropriate endpoint if not manual.
  useEffect(() => {
    if (!isManual) {
      let endpoint = "";
      if (transportationType === "AUTO_CONSOL") {
        endpoint = "/admin/partners/";
      } else if (transportationType === "AVIATION") {
        endpoint = "/admin/planes/";
      } else if (transportationType === "RAILWAY") {
        endpoint = "/admin/trains/";
      }
      if (endpoint) {
        axiosInstance
          .get(endpoint)
          .then((response) => {
            setOptions(response.data.results || []);
          })
          .catch((error) => console.error("Error fetching options:", error));
      }
    }
  }, [transportationType, isManual]);

  // Determine which id field to use based on transportationType.
  const selectedId =
    transportationType === "AUTO_CONSOL"
      ? driverInfo.partner_id
      : transportationType === "AVIATION"
      ? driverInfo.plane_id
      : transportationType === "RAILWAY"
      ? driverInfo.train_id
      : "";

  // Handle selecting an option.
  const handleOptionSelect = (option: DriverOption) => {
    // Build display string based on transportationType.
    const displayName =
      transportationType === "AUTO_CONSOL"
        ? option.name || ""
        : transportationType === "AVIATION"
        ? `${option.flight_number} (${option.airline})`
        : transportationType === "RAILWAY"
        ? `${option.train_number} - ${option.train_route} (${option.railway_company})`
        : "";

    // Update driverInfo with the appropriate id and display value.
    const updatedInfo = {
      ...driverInfo,
      partner_id: transportationType === "AUTO_CONSOL" ? option.id : "",
      plane_id: transportationType === "AVIATION" ? option.id : "",
      train_id: transportationType === "RAILWAY" ? option.id : "",
    };

    setDriverInfo(updatedInfo);
    setData((prev: any) => ({
      ...prev,
      driver_data: updatedInfo,
    }));

    console.log("Updated driverInfo:", updatedInfo);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updated = { ...driverInfo, [name]: value };
    setDriverInfo(updated);
    setData((prev: any) => ({
      ...prev,
      driver_data: { ...prev.driver_data, [name]: value },
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Данные о транспорте</h2>
      {isManual ? (
        <div className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="text-gray-600 text-sm mb-1 block">ФИО</label>
            <input
              type="text"
              name="full_name"
              value={data?.driver_data?.full_name || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-800 focus:outline-none focus:ring focus:ring-gray-300"
            />
          </div>
          {/* Identity Number */}
          <div>
            <label className="text-gray-600 text-sm mb-1 block">
              № Уд. личности
            </label>
            <input
              type="text"
              name="id_card_number"
              value={data?.driver_data?.id_card_number || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-800 focus:outline-none focus:ring focus:ring-gray-300"
            />
          </div>
          {/* Tech Passport */}
          <div>
            <label className="text-gray-600 text-sm mb-1 block">
              Техпаспорт
            </label>
            <input
              type="text"
              name="technical_passport"
              value={data?.driver_data?.technical_passport || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-800 focus:outline-none focus:ring focus:ring-gray-300"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Выберите транспортное средство
          </label>
          <select
            onChange={(e) => {
              const option = options.find((opt) => opt.id == e.target.value);
              if (option) {
                handleOptionSelect(option);
              }
            }}
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
            value={selectedId}
          >
            <option value="">Выберите</option>
            {options.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {transportationType === "AUTO_CONSOL"
                  ? opt.name
                  : transportationType === "AVIATION"
                  ? `${opt.flight_number} (${opt.airline})`
                  : transportationType === "RAILWAY"
                  ? `${opt.train_number} - ${opt.train_route} (${opt.railway_company})`
                  : ""}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default DriverInfo;
