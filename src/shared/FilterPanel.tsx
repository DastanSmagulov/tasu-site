"use client";
import Checkbox from "@/components/ui/CheckBox";
import React, { useState } from "react";

const FilterPanel: React.FC = () => {
  const [query, setQuery] = useState("");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  return (
    <div className="bg-white p-4 mb-4 rounded-lg text-[#1D1B23] shadow-md">
      {/* First Row */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        {/* Search Bar */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск"
          className="bg-white rounded px-4 py-2 text-sm w-full md:w-[20vw] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-6">
          <div className="relative">
            {/* Dropdown Toggle */}
            <button
              className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900 bg-transparent hover:bg-transparent"
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            >
              Статус
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 transition-transform ${
                  showStatusDropdown ? "rotate-180" : ""
                }`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showStatusDropdown && (
              <ul className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-md shadow-md w-40 text-sm">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Все
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Активный
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Завершенный
                </li>
              </ul>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Checkbox />
            <span className="text-sm font-medium">Мои</span>
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 text-sm">
        {/* Number Input */}
        <div className="flex flex-col">
          <label className="font-medium mb-1">Номер</label>
          <input
            type="text"
            placeholder="Найти номер"
            className="bg-white border-b border-gray-300 focus:outline-none focus:border-gray-500 px-2 py-1"
          />
        </div>

        {/* Start Date */}
        <div className="flex flex-col">
          <label className="font-medium mb-1">Дата начало</label>
          <input
            type="date"
            className="bg-white border-b border-gray-300 focus:outline-none focus:border-gray-500 px-2 py-1"
          />
        </div>

        {/* End Date */}
        <div className="flex flex-col">
          <label className="font-medium mb-1">Дата окончание</label>
          <input
            type="date"
            className="bg-white border-b border-gray-300 focus:outline-none focus:border-gray-500 px-2 py-1"
          />
        </div>

        {/* Sender City */}
        <div className="flex flex-col">
          <label className="font-medium mb-1">Город отправителя</label>
          <select className="bg-white border-b border-gray-300 focus:outline-none focus:border-gray-500 px-2 py-1">
            <option>Указать город</option>
            {/* Add more options here */}
          </select>
        </div>

        {/* Receiver City */}
        <div className="flex flex-col">
          <label className="font-medium mb-1">Город получателя</label>
          <select className="bg-white border-b border-gray-300 focus:outline-none focus:border-gray-500 px-2 py-1">
            <option>Указать город</option>
            {/* Add more options here */}
          </select>
        </div>

        {/* Clear Filter Button */}
        <div className="flex flex-col justify-end">
          <button className="bg-red-500 text-white font-medium text-sm px-4 py-2 rounded-lg hover:bg-red-600 shadow-md w-full">
            Очистить фильтр <span className="ml-1">X</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
