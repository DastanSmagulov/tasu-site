"use client";
import React, { useState, useEffect } from "react";
import { axiosInstance } from "@/helper/utils";
import { ActDataProps } from "@/helper/types";
import Checkbox from "./ui/CheckBox";

interface SenderOption {
  id: string;
  full_name: string;
  phone?: string;
  role?: string;
}

const Sender: React.FC<ActDataProps> = ({ data, setData }) => {
  // Локальные состояния для полей формы
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [fullName, setFullName] = useState<string>(
    data?.sender_data?.full_name || ""
  );
  const [phoneNumber, setPhoneNumber] = useState<string>(
    data?.sender_data?.phone || ""
  );
  const [isPayer, setIsPayer] = useState<boolean>(
    data?.sender_data?.sender_is_payer || false
  );

  // Массив полученных отправителей
  const [senders, setSenders] = useState<SenderOption[]>([]);
  // Выбранный отправитель
  const [selectedSender, setSelectedSender] = useState<SenderOption | null>(
    null
  );

  // Переключение выпадающего списка
  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  // Получение списка отправителей с API
  const fetchSenders = async () => {
    try {
      const response = await axiosInstance.get("/admin/users/search/");
      setSenders(response.data.results || []);
    } catch (error) {
      console.error("Error fetching senders:", error);
    }
  };

  useEffect(() => {
    fetchSenders();
  }, []);

  // Обработка выбора отправителя из списка
  const handleSelectSender = (sender: SenderOption) => {
    setSelectedSender(sender);
    setFullName(sender.full_name);
    setPhoneNumber(sender.phone || "");
    setDropdownOpen(false);

    setData((prevData: any) => ({
      ...prevData,
      sender_data: {
        ...prevData.sender_data,
        id: sender.id,
        full_name: sender.full_name,
        phone: sender.phone || "",
        role: "SENDER",
        sender_is_payer: isPayer,
      },
    }));
  };

  // Обработка изменения ФИО вручную
  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFullName = e.target.value;
    setFullName(newFullName);
    setSelectedSender(null);
    setData((prevData: any) => ({
      ...prevData,
      sender_data: {
        ...prevData.sender_data,
        id: "", // Очистка id при ручном вводе
        full_name: newFullName,
        role: "SENDER",
        sender_is_payer: isPayer,
      },
    }));
  };

  // Обработка изменения номера телефона
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhone = e.target.value;
    setPhoneNumber(newPhone);
    setData((prevData: any) => ({
      ...prevData,
      sender_data: {
        ...prevData.sender_data,
        phone: newPhone,
        role: "SENDER",
        sender_is_payer: isPayer,
      },
    }));
  };

  // Обработка переключения чекбокса "Отправитель является плательщиком"
  const handlePayerChange = () => {
    const newValue = !isPayer;
    setIsPayer(newValue);
    setData((prevData: any) => ({
      ...prevData,
      sender_data: {
        ...prevData.sender_data,
        sender_is_payer: newValue,
        role: "SENDER",
      },
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
      <h2 className="text-lg font-semibold mb-6 text-[#1D1B23]">Отправитель</h2>
      <div className="flex items-center md:flex-row flex-col gap-3 mb-4">
        <div className="flex items-start gap-3">
          <label
            htmlFor="isPayer"
            className="flex items-center mb-6 text-sm font-medium text-gray-700 cursor-pointer"
          >
            Отправитель является плательщиком?
          </label>
          <Checkbox
            checked={data?.sender_data?.sender_is_payer || false}
            onChange={handlePayerChange}
          />
        </div>
      </div>
      {/* Выпадающий список для выбора отправителя */}
      <div className="mb-4 relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Выберите отправителя
        </label>
        <button
          onClick={toggleDropdown}
          className="w-full border border-gray-300 rounded-md p-2 text-left focus:outline-none bg-transparent hover:bg-transparent focus:ring-2 focus:ring-[#09BD3C] focus:border-transparent"
        >
          {selectedSender
            ? selectedSender.full_name
            : fullName || "Выберите отправителя"}
        </button>
        {dropdownOpen && (
          <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-auto">
            {senders.map((sender: SenderOption) => (
              <li
                key={sender.id}
                onClick={() => handleSelectSender(sender)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {sender.full_name} ({sender.phone})
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Поле ввода ФИО/Организации */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Укажите ФИО/Организацию
        </label>
        <input
          type="text"
          value={data?.sender_data?.full_name || ""}
          onChange={handleFullNameChange}
          placeholder="Введите ФИО/Организацию"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#09BD3C] focus:border-transparent"
        />
      </div>

      {/* Поле ввода номера телефона */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Телефон
        </label>
        <input
          type="tel"
          value={data?.sender_data?.phone || ""}
          onChange={handlePhoneNumberChange}
          placeholder="Введите номер телефона"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#09BD3C] focus:border-transparent"
        />
      </div>
    </div>
  );
};

export default Sender;
