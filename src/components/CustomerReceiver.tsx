"use client";
import React, { useState, useEffect } from "react";
import { axiosInstance } from "@/helper/utils";
import { ActDataProps } from "@/helper/types";

interface CustomerOption {
  id: string;
  full_name: string;
  phone?: string;
  role?: string;
}

const CustomerReceiver: React.FC<ActDataProps> = ({ data, setData }) => {
  // Local state for form fields.
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [fullName, setFullName] = useState<string>(
    data?.receiver_data?.full_name || ""
  );
  const [phoneNumber, setPhoneNumber] = useState<string>(
    data?.receiver_data?.phone || ""
  );
  // Array of fetched customers.
  const [customers, setCustomers] = useState<CustomerOption[]>([]);
  // When a customer is selected via dropdown.
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerOption | null>(null);

  // Toggle the dropdown.
  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  // Fetch customers from the API.
  const fetchCustomers = async () => {
    try {
      const response = await axiosInstance.get("/admin/users/search/");
      setCustomers(response.data.results || []);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // When a customer is selected from the dropdown.
  const handleSelectCustomer = (customer: CustomerOption) => {
    setSelectedCustomer(customer);
    setFullName(customer.full_name);
    setPhoneNumber(customer.phone || "");
    setDropdownOpen(false);

    // Update parent's data with the selected customer's info (include id).
    setData((prevData: any) => ({
      ...prevData,
      receiver_data: {
        ...prevData.receiver_data,
        id: customer.id,
        full_name: customer.full_name,
        phone: customer.phone || "",
        role: customer.role || "",
      },
    }));
  };

  // When the user manually edits the Full Name.
  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFullName = e.target.value;
    setFullName(newFullName);
    // Clear any selected customer (i.e. clear id).
    setSelectedCustomer(null);
    setData((prevData: any) => ({
      ...prevData,
      receiver_data: {
        ...prevData.receiver_data,
        id: "", // Clear id if manually changed
        full_name: newFullName,
      },
    }));
  };

  // When the user manually edits the Phone Number.
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhone = e.target.value;
    setPhoneNumber(newPhone);
    setData((prevData: any) => ({
      ...prevData,
      receiver_data: {
        ...prevData.receiver_data,
        phone: newPhone,
      },
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
      <h2 className="text-lg font-semibold mb-6 text-[#1D1B23]">Получатель</h2>

      {/* Dropdown for Selecting Customer */}
      <div className="mb-4 relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Выберите заказчика
        </label>
        <button
          onClick={toggleDropdown}
          className="w-full border border-gray-300 rounded-md p-2 text-left focus:outline-none bg-transparent hover:bg-transparent focus:ring-2 focus:ring-[#09BD3C] focus:border-transparent"
        >
          {selectedCustomer
            ? selectedCustomer.full_name
            : fullName || "Выберите заказчика"}
        </button>
        {dropdownOpen && (
          <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-auto">
            {customers.map((customer) => (
              <li
                key={customer.id}
                onClick={() => handleSelectCustomer(customer)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {customer.full_name} ({customer.phone})
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
          value={data?.receiver_data?.full_name}
          onChange={handleFullNameChange}
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
          value={data?.receiver_data?.phone}
          onChange={handlePhoneNumberChange}
          placeholder="Укажите номер телефона"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#09BD3C] focus:border-transparent"
        />
      </div>
    </div>
  );
};

export default CustomerReceiver;
