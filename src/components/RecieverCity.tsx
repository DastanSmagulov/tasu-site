import React from "react";

const DeliveryCity: React.FC = () => {
  // Sample options for the dropdowns
  const countries = ["Казахстан", "Россия", "США", "Канада"];
  const cities = ["Астана", "Алматы", "Москва", "Нью-Йорк", "Торонто"];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-auto">
      <h2 className="text-lg font-semibold mb-6">Город получателя</h2>

      <div className="flex gap-4 mb-4">
        <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Страна
          </label>
          <select
            defaultValue="Казахстан" // Set default value to Kazakhstan
            className="w-full border border-gray-300 text-[#3D516E] rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#09BD3C] focus:border-transparent"
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
            defaultValue="Астана" // Set default value to Astana
            className="w-full border border-gray-300 text-[#3D516E] rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#09BD3C] focus:border-transparent"
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
