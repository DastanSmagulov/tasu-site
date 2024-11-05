import React from "react";

const DeliveryCity: React.FC = () => {
  const countries = ["Казахстан", "Россия", "США", "Канада"];
  const cities = ["Астана", "Алматы", "Москва", "Нью-Йорк", "Торонто"];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-auto">
      <h2 className="text-lg font-semibold mb-6">Город отправления</h2>

      <div className="flex gap-4 mb-4">
        <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Страна
          </label>
          <select
            defaultValue="Казахстан"
            className="w-full border border-gray-300 text-[#3D516E] rounded-md p-2 pr-8 focus:outline-none focus:ring-2 focus:ring-[#09BD3C] focus:border-transparent appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22%233D516E%22%3E%3Cpath d=%22M7 10l5 5 5-5H7z%22/%3E%3C/svg%3E')] bg-no-repeat bg-right bg-[length:1rem]"
          >
            {countries.map((country, index) => (
              <option key={index} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Город
          </label>
          <select
            defaultValue="Астана"
            className="w-full border border-gray-300 rounded-md p-2 pr-8 text-[#3D516E] focus:outline-none focus:ring-2 focus:ring-[#09BD3C] focus:border-transparent appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22%233D516E%22%3E%3Cpath d=%22M7 10l5 5 5-5H7z%22/%3E%3C/svg%3E')] bg-no-repeat bg-right bg-[length:1rem]"
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
