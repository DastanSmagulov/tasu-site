"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import Shipping from "@/components/Shipping";
import CreateSuccessAct from "@/components/modals/CreateSuccessAct";
import PaymentPhoto from "@/components/PaymentPhoto";
import AccountingEsf from "@/features/accountant/AccountingEsf";
import AccountingAbp from "@/features/accountant/AccountingAbp";
import { useRouter } from "next/navigation";

// Define the data type
type DocumentData = {
  id: string;
  date: string;
  status: string;
  customer: string;
  place: string;
  weight: string;
  volume: string;
  statusColor: string;
  view: string;
  amount: string;
};

export default function ActPage() {
  const { data: session, status } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const actStatus: string = "готов к отправке";
  const role: string = "manager";
  const router = useRouter();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  const handleSignatureSubmit = (signatureDataUrl: string) => {
    console.log("Signature submitted:", signatureDataUrl);
  };

  const handlePhotoUpload = (file: File) => {
    console.log("Photo uploaded:", file);
  };

  const handleFormSubmit = () => {
    alert("Форма отправлена");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSend = () => {
    setIsModalOpen(true);
  };

  const openExpenses = () => {
    router.push("/accountant/expenses");
  };

  return (
    <>
      <div className="flex flex-row max-lg:flex-col gap-4 mt-4 w-full">
        <div className="flex flex-col lg:w-1/2 space-y-4">
          <PaymentPhoto />
          <AccountingEsf />
          <AccountingAbp />
          <div>
            <h2 className="text-lg font-semibold mb-4 text-[#1D1B23]">
              Расходы
            </h2>
            <button
              onClick={openExpenses}
              className="font-semibold px-4 py-2 rounded-lg"
            >
              Указать из таблицы
            </button>
          </div>
        </div>
        <div className="flex flex-col lg:w-1/2 space-y-4">
          <Shipping />
        </div>
      </div>
      <div className="flex flex-wrap justify-end gap-4 mt-8 text-[#000000]">
        {/* Create Card Button */}
        <button className="font-semibold border border-gray-500 px-4 py-2 bg-white hover:bg-gray-100 text-black rounded-lg">
          Создать карточку
        </button>

        {/* Print Button */}
        <button
          onClick={handlePrint}
          className="font-semibold border border-gray-500 px-4 py-2 bg-white hover:bg-gray-100 text-black rounded-lg flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 15.75v3.75h10.5v-3.75M4.5 9.75h15a1.5 1.5 0 011.5 1.5v6a1.5 1.5 0 01-1.5 1.5H4.5A1.5 1.5 0 013 17.25v-6a1.5-1.5 0-011.5-1.5zM15.75 3.75v6m-7.5-6v6"
            />
          </svg>
          Распечатать Акт
        </button>

        {/* Save Button */}
        <button className="font-semibold border border-gray-500 px-4 py-2 bg-white hover:bg-gray-100 text-black rounded-lg">
          Сохранить
        </button>

        {/* Send Button */}
        <button
          onClick={handleSend}
          className="font-semibold px-4 py-2 rounded-lg"
        >
          Выслать
        </button>
      </div>
      {isModalOpen && <CreateSuccessAct />}
    </>
  );
}
