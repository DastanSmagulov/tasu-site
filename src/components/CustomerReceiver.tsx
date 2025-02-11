import React, { useState, useEffect } from "react";
import Checkbox from "./ui/CheckBox";
import { axiosInstance } from "@/helper/utils";
import { ActDataProps } from "@/helper/types";

const CustomerReceiver: React.FC<ActDataProps> = ({ data, setData }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [fullName, setFullName] = useState(
    data?.receiver_data?.full_name || ""
  );
  const [phoneNumber, setPhoneNumber] = useState(
    data?.receiver_data?.phone || ""
  );
  const [customers, setCustomers] = useState<Array<any>>([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const fetchCustomers = async () => {
    try {
      const response = await axiosInstance.get("/admin/users/search/");
      setCustomers(response.data.results); // Assuming response.data.results is an array of customers
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const handleSelectCustomer = (customer: any) => {
    setSelectedCustomer(customer.full_name);
    setFullName(customer.full_name);
    setPhoneNumber(customer.phone || "");
    setDropdownOpen(false);

    // Update parent state with selected customer info including id and current isPayer flag.
    setData((prevData: any) => ({
      ...prevData,
      receiver_data: {
        ...prevData.receiver_data,
        id: customer.id,
        full_name: customer.full_name,
        phone: customer.phone || "",
        role: customer.role,
      },
    }));
  };

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFullName = e.target.value;
    setFullName(newFullName);
    setData((prevData: any) => ({
      ...prevData,
      receiver_data: {
        ...prevData.receiver_data,
        full_name: newFullName,
      },
    }));
  };

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

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
      {/* Checkbox for "Заказчик является плательщиком?" */}
      <div className="flex items-center md:flex-row flex-col gap-3 mb-4">
        <h2 className="text-lg font-semibold mb-6 text-[#1D1B23]">Заказчик</h2>
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
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          placeholder="Укажите номер телефона"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#09BD3C] focus:border-transparent"
        />
      </div>
    </div>
  );
};

export default CustomerReceiver;
