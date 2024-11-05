import React from "react";

const CustomerContacts: React.FC = () => {
  // Sample options for the dropdowns
  const countries = ["США", "Канада", "Россия", "Казахстан"];
  const cities = ["Нью-Йорк", "Торонто", "Москва", "Алматы"];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-auto">
      <h2 className="text-lg font-semibold mb-4">Контакты клиента</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Телефон
        </label>
        <input
          type="tel"
          placeholder="Введите номер телефона"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#09BD3C] focus:border-transparent"
        />
      </div>

      <div className="flex gap-4 mb-4">
        <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Страна
          </label>
          <select className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#09BD3C] focus:border-transparent">
            <option value="" disabled selected>
              Выберите страну
            </option>
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
          <select className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#09BD3C] focus:border-transparent">
            <option value="" disabled selected>
              Выберите город
            </option>
            {cities.map((city, index) => (
              <option key={index} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Адрес
        </label>
        <input
          type="text"
          placeholder="Введите адрес"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#09BD3C] focus:border-transparent"
        />
      </div>
    </div>
  );
};

export default CustomerContacts;
