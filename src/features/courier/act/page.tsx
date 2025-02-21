"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import Customer from "@/components/Customer";
import PackageCharacteristics from "@/components/PackageCharacteristics";
import CargoPhoto from "@/components/CargoPhoto";
import InformationPackage from "@/components/PackageInformation";
import Shipping from "@/components/Shipping";
import CreateSuccessAct from "@/components/modals/CreateSuccessAct";
import { useParams } from "next/navigation";
import { axiosInstance } from "@/helper/utils";
import { Act } from "@/helper/types";
import QrAct from "@/components/QrAct";

// --- Normalization & Deep Diff Utilities ---

// Normalize a primitive value so that null, undefined, and NaN become an empty string.
function normalize(val: any): any {
  if (val === null || val === undefined) return "";
  if (typeof val === "number" && Number.isNaN(val)) return "";
  return val;
}

// Recursively compare two values after normalizing primitives.
// If they are deeply equal, return undefined.
// Otherwise, if they’re not objects, return the current value.
// For objects, compare key by key.
function deepDiff(initial: any, current: any): any {
  if (
    (typeof initial !== "object" || initial === null) &&
    (typeof current !== "object" || current === null)
  ) {
    const normInitial = normalize(initial);
    const normCurrent = normalize(current);
    if (normInitial === normCurrent) return undefined;
    return normCurrent;
  }

  if (JSON.stringify(initial) === JSON.stringify(current)) {
    return undefined;
  }

  const diff: any = {};
  const keys = new Set([
    ...Object.keys(initial || {}),
    ...Object.keys(current || {}),
  ]);
  keys.forEach((key) => {
    const d = deepDiff(
      initial ? initial[key] : undefined,
      current ? current[key] : undefined
    );
    if (d !== undefined) {
      diff[key] = d;
    }
  });
  return Object.keys(diff).length === 0 ? undefined : diff;
}

// Returns an object containing only the changed fields (deeply compared)
function getChangedFields<T>(initial: T, current: T): Partial<T> {
  const diff: Partial<T> = {} as Partial<T>;
  const initialRecord = initial as Record<string, any>;
  const currentRecord = current as Record<string, any>;

  const keys = new Set([
    ...Object.keys(initialRecord),
    ...Object.keys(currentRecord),
  ]);

  keys.forEach((key) => {
    const changed = deepDiff(initialRecord[key], currentRecord[key]);
    if (changed !== undefined) {
      console.log(`Change detected for "${key}":`, {
        before: initialRecord[key],
        after: currentRecord[key],
        diff: changed,
      });
      diff[key as keyof T] = changed;
    }
  });
  return diff;
}

