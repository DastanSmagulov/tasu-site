"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { axiosInstance } from "@/helper/utils";
import { ActDataProps } from "@/helper/types";
import Cookies from "js-cookie";

const Customer: React.FC<ActDataProps> = ({ data, setData }) => {
  const role = Cookies.get("role");
  // Состояния формы
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [fullName, setFullName] = useState<string>(
    data?.customer_data?.full_name || ""
  );
  const [phoneNumber, setPhoneNumber] = useState<string>(
    data?.customer_data?.phone || ""
  );
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>(fullName);

  // Состояния для валюты
  const [currencyTypes, setCurrencyTypes] = useState<any[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<string>(
    data?.customer_data?.customer_currency_type || ""
  );

  // Состояния для реквизитов (account_details)
  const [accountDetails, setAccountDetails] = useState<string>(
    data?.customer_data?.account_details || ""
  );

  // Переключение выпадающего списка заказчиков
  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  // Загрузка списка заказчиков
  const fetchCustomers = async () => {
    try {
      const response = await axiosInstance.get("/admin/users/search/");
      setCustomers(response.data.results || []);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  // Загрузка списка валют
  const fetchCurrencyTypes = async () => {
    try {
      const response = await axiosInstance.get(
        "/constants/customer_currency_type/"
      );
      setCurrencyTypes(response.data || []);
    } catch (error) {
      console.error("Error fetching currency types:", error);
    }
  };

  // Выбор заказчика из списка
  const handleSelectCustomer = (customer: any) => {
    setSelectedCustomer(customer.full_name);
    setFullName(customer.full_name);
    setPhoneNumber(customer.phone || "");
    setDropdownOpen(false);

    // Обновление родительского состояния с выбранными данными заказчика
    setData((prevData: any) => ({
      ...prevData,
      customer_data: {
        ...prevData.customer_data,
        id: String(customer.id) || "",
        full_name: customer.full_name,
        phone: customer.phone || "",
        role: customer.role || "CUSTOMER",
        customer_currency_type: customer.customer_currency_type,
        account_details: customer.account_details || "",
      },
    }));
  };

  // Обработчик изменения ФИО/Организации
  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFullName = e.target.value;
    setFullName(newFullName);
    setData((prevData: any) => ({
      ...prevData,
      customer_data: {
        ...prevData.customer_data,
        id: "", // Сброс ID при ручном вводе
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
      customer_data: {
        ...prevData.customer_data,
        phone: newPhone,
      },
    }));
  };

  // Обработчик изменения реквизитов (account_details)
  const handleAccountDetailsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newAccountDetails = e.target.value;
    setAccountDetails(newAccountDetails);
    setData((prevData: any) => ({
      ...prevData,
      customer_data: {
        ...prevData.customer_data,
        account_details: newAccountDetails,
      },
    }));
  };

  // Обработчик изменения валюты
  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCurrency = e.target.value;
    setSelectedCurrency(newCurrency);
    setData((prevData: any) => ({
      ...prevData,
      customer_data: {
        ...prevData.customer_data,
        customer_currency_type: newCurrency,
      },
    }));
  };

  useEffect(() => {
    fetchCustomers();
    fetchCurrencyTypes();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
      <h2 className="text-lg font-semibold mb-6 text-[#1D1B23]">Заказчик</h2>

      {/* Выпадающий список заказчиков */}
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
                {customer.full_name} ({customer.phone})
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Поле для ФИО/Организации */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Укажите ФИО/Организацию
        </label>
        <input
          type="text"
          value={data?.customer_data?.full_name || ""}
          onChange={handleFullNameChange}
          placeholder="Введите ФИО/Организацию"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#09BD3C] focus:border-transparent"
        />
      </div>

      {/* Поле для номера телефона */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Телефон
        </label>
        <input
          type="tel"
          value={data?.customer_data?.phone || ""}
          onChange={handlePhoneNumberChange}
          placeholder="Укажите номер телефона"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#09BD3C] focus:border-transparent"
        />
      </div>

      {/* Поле для реквизитов */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Реквизиты
        </label>
        <input
          type="text"
          value={data?.customer_data?.account_details || ""}
          onChange={handleAccountDetailsChange}
          placeholder="Введите реквизиты"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#09BD3C] focus:border-transparent"
        />
      </div>

      {/* Поле для выбора валюты */}
      {role === "manager" && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Валюта
          </label>
          <select
            value={data?.customer_data?.customer_currency_type || ""}
            onChange={handleCurrencyChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#09BD3C] focus:border-transparent"
          >
            <option value="">Выберите валюту</option>
            {currencyTypes.map((currency: any) => (
              <option key={currency.key} value={currency.key}>
                {currency.value}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default Customer;
