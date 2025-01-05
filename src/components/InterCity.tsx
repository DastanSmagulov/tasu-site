"use client";

import React, { useState } from "react";

const InterCity: React.FC = () => {
  const [senderCity, setSenderCity] = useState("Алматы");
  const [receiverCity, setReceiverCity] = useState("Астана");

  return (
    <div className="bg-white p-6 rounded-lg shadow text-gray-800">
      <h2 className="text-lg font-bold mb-4">Междугородие</h2>
      <div className="flex gap-6">
        {/* Sender City */}
        <div className="flex flex-col w-1/2">
          <label
            htmlFor="senderCity"
            className="text-sm font-medium text-gray-600 mb-2"
          >
            Город отправителя
          </label>
          <select
            id="senderCity"
            value={senderCity}
            onChange={(e) => setSenderCity(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Алматы">Алматы</option>
            <option value="Астана">Астана</option>
            <option value="Шымкент">Шымкент</option>
            <option value="Караганда">Караганда</option>
          </select>
        </div>

        {/* Receiver City */}
        <div className="flex flex-col w-1/2">
          <label
            htmlFor="receiverCity"
            className="text-sm font-medium text-gray-600 mb-2"
          >
            Город получателя
          </label>
          <select
            id="receiverCity"
            value={receiverCity}
            onChange={(e) => setReceiverCity(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Алматы">Алматы</option>
            <option value="Астана">Астана</option>
            <option value="Шымкент">Шымкент</option>
            <option value="Караганда">Караганда</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default InterCity;
