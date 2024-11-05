"use client";

import React, { useState } from "react";

const Insurance: React.FC = () => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleSubmit = () => {
    // Logic for submitting the form
    if (isChecked) {
      alert("Form submitted successfully!");
    } else {
      alert("Please confirm the terms by checking the box.");
    }
  };

  const handlePrint = () => {
    // Logic for printing the content
    window.print();
  };

  const handleSave = () => {
    // Logic for saving the form (could be an API call)
    alert("Form saved!");
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Страховка</h2>
      <p className="mb-4">
        В случае отказа клиентом от страхование груза, компания TOO Tasu
        Kazakhstan не несет ответственности за частичное или полное повреждение
        при транспортировке до места назначения груза. Груз принят без
        внутреннего осмотра.
      </p>
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          id="insuranceCheck"
          checked={isChecked}
          onChange={handleCheckboxChange}
          className="mr-2"
        />
        <label htmlFor="insuranceCheck">
          Подпись отправителя или его агента
        </label>
      </div>
      <div className="flex gap-4">
        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Отправить
        </button>
        <button
          onClick={handlePrint}
          className="border border-black text-black px-4 py-2 rounded"
        >
          Распечатать
        </button>
        <button
          onClick={handleSave}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Сохранить
        </button>
      </div>
    </div>
  );
};

export default Insurance;
