import React from "react";

const TransportInfo: React.FC = () => {
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
            placeholder="Введите авто"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#09BD3C] focus:border-transparent"
          />
        </div>

        <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Госномер
          </label>
          <input
            type="text"
            placeholder="Введите госномер"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#09BD3C] focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
};

export default TransportInfo;
