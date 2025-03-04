"use client";
import React from "react";

interface DeliveryCityProps {
  senderCity: string;
  receiverCity: string;
  onChange: (sender: string, receiver: string) => void;
}

const DeliveryCity: React.FC<DeliveryCityProps> = ({
  senderCity,
  receiverCity,
  onChange,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-auto mb-6">
      <h2 className="text-lg font-semibold mb-6">Выбор Городов</h2>
      <div className="flex gap-4">
        <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Город отправителя
          </label>
          <input
            type="text"
            value={senderCity}
            onChange={(e) => onChange(e.target.value, receiverCity)}
            className="w-full border border-gray-300 rounded-lg p-2 text-[#3D516E] focus:outline-none focus:ring-2 focus:ring-[#09BD3C] bg-white"
          />
        </div>
        <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Город получателя
          </label>
          <input
            type="text"
            value={receiverCity}
            onChange={(e) => onChange(senderCity, e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 text-[#3D516E] focus:outline-none focus:ring-2 focus:ring-[#09BD3C] bg-white"
          />
        </div>
      </div>
    </div>
  );
};

export default DeliveryCity;
