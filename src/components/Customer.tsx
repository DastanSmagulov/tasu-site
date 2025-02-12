import React, { useState, useEffect } from "react";
import Checkbox from "./ui/CheckBox";
import { axiosInstance } from "@/helper/utils";
import { Act, ActDataProps } from "@/helper/types";

const Customer: React.FC<ActDataProps> = ({ data, setData }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isPayer, setIsPayer] = useState(
    data?.customer_data?.customer_is_payer || false
  );
  const [fullName, setFullName] = useState(
    data?.customer_data?.full_name || ""
  );
  const [phoneNumber, setPhoneNumber] = useState(
    data?.customer_data?.phone || ""
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
      customer_data: {
        ...prevData.customer_data,
        id: customer.id, // Pass the id from the selected customer
        full_name: customer.full_name,
        role: customer.role,
        customer_is_payer: isPayer, // Retain the current value of isPayer
      },
    }));
  };

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFullName = e.target.value;
    setFullName(newFullName);
    setData((prevData: any) => ({
      ...prevData,
      customer_data: {
        ...prevData.customer_data,
        full_name: newFullName,
      },
    }));
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhone = e.target.value;
    setPhoneNumber(newPhone);
    setData((prevData: any) => ({
      ...prevData,
      customer_data: {
        ...prevData.customer_data,
      },
    }));
  };

  const handlePayerChange = () => {
    const newValue = !isPayer;
    setIsPayer(newValue);
    setData((prevData: any) => ({
      ...prevData,
      customer_data: {
        ...prevData.customer_data,
        customer_is_payer: newValue,
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
        <div className="flex items-start gap-3">
          <label
            htmlFor="isPayer"
            className="flex items-center mb-6 text-sm font-medium text-gray-700 cursor-pointer"
          >
            Заказчик является плательщиком?
          </label>
          <Checkbox
            checked={data?.customer_data?.customer_is_payer}
            onChange={handlePayerChange}
          />
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
          value={data?.customer_data?.full_name}
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
          value={data?.customer_data?.phone}
          onChange={handlePhoneNumberChange}
          placeholder="Укажите номер телефона"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#09BD3C] focus:border-transparent"
        />
      </div>
    </div>
  );
};

export default Customer;
