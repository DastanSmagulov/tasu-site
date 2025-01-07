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
  const steps = [
    { id: 1, name: "Данные о Заказчике", component: Customer },
    {
      id: 2,
      name: "Характеристики и вес груза",
      component: PackageCharacteristics,
    },
    {
      id: 3,
      name: "Фотографии груза и информация о получении",
      component: () => (
        <>
          <CargoPhoto />
          <InformationPackage />
        </>
      ),
    },
    {
      id: 4,
      name: "Типы транспорта и информация о водителе",
      component: () => (
        <>
          <TransportationTypes />
          <DriverInfo />
        </>
      ),
    },
    {
      id: 5,
      name: "Информация о транспортировке и ссылки для менеджера",
      component: () => (
        <>
          <TransportInfo />
          <ManagerLink
            title="приема наемником"
            link="https://tasu.kz/shortlive_reference_607/"
          />
          <ManagerLink
            title="передачи наемником"
            link="https://tasu.kz/shortlive_reference_148/"
          />
        </>
      ),
    },
    {
      id: 6,
      name: "Договор и услуги",
      component: () => (
        <>
          <Agreement />
          <ServicesTable />
        </>
      ),
    },
    {
      id: 7,
      name: "Документы для отправки",
      component: () => (
        <>
          <Shipping />
          <AccountingEsf />
          <AccountingAbp />
        </>
      ),
    },
    { id: 8, name: "QR Код акта", component: QrAct },
    {
      id: 9,
      name: "Подтверждение успешной отправки",
      component: CreateSuccessAct,
    },
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const { data: session, status } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const actStatus: string = "готов к отправке";
  const role: string = "manager";

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

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

  const ProgressBar = ({ step }: { step: number }) => {
    const percentage = Math.round(((step + 1) / steps.length) * 100);
    return (
      <div className="w-full flex flex-col items-center">
        <div className="w-full bg-gray-200 rounded-full h-2.5 relative">
          <div
            className="bg-yellow-400 h-2.5 rounded-full"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <p className="text-sm mt-2">
          Шаг {step + 1} из {steps.length} ({percentage}%)
        </p>
      </div>
    );
  };

  const CurrentComponent = steps[currentStep].component as any;

  return (
    <>
      <div className="block min-[500px]:hidden p-4 max-w-md bg-yellow-50 min-h-screen">
        <h1 className="text-xl font-semibold text-center mb-4">ПриемСдатчик</h1>
        <ProgressBar step={currentStep} />

        <div className="my-4">
          <CurrentComponent />
        </div>

        <div className="flex justify-between mt-4">
          {currentStep > 0 && (
            <button
              onClick={handlePrevious}
              className="font-semibold px-4 py-2 bg-white border border-gray-500 text-black rounded-lg hover:bg-gray-100"
            >
              Назад
            </button>
          )}

          {currentStep < steps.length - 1 ? (
            <button
              onClick={handleNext}
              className="font-semibold px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500"
            >
              Далее
            </button>
          ) : (
            <button
              onClick={handleSend}
              className="font-semibold px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500"
            >
              Отправить
            </button>
          )}
        </div>
      </div>
      <div className="hidden min-[500px]:flex act-flex gap-4 mt-4 w-full">
        <div className="flex flex-col lg:w-1/2 space-y-4">
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
        <div className="flex flex-col lg:w-1/2 space-y-4">
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
