"use client";
import React, { useState } from "react";
import { FaSlidersH } from "react-icons/fa";
import { FiX } from "react-icons/fi";

const FilterPanel: React.FC = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");

  const handleSearch = () => {
    if (query) {
      setResult(`Результат для "${query}"`);
    } else {
      setResult("Нет данных");
    }
  };

  return (
    <div className="bg-white p-4 mb-4 rounded-lg text-[#1D1B23]">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск"
            className="bg-white rounded px-4 py-2 text-sm w-[20vw] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-4 ml-10">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="form-checkbox appearance-none bg-white border-2 checked:bg-[#09BD3C] checked:border-none checked:before:content-['✔'] checked:before:text-white checked:before:text-sm checked:before:flex checked:before:items-center checked:before:justify-center w-5 h-5 rounded mr-2"
            />
            <span className="font-medium text-[#1D1B23]">Статус</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              className="form-checkbox appearance-none bg-white border-2 checked:bg-[#09BD3C] checked:border-none checked:before:content-['✔'] checked:before:text-white checked:before:text-sm checked:before:flex checked:before:items-center checked:before:justify-center w-5 h-5 rounded mr-2"
            />
            <span className="font-medium text-[#1D1B23]">Мои</span>
          </label>
        </div>
      </div>

      {/* Full-width Second Row */}
      <div className="w-full flex flex-wrap gap-4 items-center justify-between text-[#3C3C3C]">
        <div className="flex flex-wrap items-center gap-4 w-full">
          <div className="flex flex-col">
            <label className="text-sm font-medium">Номер</label>
            <input
              type="text"
              placeholder="#001234"
              className="bg-white border-b-2 border-gray-300 focus:outline-none focus:border-gray-500 p-1 w-40"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium">Дата начало</label>
            <input
              type="date"
              defaultValue="2020-01-29"
              className="bg-white border-b-2 border-gray-300 focus:outline-none focus:border-gray-500 p-1 w-52"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium">Дата окончание</label>
            <input
              type="date"
              defaultValue="2020-01-29"
              className="bg-white border-b-2 border-gray-300 focus:outline-none focus:border-gray-500 p-1 w-52"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium">Город отправителя</label>
            <select className="bg-white border-b-2 border-gray-300 focus:outline-none focus:border-gray-500 p-1 w-52">
              <option>Актау</option>
              {/* Add more options here */}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium">Город получателя</label>
            <select className="bg-white border-b-2 border-gray-300 focus:outline-none focus:border-gray-500 p-1 w-52">
              <option>Астана</option>
              {/* Add more options here */}
            </select>
          </div>
          <button className="bg-[#FD5353] hover:bg-red-600 text-white px-4 py-4 rounded-lg border none flex items-center">
            <FiX size={26} className="mr-2" />
            Очистить фильтр
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
