import React from "react";

const DriverInfo: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Данные о транспорте</h2>
      <div className="space-y-6">
        {/* Full Name */}
        <div>
          <label className="text-gray-600 text-sm mb-1 block">
            № Уд. личности
          </label>
          <input
            type="text"
            value="Байбурин Аслан"
            readOnly
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
            value="№ 04734582"
            readOnly
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-800 focus:outline-none focus:ring focus:ring-gray-300"
          />
        </div>

        {/* Tech Passport */}
        <div>
          <label className="text-gray-600 text-sm mb-1 block">Техпаспорт</label>
          <input
            type="text"
            value="№ 04734582"
            readOnly
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-800 focus:outline-none focus:ring focus:ring-gray-300"
          />
        </div>
      </div>
    </div>
  );
};

export default DriverInfo;
