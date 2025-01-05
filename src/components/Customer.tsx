import React, { useState } from "react";
import { FaCog, FaEdit, FaPlus, FaTrash } from "react-icons/fa";

const Customer: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isPayer, setIsPayer] = useState(false); // State for the checkbox
  const [fullName, setFullName] = useState(""); // State for the full name input
  const [phoneNumber, setPhoneNumber] = useState(""); // State for the phone number input

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
      {/* Checkbox for "Заказчик является плательщиком?" */}
      <div className="flex items-center mb-4">
        <h2 className="text-lg font-semibold mb-6 text-[#1D1B23]">Заказчик</h2>

        <input
          id="isPayer"
          type="checkbox"
          checked={isPayer}
          onChange={(e) => setIsPayer(e.target.checked)}
          className="h-5 w-5 mr-2 border-gray-300 rounded focus:ring-[#09BD3C] text-[#09BD3C]"
        />
        <label
          htmlFor="isPayer"
          className="flex items-center mb-6 text-sm font-medium text-gray-700 cursor-pointer"
        >
          Заказчик является плательщиком?
        </label>
      </div>

      {/* Full Name Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Укажите ФИО
        </label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Введите ФИО"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#09BD3C] focus:border-transparent"
        />
      </div>

      {/* Phone Number Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Телефон
        </label>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Укажите номер телефона"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#09BD3C] focus:border-transparent"
        />
      </div>

      {/* Dropdown for Actions */}
      {/* <div className="relative w-full">
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
                <FaEdit className="mr-2 text-gray-600" size={16} />
                Редактировать
              </li>
              <li
                onClick={handleAdd}
                className="flex items-center px-2 py-2 hover:bg-gray-100 cursor-pointer"
              >
                <FaPlus className="mr-2 text-gray-600" size={16} />
                Добавить
              </li>
              <li
                onClick={handleDelete}
                className="flex items-center px-2 py-2 hover:bg-gray-100 cursor-pointer"
              >
                <FaTrash className="mr-2 text-gray-600" size={16} />
                Удалить
              </li>
            </ul>
          </div>
        )}
      </div> */}
    </div>
  );
};

export default Customer;
