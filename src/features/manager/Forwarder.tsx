import React, { useState } from "react";

const Forwarder: React.FC = () => {
  const [fullName, setFullName] = useState(""); // State for the full name input
  const [phoneNumber, setPhoneNumber] = useState(""); // State for the phone number input
  const [address, setAddress] = useState(""); // State for the address input

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
      {/* Title */}
      <div className="flex items-center">
        <h2 className="text-lg font-semibold mb-6 text-[#1D1B23]">
          Экспедитор
        </h2>
      </div>

      {/* Full Name Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Экспедитор
        </label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Введите ФИО"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-transparent"
        />
      </div>

      {/* Phone Number Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Телефон
        </label>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Укажите номер телефона"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-transparent"
        />
      </div>

      {/* Address Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Адрес
        </label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Введите адрес для доставки"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-transparent"
        />
      </div>
    </div>
  );
};

export default Forwarder;
