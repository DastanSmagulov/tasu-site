"use client";
import React, { useState } from "react";

const Shipping = () => {
  const [senderName, setSenderName] = useState(""); // Sender's full name
  const [recipientName, setRecipientName] = useState(""); // Recipient's full name
  const [selectedPayer, setSelectedPayer] = useState("sender"); // Radio button state

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* Section Header */}
      <h2 className="text-lg font-semibold mb-4">Перевозка</h2>

      {/* Grid Layout */}
      <div className="grid grid-cols-3 gap-4 items-center">
        {/* Sender Name Input */}
        <div className="col-span-1">
          <input
            type="text"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            placeholder="Укажите ФИО"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#09BD3C]"
          />
        </div>

        {/* Sender Dropdown */}
        <div className="col-span-1">
          <select className="w-full border border-gray-300 rounded-md p-2 bg-white">
            <option>Отправитель</option>
          </select>
        </div>

        {/* Radio Button */}
        <div className="col-span-1 flex items-center justify-end">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="payer"
              value="sender"
              checked={selectedPayer === "sender"}
              onChange={() => setSelectedPayer("sender")}
              className="form-radio text-yellow-400"
            />
            <span className="ml-2"> </span>
          </label>
        </div>

        {/* Recipient Name Input */}
        <div className="col-span-1">
          <input
            type="text"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            placeholder="Укажите ФИО"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#09BD3C]"
          />
        </div>

        {/* Recipient Dropdown */}
        <div className="col-span-1">
          <select className="w-full border border-gray-300 rounded-md p-2 bg-white">
            <option>Получатель</option>
          </select>
        </div>

        {/* Second Radio Button */}
        <div className="col-span-1 flex items-center justify-end">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="payer"
              value="recipient"
              checked={selectedPayer === "recipient"}
              onChange={() => setSelectedPayer("recipient")}
              className="form-radio text-gray-400"
            />
            <span className="ml-2"> </span>
          </label>
        </div>
      </div>

      {/* Right-aligned Label */}
      <div className="text-sm text-gray-500 text-right mt-2">
        Выберите плательщика
      </div>
    </div>
  );
};

export default Shipping;
