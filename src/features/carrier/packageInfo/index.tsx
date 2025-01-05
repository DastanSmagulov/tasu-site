"use client";
import React, { useState } from "react";
import "../../../styles/globals.css";
import Logo from "@/components/ui/Logo";

const PackageInfo: React.FC = () => {
  const [brushColor, setBrushColor] = useState<string>("#000000");
  const [brushSize, setBrushSize] = useState<number>(2);

  return (
    <div className="p-8 bg-gray-50 flex flex-col items-center">
      {/* Container */}
      <Logo width={125} height={125} />

      <div className="bg-white shadow-lg rounded-lg p-6 max-w-2xl w-full flex flex-col justify-center items-center">
        {/* Header */}
        {/* Form Section */}
        <section className="mb-6">
          <h1 className="text-lg font-bold text-gray-900 mb-4">
            Информация о Получении Груза
          </h1>
          <div className="grid grid-cols-2 gap-4">
            {/* Issued By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Выдал
              </label>
              <input
                type="text"
                placeholder="Укажите ФИО"
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>
            {/* Issuer Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Выберите статус
              </label>
              <select className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-yellow-500 focus:border-yellow-500">
                <option>Выберите статус</option>
                <option>Статус 1</option>
                <option>Статус 2</option>
              </select>
            </div>
            {/* Received By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Принял
              </label>
              <input
                type="text"
                placeholder="Укажите ФИО"
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>
            {/* Receiver Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Выберите статус
              </label>
              <select className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-yellow-500 focus:border-yellow-500">
                <option>Выберите статус</option>
                <option>Статус 1</option>
                <option>Статус 2</option>
              </select>
            </div>
          </div>
        </section>

        {/* Date and Time */}
        <section className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Дата и время получения:
          </label>
          <input
            type="datetime-local"
            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-yellow-500 focus:border-yellow-500"
          />
        </section>

        {/* Signature Section */}
        <section className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Подпись Заказчика
          </h2>
          <div className="flex items-center gap-4 mb-4">
            {/* Brush Color */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Цвет кисти:
              </label>
              <input
                type="color"
                value={brushColor}
                onChange={(e) => setBrushColor(e.target.value)}
                className="ml-2 border border-gray-300 rounded-lg h-8 w-12"
              />
            </div>
            {/* Brush Size */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Размер кисти:
              </label>
              <div className="flex gap-2 ml-2">
                {[2, 4, 6, 8].map((size) => (
                  <button
                    key={size}
                    className={`h-6 w-6 rounded-full border ${
                      brushSize === size ? "bg-black text-white" : "bg-gray-300"
                    }`}
                    onClick={() => setBrushSize(size)}
                  />
                ))}
              </div>
            </div>
            {/* Upload Button */}
            <button className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200">
              <span>Загрузить подпись</span>
            </button>
          </div>
          {/* Canvas */}
          <div className="border border-gray-300 rounded-lg bg-gray-50 p-4 h-40">
            <canvas
              className="w-full h-full"
              style={{
                borderColor: brushColor,
                borderWidth: brushSize,
              }}
            />
          </div>
          {/* Clear and Confirm Buttons */}
          <div className="flex justify-between mt-4">
            <button className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300">
              Очистить
            </button>
            <button className="text-white py-2 px-4 rounded-lg">
              Подтвердить
            </button>
          </div>
        </section>
      </div>

      {/* Final Submit Button */}
      <button className="text-white py-3 px-6 rounded-lg w-full max-w-lg mt-6">
        Товар передан Клиенту
      </button>
    </div>
  );
};

export default PackageInfo;
