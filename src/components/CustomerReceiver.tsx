"use client";
import React, { useState, useEffect } from "react";
import { axiosInstance } from "@/helper/utils";
import { ActDataProps } from "@/helper/types";
import Checkbox from "./ui/CheckBox";

interface CustomerOption {
  id: string;
  full_name: string;
  phone?: string;
  role?: string;
  account_details?: string;
  address?: string;
}

const CustomerReceiver: React.FC<ActDataProps> = ({ data, setData }) => {
  // Локальные состояния для полей формы
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [fullName, setFullName] = useState<string>(
    data?.receiver_data?.full_name || ""
  );
  const [phoneNumber, setPhoneNumber] = useState<string>(
    data?.receiver_data?.phone || ""
  );
  const [address, setAddress] = useState<string>(
    data?.receiver_data?.address || ""
  );
  const [isPayer, setIsPayer] = useState<boolean>(
    data?.receiver_data?.receiver_is_payer || false
  );

  // Массив полученных заказчиков
  const [customers, setCustomers] = useState<CustomerOption[]>([]);
  // Выбранный заказчик из выпадающего списка
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerOption | null>(null);

  // Переключение выпадающего списка
  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  // Получение списка заказчиков с API
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

  // Выбор заказчика из списка
  const handleSelectCustomer = (customer: CustomerOption) => {
    setSelectedCustomer(customer);
    setFullName(customer.full_name);
    setPhoneNumber(customer.phone || "");
    setAddress(customer.address || "");
    setDropdownOpen(false);

    // Обновление родительского состояния с выбранными данными
    setData((prevData: any) => ({
      ...prevData,
      receiver_data: {
        ...prevData.receiver_data,
        id: customer.id,
        full_name: customer.full_name,
        phone: customer.phone || "",
        role: "RECEIVER",
        receiver_is_payer: false,
        account_details: customer.account_details || "",
        address: customer.address || "",
      },
    }));
  };

  // Обработчик изменения ФИО (при ручном вводе)
  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFullName = e.target.value;
    setFullName(newFullName);
    setSelectedCustomer(null); // Сброс выбранного заказчика (id)
    setData((prevData: any) => ({
      ...prevData,
      receiver_data: {
        ...prevData.receiver_data,
        id: "", // Очистка id при ручном вводе
        full_name: newFullName,
      },
    }));
  };

  // Обработчик изменения номера телефона
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

  // Обработчик изменения реквизитов
  const handleAccountDetailsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newAccountDetails = e.target.value;
    setData((prevData: any) => ({
      ...prevData,
      receiver_data: {
        ...prevData.receiver_data,
        account_details: newAccountDetails,
      },
    }));
  };

  // Обработчик изменения адреса
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAddress = e.target.value;
    setAddress(newAddress);
    setData((prevData: any) => ({
      ...prevData,
      receiver_data: {
        ...prevData.receiver_data,
        address: newAddress,
      },
    }));
  };

  const handlePayerChange = () => {
    const newValue = !isPayer;
    setIsPayer(newValue);
    setData((prevData: any) => ({
      ...prevData,
      receiver_data: {
        ...prevData.receiver_data,
        receiver_is_payer: newValue,
        role: "Receiver",
      },
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
      <div className="flex items-center md:flex-row flex-col gap-3 mb-4">
        <h2 className="text-lg font-semibold mb-6 text-[#1D1B23]">
          Получатель
        </h2>
      </div>

      <div className="flex items-start gap-3">
        <label
          htmlFor="isPayer"
          className="flex items-center mb-6 text-sm font-medium text-gray-700 cursor-pointer"
        >
          Получатель является плательщиком?
        </label>
        <Checkbox
          checked={data?.receiver_data?.receiver_is_payer || false}
          onChange={handlePayerChange}
        />
      </div>

      {/* Выпадающий список для выбора заказчика */}
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
            {customers.map((customer: CustomerOption) => (
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

      {/* Поле для ввода ФИО */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Укажите ФИО
        </label>
        <input
          type="text"
          value={data?.receiver_data?.full_name || ""}
          onChange={handleFullNameChange}
          placeholder="Введите ФИО"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#09BD3C] focus:border-transparent"
        />
      </div>

      {/* Поле для ввода номера телефона */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Телефон
        </label>
        <input
          type="tel"
          value={data?.receiver_data?.phone || ""}
          onChange={handlePhoneNumberChange}
          placeholder="Укажите номер телефона"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#09BD3C] focus:border-transparent"
        />
      </div>

      {/* Поле для ввода адреса */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Адрес
        </label>
        <input
          type="text"
          value={data?.receiver_data?.address || ""}
          onChange={handleAddressChange}
          placeholder="Введите адрес"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#09BD3C] focus:border-transparent"
        />
      </div>
    </div>
  );
};

export default CustomerReceiver;
