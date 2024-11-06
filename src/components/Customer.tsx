import React, { useState } from "react";
import { PencilIcon } from "@heroicons/react/solid";
import { FaEdit, FaPlus, FaTrash, FaCog } from "react-icons/fa";

const Customer: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleEdit = () => {
    console.log("Edit action");
    setDropdownOpen(false);
  };

  const handleAdd = () => {
    console.log("Add action");
    setDropdownOpen(false);
  };

  const handleDelete = () => {
    console.log("Delete action");
    setDropdownOpen(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
      <h2 className="text-lg font-semibold mb-6 text-[#1D1B23]">Заказчик</h2>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Заказчик
      </label>
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Введите заказчика"
          className="w-full border border-gray-300 rounded-md p-2 pr-12 focus:outline-none focus:ring-2 focus:ring-[#09BD3C] focus:border-transparent"
        />
        <button
          onClick={toggleDropdown}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 focus:outline-none"
        >
          <FaCog className="fill-gray-400 cursor-pointer" size={22} />
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
            <ul className="py-2">
              <li
                onClick={handleEdit}
                className="flex items-center px-2 py-2 hover:bg-gray-100 cursor-pointer"
              >
                <FaEdit className="mr-2 text-gray-600" size={30} />
                Редактировать
              </li>
              <li
                onClick={handleAdd}
                className="flex items-center px-2 py-2 hover:bg-gray-100 cursor-pointer"
              >
                <FaPlus className="mr-2 text-gray-600" />
                Добавить
              </li>
              <li
                onClick={handleDelete}
                className="flex items-center px-2 py-2 hover:bg-gray-100 cursor-pointer"
              >
                <FaTrash className="mr-2 text-gray-600" />
                Удалить
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Customer;
