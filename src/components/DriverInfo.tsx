import { ActDataProps } from "@/helper/types";
import React, { useState, useEffect } from "react";

const DriverInfo: React.FC<ActDataProps> = ({ data, setData }) => {
  const [driverInfo, setDriverInfo] = useState({
    full_name: "",
    id_card_number: "",
    technical_passport: "",
  });

  // Load initial data when component mounts or when data changes
  useEffect(() => {
    if (data?.driver_data) {
      setDriverInfo({
        full_name: data.driver_data.full_name || "",
        id_card_number: data.driver_data.id_card_number || "",
        technical_passport: data.driver_data.technical_passport || "",
      });
    }
  }, [data]);

  // Handle input changes and update both local and parent state at once
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedDriverInfo = { ...driverInfo, [name]: value };
    setDriverInfo(updatedDriverInfo);
    setData((prevData: any) => ({
      ...prevData,
      driver_data: updatedDriverInfo,
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Данные о транспорте</h2>
      <div className="space-y-6">
        {/* Full Name */}
        <div>
          <label className="text-gray-600 text-sm mb-1 block">ФИО</label>
          <input
            type="text"
            name="full_name"
            value={driverInfo.full_name}
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
            value={driverInfo.id_card_number}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-800 focus:outline-none focus:ring focus:ring-gray-300"
          />
        </div>

        {/* Tech Passport */}
        <div>
          <label className="text-gray-600 text-sm mb-1 block">Техпаспорт</label>
          <input
            type="text"
            name="technical_passport"
            value={driverInfo.technical_passport}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-800 focus:outline-none focus:ring focus:ring-gray-300"
          />
        </div>
      </div>
    </div>
  );
};

export default DriverInfo;
