"use client";
import React, { useState } from "react";

const Shipping = () => {
  const [senderName, setSenderName] = useState(""); // Sender's full name
  const [recipientName, setRecipientName] = useState(""); // Recipient's full name
  const [selectedPayer, setSelectedPayer] = useState("sender"); // Radio button state

  return (
    <div className="bg-white p-6 rounded-lg shadow-md relative">
      {/* Section Header */}
      <h2 className="text-lg font-semibold mb-4 text-[#1D1B23]">Перевозка</h2>

      {/* Grid Layout */}
      <div className="grid grid-cols-3 gap-4 items-center">
        {/* Sender Name Input */}
        <div className="col-span-1">
          <input
            type="text"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            placeholder="Укажите ФИО"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#09BD3C]"
          />
        </div>

        {/* Sender Dropdown */}
        <div className="col-span-1">
          <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#09BD3C]">
            <option>Отправитель</option>
          </select>
        </div>

        {/* Radio Button for Sender */}
        <div className="col-span-1 flex items-center justify-end">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="radio"
              name="payer"
              value="sender"
              checked={selectedPayer === "sender"}
              onChange={() => setSelectedPayer("sender")}
              className="hidden"
            />
            <span
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedPayer === "sender"
                  ? "border-customYellow"
                  : "border-gray-400"
              }`}
            >
              {selectedPayer === "sender" && (
                <span className="w-2.5 h-2.5 rounded-full bg-customYellow" />
              )}
            </span>
          </label>
        </div>

        {/* Recipient Name Input */}
        <div className="col-span-1">
          <input
            type="text"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            placeholder="Укажите ФИО"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#09BD3C]"
          />
        </div>

        {/* Recipient Dropdown */}
        <div className="col-span-1">
          <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#09BD3C]">
            <option>Получатель</option>
          </select>
        </div>

        {/* Radio Button for Recipient */}
        <div className="col-span-1 flex items-center justify-end">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="radio"
              name="payer"
              value="recipient"
              checked={selectedPayer === "recipient"}
              onChange={() => setSelectedPayer("recipient")}
              className="hidden"
            />
            <span
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedPayer === "recipient"
                  ? "border-customYellow"
                  : "border-gray-400"
              }`}
            >
              {selectedPayer === "recipient" && (
                <span className="w-2.5 h-2.5 rounded-full bg-customYellow" />
              )}
            </span>
          </label>
        </div>
      </div>

      {/* Right-aligned Label */}
      <div className="absolute top-0 right-0 mt-4 mr-6 text-sm text-gray-500">
        Выберите плательщика
      </div>
    </div>
  );
};

export default Shipping;
