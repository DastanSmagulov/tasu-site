"use client";

import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import Customer from "@/components/Customer";
import PackageCharacteristics from "@/components/PackageCharacteristics";
import CargoPhoto from "@/components/CargoPhoto";
import InformationPackage from "@/components/PackageInformation";
import Shipping from "@/components/Shipping";
import CreateSuccessAct from "@/components/modals/CreateSuccessAct";
import { Act, Status } from "@/helper/types";
import { useParams } from "next/navigation";
import { axiosInstance, getStatusBadge } from "@/helper/utils";

export default function ActPage() {
  const { data: session, status } = useSession();
  const [currentStep, setCurrentStep] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actStatus, setActStatus] = useState("акт сформирован");
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [actData, setActData] = useState<Act | null>(null); // Store fetched data
  const params = useParams();
  const steps = useMemo(
    () => [
      {
        id: 1,
        name: "Данные о Заказчике",
        component: (props: {
          data: Act;
          setData: React.Dispatch<React.SetStateAction<Act>>;
        }) => <Customer data={props.data} setData={props.setData} />,
      },
      {
        id: 2,
        name: "Характеристики и вес груза",
        component: (props: {
          data: Act;
          setData: React.Dispatch<React.SetStateAction<Act>>;
        }) => (
          <PackageCharacteristics data={props.data} setData={props.setData} />
        ),
      },
      {
        id: 3,
        name: "Фотографии груза и информация о получении",
        component: (props: {
          data: Act;
          setData: React.Dispatch<React.SetStateAction<Act>>;
        }) => (
          <>
            <CargoPhoto data={props.data} setData={props.setData} />
          </>
        ),
      },
      {
        id: 4,
        name: "Перевозка",
        component: (props: {
          data: Act;
          setData: React.Dispatch<React.SetStateAction<Act>>;
        }) => (
          <>
            <Shipping data={props.data} setData={props.setData} />
          </>
        ),
      },
      {
        id: 5,
        name: "Информация о получении груза",
        component: (props: {
          data: Act;
          setData: React.Dispatch<React.SetStateAction<Act>>;
        }) => (
          <>
            <InformationPackage
              title={"О получении"}
              data={props.data}
              setData={props.setData}
              role="carrier"
            />
          </>
        ),
      },
    ],
    []
  );

  useEffect(() => {
    const fetchActData = async () => {
      try {
        const response = await axiosInstance.get(`/acts/${params.id}/`);
        setActData(response.data); // Set the fetched data
      } catch (error) {
        console.error("Error fetching act data:", error);
      }
    };

    if (params.id) {
      fetchActData();
    }
  }, [params.id]);

  // Fetch statuses from /constants/cargo_statuses/
  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const response = await axiosInstance.get("/constants/cargo_statuses/");
        setStatuses(response.data);
      } catch (error) {
        console.error("Error fetching statuses:", error);
      }
    };
    fetchStatuses();
  }, []);

  if (status === "loading") {
    return <div>Загрузка...</div>;
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Updated handleSend: PATCH actData to the backend and then open the modal.
  const handleSend = async () => {
    if (!actData) {
      alert("Нет данных акта для отправки");
      return;
    }
    try {
      const response = await axiosInstance.patch(
        `/acts/${params.id}/`,
        actData
      );
      console.log("Patch response:", response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error sending act data:", error);
      alert("Ошибка при отправке акта");
    }
  };

  // NEW: Function to immediately trigger patch API for sending to storage.
  const handleSendToStorage = async () => {
    try {
      const response = await axiosInstance.patch(`/acts/${params.id}/`, {
        status: "SENT_TO_STORAGE",
      });
      setActData(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error sending act to storage:", error);
      alert("Ошибка при отправке на хранение");
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

  // Pass both data and setData to components so they can update actData
  const CurrentComponent = steps[currentStep].component as any;

  return (
    <>
      {/* Mobile Layout */}
      <div className="block min-[500px]:hidden p-4 max-w-md">
        <h1 className="text-xl font-semibold text-center mb-4">ПриемСдатчик</h1>
        <ProgressBar step={currentStep} />
        <div className="my-4">
          <CurrentComponent data={actData} setData={setActData} />
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
              Сохранить
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center max-[500px]:mt-4 gap-2 sm:gap-4">
        <h2 className="font-semibold text-base sm:text-lg">
          Номер акта {actData?.number}
        </h2>
        {getStatusBadge(
          statuses.find((s) => s.key === actData?.status)?.value ||
            actData?.status ||
            "Status"
        )}
      </div>
      {/* Desktop Layout */}
      <div className="hidden min-[500px]:flex act-flex gap-4 mt-4 w-full">
        <div className="flex flex-col md:w-1/2 space-y-4">
          <Customer data={actData} setData={setActData} />
          <PackageCharacteristics data={actData} setData={setActData} />
          <CargoPhoto data={actData} setData={setActData} />
        </div>
        <div className="flex flex-col md:w-1/2 space-y-4">
          {/* {actStatus === "готов к отправке" && <Shipping />} */}
          <InformationPackage
            title="О Получении"
            data={actData}
            setData={setActData}
            role="carrier"
          />
        </div>
      </div>

      {/* Bottom-Left Section */}
      <div className="flex justify-between min-[1050px]:flex-row flex-col">
        <div className="flex flex-col space-y-4 mt-4">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-semibold text-gray-700">
              Статус:
            </label>
            <select
              value={
                statuses.find((s) => s.value == actData?.status)?.key ||
                actData?.status ||
                "Status"
              }
              onChange={(e) =>
                setActData((prev: any) => ({ ...prev, status: e.target.value }))
              }
              className="border rounded-lg px-2 py-1 bg-white focus:ring-2 focus:ring-yellow-400"
            >
              {statuses.map((status) => (
                <option key={status.key} value={status.key}>
                  {status.value}
                </option>
              ))}
            </select>
          </div>
          {/* Отправить на хранение button */}
          <button
            onClick={handleSendToStorage}
            className="font-semibold border border-gray-500 px-4 py-2 bg-white hover:bg-gray-100 text-black rounded-lg"
          >
            Отправить на хранение
          </button>
        </div>
        <div className="flex gap-4 mt-4 text-[#000000] sm:h-10 min-[500px]:flex-row flex-col">
          <button
            onClick={handlePrint}
            className="font-semibold border border-gray-500 px-4 py-2 bg-white hover:bg-gray-100 text-black rounded-lg flex items-center justify-center gap-2"
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
          <button
            onClick={handleSend}
            className="font-semibold max-[500px]:hidden border border-gray-500 px-4 py-2 bg-white hover:bg-gray-100 text-black rounded-lg"
          >
            Сохранить
          </button>
        </div>
      </div>
      {isModalOpen && (
        <CreateSuccessAct
          title="Акт успешно обновлен!"
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </>
  );
}
