"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Customer from "@/components/Customer";
import PackageCharacteristics from "@/components/PackageCharacteristics";
import CargoPhoto from "@/components/CargoPhoto";
import InformationPackage from "@/components/PackageInformation";
import CreateSuccessAct from "@/components/modals/CreateSuccessAct";
import Shipping from "@/components/Shipping";
import { useParams } from "next/navigation";
import { axiosInstance } from "@/helper/utils";
import { Act } from "@/helper/types";

const steps = [
  { id: 1, name: "Данные о Заказчике", component: Customer },
  { id: 2, name: "Характер и Вес Груза", component: PackageCharacteristics },
  { id: 3, name: "Фотографии Груза", component: CargoPhoto },
  { id: 4, name: "Перевозка", component: Shipping },
  { id: 5, name: "Данные о Получении Груза", component: InformationPackage },
];

// Helper function to build FormData from actData
const buildFormData = (data: Act): FormData => {
  const formData = new FormData();

  const fileFields = [
    "accounting_esf",
    "accounting_avr",
    "contract_original_act",
    "contract_mercenary_and_warehouse",
  ];

  const jsonKeys = [
    "customer_data",
    "characteristic",
    "cargo",
    "cargo_images",
    "driver_data",
    "vehicle_data",
    "receiver_data",
    "receiving_cargo_info",
    "delivery_cargo_info",
    "transportation",
  ];

  Object.keys(data).forEach((key) => {
    const value = data[key as keyof Act];

    // Rename transportation_services to transportation_service_ids
    if (key === "transportation_services") {
      const services = Array.isArray(value) ? value : [];
      services.forEach((service) =>
        formData.append("transportation_service_ids", service.toString())
      );
      return;
    }

    if (jsonKeys.includes(key)) {
      const jsonValue = value === null || value === undefined ? {} : value;
      formData.append(key, JSON.stringify(jsonValue));
      return;
    }

    if (typeof value === "boolean") {
      formData.append(key, value ? "true" : "false");
      return;
    }

    if (value !== undefined && value !== null) {
      formData.append(key, value.toString());
    }
  });

  if (!(data as any).transportation) {
    formData.append("transportation", JSON.stringify({}));
  }

  return formData;
};

export default function ActPage() {
  const { data: session, status } = useSession();
  const [currentStep, setCurrentStep] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actStatus, setActStatus] = useState("акт сформирован");
  const [actData, setActData] = useState<Act | null>(null);
  const params = useParams();

  useEffect(() => {
    const fetchActData = async () => {
      try {
        const response = await axiosInstance.get(`/acts/${params.id}/`);
        setActData(response.data);
      } catch (error) {
        console.error("Error fetching act data:", error);
      }
    };

    if (params.id) {
      fetchActData();
    }
  }, [params.id]);

  if (status === "loading") {
    return <div>Loading session...</div>;
  }

  // Show a loader until actData is fetched
  if (!actData) {
    return <div>Loading act data...</div>;
  }

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

  const handlePrint = () => {
    window.print();
  };

  const handleSend = async () => {
    try {
      const formData = buildFormData(actData);
      const response = await axiosInstance.patch(
        `/acts/${params.id}/`,
        formData
      );
      console.log("Patch response:", response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error sending act data:", error);
      alert("Ошибка при отправке акта");
    }
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

  const CurrentComponent = steps[currentStep].component;

  return (
    <>
      {/* Mobile Layout */}
      <div className="block min-[500px]:hidden p-4 max-w-md bg-yellow-50">
        <h1 className="text-xl font-semibold text-center mb-4">ПриемСдатчик</h1>
        <ProgressBar step={currentStep} />

        <div className="my-4">
          <CurrentComponent
            title="О получении"
            setData={setActData}
            data={actData}
          />
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
              className="font-semibold px-4 py-2 text-black rounded-lg"
            >
              Далее
            </button>
          ) : (
            <button
              onClick={handleSend}
              className="font-semibold px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg"
            >
              Отправить
            </button>
          )}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden min-[500px]:flex act-flex gap-4 mt-4 w-full">
        <div className="flex flex-col md:w-1/2 space-y-4">
          <Customer setData={setActData} data={actData} />
          <PackageCharacteristics setData={setActData} data={actData} />
          <CargoPhoto setData={setActData} data={actData} />
        </div>
        <div className="flex flex-col md:w-1/2 space-y-4">
          <InformationPackage
            title="О получении"
            setData={setActData}
            data={actData}
          />
        </div>
      </div>

      <div className="flex justify-between min-[1050px]:flex-row flex-col">
        <div className="flex flex-col space-y-4 mt-4">
          <button
            onClick={handlePrint}
            className="font-semibold border border-gray-500 px-4 py-2 bg-white hover:bg-gray-100 text-black text-sm rounded-lg flex items-center gap-2 w-60"
          >
            Распечатать Акт
          </button>
          <div className="flex items-center space-x-4">
            <label className="text-sm font-semibold text-gray-700">
              Статус:
            </label>
            <select
              value={actStatus}
              onChange={(e) => setActStatus(e.target.value)}
              className="border rounded-lg px-2 py-1 bg-white focus:ring-2 focus:ring-yellow-400"
            >
              <option value="акт сформирован">акт сформирован</option>
              <option value="на хранении">на хранении</option>
              <option value="отправлен">отправлен</option>
            </select>
          </div>
        </div>
      </div>

      {isModalOpen && <CreateSuccessAct setIsModalOpen={setIsModalOpen} />}
    </>
  );
}
