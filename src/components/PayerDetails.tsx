"use client";
import React, { useState, useMemo } from "react";
import { ActDataProps } from "@/helper/types";
import Cookies from "js-cookie";

interface AccountDetails {
  bin: string;
  bik: string;
  address?: string;
  number_check?: string;
  kbe?: string;
  director?: string;
  contacts?: string;
  currency?: string;
  name_bank?: string;
}

const PayerDetails: React.FC<ActDataProps> = ({ data, setData }) => {
  const role = Cookies.get("role");

  // Функция для получения начальных реквизитов
  const getInitialAccountDetails = (): AccountDetails => {
    // Здесь все поля имеют значения по умолчанию (пустые строки)
    const defaultDetails: AccountDetails = {
      bin: "",
      bik: "",
      address: "",
      number_check: "",
      kbe: "",
      director: "",
      contacts: "",
      currency: "",
      name_bank: "",
    };

    if (data?.sender_data?.sender_is_payer) {
      return {
        ...defaultDetails,
        ...data.sender_account_details,
      };
    } else if (data?.receiver_data?.receiver_is_payer) {
      return {
        ...defaultDetails,
        ...data.receiver_account_details,
      };
    }
    return defaultDetails;
  };

  // Инициализируем локальное состояние один раз при монтировании
  const initialDetails = useMemo(
    () => getInitialAccountDetails(),
    [data?.sender_data, data?.receiver_data]
  );
  const [accountDetails, setAccountDetails] =
    useState<AccountDetails>(initialDetails);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedDetails = { ...accountDetails, [name]: value };
    setAccountDetails(updatedDetails);

    // Передаем изменения в родительский компонент
    if (data?.sender_data?.sender_is_payer) {
      setData((prevData: any) => ({
        ...prevData,
        sender_account_details: updatedDetails,
      }));
    } else if (data?.receiver_data?.receiver_is_payer) {
      setData((prevData: any) => ({
        ...prevData,
        receiver_account_details: updatedDetails,
      }));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
      <h2 className="text-lg font-semibold mb-6 text-[#1D1B23]">
        Реквизиты плательщика
      </h2>

      {/* BIN Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          BIN
        </label>
        <input
          type="text"
          name="bin"
          value={accountDetails.bin ?? ""}
          onChange={handleInputChange}
          placeholder="Введите BIN"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#09BD3C] focus:border-transparent"
        />
      </div>

      {/* BIK Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          BIK
        </label>
        <input
          type="text"
          name="bik"
          value={accountDetails.bik ?? ""}
          onChange={handleInputChange}
          placeholder="Введите BIK"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#09BD3C] focus:border-transparent"
        />
      </div>

      {/* Адрес Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Адрес
        </label>
        <input
          type="text"
          name="address"
          value={accountDetails.address ?? ""}
          onChange={handleInputChange}
          placeholder="Введите адрес"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#09BD3C] focus:border-transparent"
        />
      </div>

      {/* Номер счета Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Номер счета
        </label>
        <input
          type="text"
          name="number_check"
          value={accountDetails.number_check ?? ""}
          onChange={handleInputChange}
          placeholder="Введите номер счета"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#09BD3C] focus:border-transparent"
        />
      </div>

      {/* KBE Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          KBE
        </label>
        <input
          type="text"
          name="kbe"
          value={accountDetails.kbe ?? ""}
          onChange={handleInputChange}
          placeholder="Введите KBE"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#09BD3C] focus:border-transparent"
        />
      </div>

      {/* Директор Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Директор
        </label>
        <input
          type="text"
          name="director"
          value={accountDetails.director ?? ""}
          onChange={handleInputChange}
          placeholder="Введите имя директора"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#09BD3C] focus:border-transparent"
        />
      </div>

      {/* Контакты Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Контакты
        </label>
        <input
          type="text"
          name="contacts"
          value={accountDetails.contacts ?? ""}
          onChange={handleInputChange}
          placeholder="Введите контакты"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#09BD3C] focus:border-transparent"
        />
      </div>

      {/* Валюта Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Валюта
        </label>
        <input
          type="text"
          name="currency"
          value={accountDetails.currency ?? ""}
          onChange={handleInputChange}
          placeholder="Введите валюту"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#09BD3C] focus:border-transparent"
        />
      </div>

      {/* Название банка Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Название банка
        </label>
        <input
          type="text"
          name="name_bank"
          value={accountDetails.name_bank ?? ""}
          onChange={handleInputChange}
          placeholder="Введите название банка"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#09BD3C] focus:border-transparent"
        />
      </div>
    </div>
  );
};

export default PayerDetails;
