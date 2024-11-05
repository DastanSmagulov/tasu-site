import React from "react";

const Reciever: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-6">Получатель</h2>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        ФИО ?
      </label>
      <input
        type="text"
        placeholder="Введите получателя"
        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#09BD3C] focus:border-transparent"
      />
    </div>
  );
};

export default Reciever;
