import { ActDataProps } from "@/helper/types";
import React, { useState, useEffect } from "react";

const TransportInfo: React.FC<ActDataProps> = ({ data, setData }) => {
  const [vehicleInfo, setVehicleInfo] = useState({
    auto_info: "",
    license_plate: "",
  });

  // Load initial vehicle_data from parent's data, if available.
  useEffect(() => {
    if (data?.vehicle_data) {
      setVehicleInfo({
        auto_info: data.vehicle_data.auto_info || "",
        license_plate: data.vehicle_data.license_plate || "",
      });
    }
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedVehicleInfo = { ...vehicleInfo, [name]: value };
    setVehicleInfo(updatedVehicleInfo);
    setData((prevData: any) => ({
      ...prevData,
      vehicle_data: updatedVehicleInfo,
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Информация о транспорте</h2>
      <div className="flex gap-4 mb-4">
        <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Авто
          </label>
          <input
            type="text"
            name="auto_info"
            placeholder="Введите авто"
            value={data?.vehicle_data.auto_info}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#09BD3C] focus:border-transparent"
          />
        </div>

        <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Госномер
          </label>
          <input
            type="text"
            name="license_plate"
            placeholder="Введите госномер"
            value={data?.vehicle_data.license_plate}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#09BD3C] focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
};

export default TransportInfo;
