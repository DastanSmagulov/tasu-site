"use client";

import React, { useState, useEffect } from "react";
import Checkbox from "./ui/CheckBox";
import { axiosInstance } from "@/helper/utils";
import { Act, ActDataProps } from "@/helper/types";

const Customer: React.FC<ActDataProps> = ({ data, setData }) => {
  // Состояния для формы
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isPayer, setIsPayer] = useState<boolean>(
    data?.customer_data?.customer_is_payer || false
  );
  const [fullName, setFullName] = useState<string>(
    data?.customer_data?.full_name || ""
  );
  const [phoneNumber, setPhoneNumber] = useState<string>(
    data?.customer_data?.phone || ""
  );
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>(fullName);

  // ---- Состояния и функции для валюты ----
  const [currencyTypes, setCurrencyTypes] = useState<any[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<string>(
    data?.customer_data?.customer_currency_type || ""
  );

  // Открытие/закрытие дропдауна с пользователями
  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  // Загрузка списка пользователей (заказчиков)
  const fetchCustomers = async () => {
    try {
      const response = await axiosInstance.get("/admin/users/search/");
      setCustomers(response.data.results || []);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  // Загрузка списка типов валют
  const fetchCurrencyTypes = async () => {
    try {
      const response = await axiosInstance.get(
        "/constants/customer_currency_type/"
      );
      // Предположим, что сервер возвращает массив объектов вида: [{ key: "KZT", value: "Тенге" }, ...]
      setCurrencyTypes(response.data || []);
    } catch (error) {
      console.error("Error fetching currency types:", error);
    }
  };

  // Выбор пользователя из списка
  const handleSelectCustomer = (customer: any) => {
    setSelectedCustomer(customer.full_name);
    setFullName(customer.full_name);
    setPhoneNumber(customer.phone || "");
    setDropdownOpen(false);

    // Обновляем данные в родительском стейте
    setData((prevData: any) => ({
      ...prevData,
      customer_data: {
        ...prevData.customer_data,
        id: Number(customer.id) || "",
        full_name: customer.full_name,
        phone: customer.phone || "",
        role: customer.role,
        customer_is_payer: isPayer,
        customer_currency_type: customer.customer_currency_type,
      },
    }));
  };

  // Обработка изменения ФИО вручную
  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFullName = e.target.value;
    setFullName(newFullName);
    setData((prevData: any) => ({
      ...prevData,
      customer_data: {
        ...prevData.customer_data,
        id: "", // Если пользователь ввёл что-то вручную, убираем ID
        full_name: newFullName,
      },
    }));
  };

  // Обработка изменения номера телефона вручную
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

  // Заказчик является плательщиком?
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

  // Обработка изменения выбранной валюты
  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCurrency = e.target.value;
    setSelectedCurrency(newCurrency);
    // Записываем в Act (основной объект), в поле customer_currency_type
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
      {/* Checkbox: "Заказчик является плательщиком?" */}
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

      {/* Dropdown (список пользователей) */}
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

      {/* Поле ввода ФИО */}
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

      {/* Поле ввода телефона */}
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

      {/* Селект выбора валюты */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Валюта
        </label>
        <select
          value={data?.customer_data?.customer_currency_type}
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
    </div>
  );
};

export default Customer;
