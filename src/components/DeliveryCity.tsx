import React from "react";

const DeliveryCity: React.FC = () => {
  const cities = ["Астана", "Алматы", "Москва", "Нью-Йорк", "Торонто"];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-auto">
      <h2 className="text-lg font-semibold mb-6">Выбор Городов</h2>

      <div className="flex gap-4">
        {/* Sender City */}
        <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Город отправителя
          </label>
          <select
            defaultValue="Алматы"
            className="w-full border border-gray-300 rounded-lg p-2 text-[#3D516E] focus:outline-none focus:ring-2 focus:ring-[#09BD3C] bg-white appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22%233D516E%22%3E%3Cpath d=%22M7 10l5 5 5-5H7z%22/%3E%3C/svg%3E')] bg-no-repeat bg-right bg-[length:1rem]"
          >
            {cities.map((city, index) => (
              <option key={index} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Receiver City */}
        <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Город получателя
          </label>
          <select
            defaultValue="Астана"
            className="w-full border border-gray-300 rounded-lg p-2 text-[#3D516E] focus:outline-none focus:ring-2 focus:ring-[#09BD3C] bg-white appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22%233D516E%22%3E%3Cpath d=%22M7 10l5 5 5-5H7z%22/%3E%3C/svg%3E')] bg-no-repeat bg-right bg-[length:1rem]"
          >
            {cities.map((city, index) => (
              <option key={index} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default DeliveryCity;
