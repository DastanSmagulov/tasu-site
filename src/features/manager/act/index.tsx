"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import Customer from "@/components/Customer";
import PackageCharacteristics from "@/components/PackageCharacteristics";
import CargoPhoto from "@/components/CargoPhoto";
import InformationPackage from "@/components/PackageInformation";
import QrAct from "@/components/QrAct";
import Shipping from "@/components/Shipping";
import Agreement from "@/components/Agreement";
import ServicesTable from "@/components/ServicesTable";
import TransportInfo from "@/components/TransportInfo";
import DriverInfo from "@/components/DriverInfo";
import ManagerLink from "@/components/ManagerLink";
import TransportationTypes from "@/components/TransportationType";
import CreateSuccessAct from "@/components/modals/CreateSuccessAct";
import AccountingEsf from "@/features/accountant/AccountingEsf";
import AccountingAbp from "@/features/accountant/AccountingAbp";
import TableTotal from "@/components/TableTotal";

("./globals.css");

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

  return (
    <>
      <div className="flex gap-4 mt-4 w-full">
        <div className="flex flex-col w-1/2 space-y-4">
          <Customer />
          <PackageCharacteristics />
          <CargoPhoto />
          <TransportationTypes />
          <DriverInfo />
          <TransportInfo />
          <div className="space-y-6">
            <ManagerLink
              title="приема наемником"
              link="https://tasu.kz/shortlive_reference_607/"
            />
            <ManagerLink
              title="передачи наемником"
              link="https://tasu.kz/shortlive_reference_148/"
            />
          </div>
          <Agreement />
        </div>
        <div className="flex flex-col w-1/2 space-y-4">
          <Shipping />
          <InformationPackage />
          <Agreement />
          <TableTotal
            title="Услуги"
            columns={[
              { label: "Услуга", key: "service" },
              { label: "Кол-во", key: "quantity" },
              { label: "Стоимость", key: "cost" },
            ]}
            initialData={[
              { service: "Доставка", quantity: "1", cost: "1000" },
              { service: "Упаковка", quantity: "2", cost: "2000" },
              { service: "Страховка", quantity: "1", cost: "1500" },
            ]}
          />{" "}
          <InformationPackage />
          <AccountingEsf />
          <AccountingAbp />
          {actStatus == "готов к отправке" && (
            <QrAct
              qrCodeUrl="/images/qr-code.png"
              actNumber="1234"
              description="Lorem ipsum dolor sit amet consectetur. Dictum morbi ut lacus ultrices pulvinar lectus adipiscing sit."
            />
          )}
          {/* Buttons */}
          <div className="flex gap-4 text-[#000000]">
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
                  d="M6.75 15.75v3.75h10.5v-3.75M4.5 9.75h15a1.5 1.5 0 011.5 1.5v6a1.5 1.5 0 01-1.5 1.5H4.5A1.5 1.5 0 013 17.25v-6a1.5 1.5 0 011.5-1.5zM15.75 3.75v6m-7.5-6v6"
                />
              </svg>
              Распечатать Акт
            </button>

            {/* Save Button */}
            <button
              // onClick={handleSave}
              className="font-semibold border border-gray-500 px-4 py-2 bg-white hover:bg-gray-100 text-black rounded-lg"
            >
              Сохранить
            </button>

            {/* Send Button */}
            <button
              onClick={handleSend}
              className="font-semibold px-4 py-2 rounded-lg"
            >
              Отправить
            </button>
          </div>
        </div>
      </div>
      {isModalOpen && <CreateSuccessAct />}
    </>
  );
}
