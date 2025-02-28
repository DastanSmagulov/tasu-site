"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Search from "../../public/icons/search.svg";
import { axiosInstance } from "@/helper/utils";
import { City } from "@/helper/types";

interface Status {
  key: string;
  value: string;
}

interface FilterPanelProps {
  filters: any;
  setFilters: (filters: any) => void;
  warehouse: boolean;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  warehouse,
  filters,
  setFilters,
}) => {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);

  useEffect(() => {
    // Fetch cities
    const fetchCities = async () => {
      try {
        const response = await axiosInstance.get("/admin/cities/");
        setCities(response.data.results);
      } catch (error) {
        console.error("Ошибка загрузки городов:", error);
      }
    };

    fetchCities();
  }, []);

  useEffect(() => {
    // Fetch cargo statuses
    const fetchStatuses = async () => {
      try {
        const response = await axiosInstance.get("/constants/cargo_statuses/");
        setStatuses(response.data);
      } catch (error) {
        console.error("Ошибка загрузки статусов:", error);
      }
    };

    fetchStatuses();
  }, []);

  // Check if any filter (except "limit") is active
  const activeFilter = Boolean(
    filters.search ||
      filters.number ||
      filters.consignment__cargo_status ||
      filters.sender_city__name_ru ||
      filters.receiver_city__name_ru ||
      filters.created_at_lte ||
      filters.created_at_gte ||
      filters.ordering
  );

  return (
    <div className="bg-white p-4 mb-4 rounded-lg text-[#1D1B23] shadow-md">
      {/* First Row */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        {/* Search Bar */}
        <div className="relative w-full md:w-[20vw]">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Image src={Search} alt="search" width={15} height={15} />
          </span>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="Поиск"
            className="bg-white rounded px-10 py-2 text-sm w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-6">
          {!warehouse && (
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
                <ul className="absolute z-10 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 transition-all duration-300 transform origin-top">
                  <li
                    onClick={() => {
                      setFilters({
                        ...filters,
                        consignment__cargo_status: "",
                      });
                      setShowStatusDropdown(false);
                    }}
                    className="block px-4 py-2 text-xs text-gray-700 cursor-pointer hover:bg-blue-100 transition-colors duration-200"
                  >
                    Все
                  </li>
                  {statuses.map((status) => (
                    <li
                      key={status.key}
                      onClick={() => {
                        setFilters({
                          ...filters,
                          consignment__cargo_status: status.key,
                        });
                        setShowStatusDropdown(false);
                      }}
                      className="block px-4 py-2 text-xs text-gray-700 cursor-pointer hover:bg-blue-100 transition-colors duration-200"
                    >
                      {status.value}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 text-sm">
        {/* Number Input */}
        <div className="flex flex-col">
          <label className="font-medium mb-1">Номер</label>
          <input
            type="text"
            value={filters.number}
            onChange={(e) => setFilters({ ...filters, number: e.target.value })}
            placeholder="Найти номер"
            className="bg-white border-b border-gray-300 focus:outline-none focus:border-gray-500 px-2 py-1"
          />
        </div>

        {/* Start Date */}
        <div className="flex flex-col">
          <label className="font-medium mb-1">Дата начало</label>
          <input
            type="date"
            value={filters.created_at_gte}
            onChange={(e) =>
              setFilters({ ...filters, created_at_gte: e.target.value })
            }
            className="bg-white border-b border-gray-300 focus:outline-none focus:border-gray-500 px-2 py-1"
          />
        </div>

        <div className="flex flex-col">
          <label className="font-medium mb-1">Дата конца</label>
          <input
            type="date"
            value={filters.created_at_lte}
            onChange={(e) =>
              setFilters({ ...filters, created_at_lte: e.target.value })
            }
            className="bg-white border-b border-gray-300 focus:outline-none focus:border-gray-500 px-2 py-1"
          />
        </div>

        {/* Sender City */}
        <div className="flex flex-col">
          <label className="font-medium mb-2">Город отправителя</label>
          <select
            value={filters.sender_city__name_ru}
            onChange={(e) =>
              setFilters({ ...filters, sender_city__name_ru: e.target.value })
            }
            className="bg-white border-b border-gray-300 focus:outline-none focus:border-gray-500 px-2 py-1"
          >
            <option value="">Указать город</option>
            {cities?.map((city: City) => (
              <option key={city.id} value={city.name_ru}>
                {city.name_ru}
              </option>
            ))}
          </select>
        </div>

        {/* Receiver City */}
        <div className="flex flex-col">
          <label className="font-medium mb-2">Город получателя</label>
          <select
            value={filters.receiver_city__name_ru}
            onChange={(e) =>
              setFilters({
                ...filters,
                receiver_city__name_ru: e.target.value,
              })
            }
            className="bg-white border-b border-gray-300 focus:outline-none focus:border-gray-500 px-2 py-1"
          >
            <option value="">Указать город</option>
            {cities?.map((city: City) => (
              <option key={city.id} value={city.name_ru}>
                {city.name_ru}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filter Button */}
        {activeFilter && (
          <div className="flex flex-col justify-end">
            <button
              onClick={() =>
                setFilters({
                  search: "",
                  number: "",
                  consignment__cargo_status: "",
                  sender_city__name_ru: "",
                  receiver_city__name_ru: "",
                  created_at_lte: "",
                  created_at_gte: "",
                  ordering: "",
                  limit: "10",
                })
              }
              className="bg-red-500 text-white font-medium text-sm px-4 py-2 rounded-lg hover:bg-red-600 shadow-md w-full"
            >
              Очистить фильтр <span className="ml-1">X</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterPanel;
