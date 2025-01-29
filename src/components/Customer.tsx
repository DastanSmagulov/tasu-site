import React, { useState, useEffect } from "react";
import { FaCog, FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import Checkbox from "./ui/CheckBox";
import axios from "axios";
import { axiosInstance } from "@/helper/utils";
import { Act } from "@/helper/types";

interface ActDataProps {
  data: Act | null;
}

const Customer: React.FC<ActDataProps> = ({ data }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isPayer, setIsPayer] = useState(true);
  const [fullName, setFullName] = useState(data?.customer.full_name); // Full name input
  const [phoneNumber, setPhoneNumber] = useState(data?.customer.phone); // Phone number input
  const [customers, setCustomers] = useState([]); // Fetched customer options
  const [selectedCustomer, setSelectedCustomer] = useState(""); // Selected customer

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const fetchCustomers = async () => {
    try {
      const response = await axiosInstance.get("/admin/users/search/");
      console.log(response);
      setCustomers(response.data.results); // Assuming response.data is an array of customers
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const handleSelectCustomer = (customer: any) => {
    setSelectedCustomer(customer.fullName);
    setFullName(customer.full_name);
    setPhoneNumber(customer.phone || "");
    setDropdownOpen(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
      {/* Checkbox for "Заказчик является плательщиком?" */}
      <div className="flex items-center md:flex-row flex-col gap-3 mb-4">
        <h2 className="text-lg font-semibold mb-6 text-[#1D1B23]">Заказчик</h2>
        <div className="flex items-start gap-3">
          <label
            htmlFor="isPayer"
            className="flex items-center mb-6 text-sm font-medium text-gray-700 cursor-pointer"
          >
            Заказчик является плательщиком?
          </label>
          <Checkbox checked={isPayer} onChange={() => setIsPayer(!isPayer)} />
        </div>
      </div>

      {/* Dropdown for Selecting Customer */}
      <div className="mb-4 relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Выберите заказчика
        </label>
        <button
          onClick={toggleDropdown}
          className="w-full border border-gray-300 rounded-md p-2 text-left focus:outline-none bg-transparent hover:bg-transparent focus:ring-2 focus:ring-[#09BD3C] focus:border-transparent"
        >
          {selectedCustomer || "Выберите заказчика"}
        </button>
        {dropdownOpen && (
          <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-auto">
            {customers.map((customer: any) => (
              <li
                key={customer.id}
                onClick={() => handleSelectCustomer(customer)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {customer.full_name}
              </li>
            ))}
          </ul>
        )}
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
    </div>
  );
};

export default Customer;