// Build FormData from the diff object.
const buildFormData = (data: any): FormData => {
  const formData = new FormData();

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
    const value = data[key];

    if (key === "transportation_services") {
      const services = Array.isArray(value) ? value : [];
      services.forEach((service: any) =>
        formData.append("transportation_services", service.toString())
      );
      return;
    }

    if (jsonKeys.includes(key)) {
      formData.append(key, JSON.stringify(value));
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

  if (!data.transportation) {
    formData.append("transportation", JSON.stringify({}));
  }

  return formData;
};

const steps = [
  { id: 1, name: "Данные о Заказчике", component: Customer },
  { id: 2, name: "Характер и Вес Груза", component: PackageCharacteristics },
  { id: 3, name: "Фотографии Груза", component: CargoPhoto },
  { id: 4, name: "Перевозка", component: Shipping },
  { id: 5, name: "Данные о Получении Груза", component: InformationPackage },
];

export default function ActPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [currentStep, setCurrentStep] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actData, setActData] = useState<Act | null>(null);
  // Store the originally fetched data for diffing
  const originalDataRef = useRef<Act | null>(null);
  const params = useParams();

  useEffect(() => {
    if (params.id) {
      const fetchActData = async () => {
        try {
          const response = await axiosInstance.get(`/acts/${params.id}/`);
          // Sanitize data: replace null/NaN with empty strings
          const sanitizedData = JSON.parse(
            JSON.stringify(response.data, (key, value) =>
              typeof value === "number" && isNaN(value) ? "" : value
            )
          );
          setActData(sanitizedData);
          originalDataRef.current = sanitizedData;
          // Optionally, a second fetch after 500ms could be added here if needed.
        } catch (error) {
          console.error("Error fetching act data:", error);
        }
      };
      fetchActData();
    }
  }, [params.id]);

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

  // Patch sending logic: only send fields that differ from the original.
  const handleSend = async () => {
    try {
      if (!originalDataRef.current || !actData) return;
      const changedData = getChangedFields(originalDataRef.current, actData);

      if (!changedData || Object.keys(changedData).length === 0) {
        console.log("No changes detected, nothing to update.");
        return;
      }

      console.log("Changed data to be patched:", changedData);
      const formData = buildFormData(changedData);

      const response = await axiosInstance.patch(
        `/acts/${params.id}/`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("Patch response:", response.data);
      setActData(response.data);
      originalDataRef.current = response.data;
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

  const CurrentComponent = steps[currentStep].component as any;

  if (sessionStatus === "loading") {
    return <div>Загрузка сессии...</div>;
  }

  if (!actData) {
    return <div>Загрузка данных акта...</div>;
  }

  return (
    <>
      {/* Mobile Layout */}
      <div className="block min-[500px]:hidden p-4 max-w-md bg-yellow-50">
        <h1 className="text-xl font-semibold text-center mb-4">ПриемСдатчик</h1>
        <ProgressBar step={currentStep} />
        <div className="my-4">
          <CurrentComponent
            data={actData}
            setData={setActData}
            title="О получении"
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
              className="font-semibold px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500"
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
          <Customer data={actData} setData={setActData} />
          <PackageCharacteristics data={actData} setData={setActData} />
          <CargoPhoto data={actData} setData={setActData} />
        </div>
        <div className="flex flex-col md:w-1/2 space-y-4">
          <Shipping data={actData} setData={setActData} />
          <InformationPackage
            title="О получении"
            data={actData}
            setData={setActData}
          />
          {actData.status === "готов к отправке" && (
            <QrAct
              qrCodeUrl={actData?.qr_code + ""}
              actNumber={actData?.number + ""}
              description="Lorem ipsum dolor sit amet consectetur. Dictum morbi ut lacus ultrices pulvinar lectus adipiscing sit."
            />
          )}
        </div>
      </div>

      {/* Bottom Section for Desktop */}
      <div className="flex justify-between min-[1050px]:flex-row flex-col">
        <div className="flex flex-col space-y-4 mt-4">
          <button
            onClick={handlePrint}
            className="font-semibold border border-gray-500 px-4 py-2 bg-white hover:bg-gray-100 text-black text-sm rounded-lg flex items-center gap-2 w-60"
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
          <div className="flex items-center space-x-4">
            <label className="text-sm font-semibold text-gray-700">
              Статус:
            </label>
            <select
              value={actData.status}
              onChange={(e) =>
                setActData((prev: any) => ({
                  ...prev,
                  status: e.target.value,
                }))
              }
              className="border rounded-lg px-2 py-1 bg-white focus:ring-2 focus:ring-yellow-400"
            >
              <option value="акт сформирован">акт сформирован</option>
              <option value="на хранении">на хранении</option>
              <option value="отправлен">отправлен</option>
            </select>
          </div>
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
          <button className="font-semibold border border-gray-500 px-4 py-2 bg-white hover:bg-gray-100 text-black rounded-lg">
            Сохранить
          </button>
          <button
            onClick={handleSend}
            className="font-semibold px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg"
          >
            Отправить
          </button>
        </div>
      </div>

      {isModalOpen && <CreateSuccessAct setIsModalOpen={setIsModalOpen} />}
    </>
  );
}
