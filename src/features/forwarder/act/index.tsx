"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useRef, useMemo } from "react";
import Customer from "@/components/Customer";
import PackageCharacteristics from "@/components/PackageCharacteristics";
import CargoPhoto from "@/components/CargoPhoto";
import InformationPackage from "@/components/PackageInformation";
import Shipping from "@/components/Shipping";
import CreateSuccessAct from "@/components/modals/CreateSuccessAct";
import { useParams } from "next/navigation";
import { axiosInstance, getStatusBadge } from "@/helper/utils";
import { Act, Status } from "@/helper/types";
import QrAct from "@/components/QrAct";

function normalizeValue(val: any): any {
  if (typeof val === "number" && isNaN(val)) return "";
  if (val === null || val === undefined) return "";
  return val;
}

function isEqualNormalized(val1: any, val2: any): boolean {
  if (
    typeof val1 === "number" &&
    isNaN(val1) &&
    typeof val2 === "number" &&
    isNaN(val2)
  ) {
    return true;
  }
  if (
    typeof val1 === "object" &&
    val1 !== null &&
    typeof val2 === "object" &&
    val2 !== null
  ) {
    if (Array.isArray(val1) && Array.isArray(val2)) {
      return (
        JSON.stringify(val1.map(normalizeValue)) ===
        JSON.stringify(val2.map(normalizeValue))
      );
    }
    return (
      JSON.stringify(normalizeValue(val1)) ===
      JSON.stringify(normalizeValue(val2))
    );
  }
  return normalizeValue(val1) === normalizeValue(val2);
}

function getChangedFields<T>(initial: T, current: T): Partial<T> {
  const diff: Partial<T> = {};
  const keys = new Set([
    ...Object.keys(initial as any),
    ...Object.keys(current as any),
  ]);
  keys.forEach((key) => {
    const typedKey = key as keyof T;
    const initVal = initial[typedKey];
    const currVal = current[typedKey];
    if (!isEqualNormalized(initVal, currVal)) {
      if (
        typeof initVal === "object" &&
        initVal !== null &&
        typeof currVal === "object" &&
        currVal !== null &&
        !Array.isArray(initVal) &&
        !Array.isArray(currVal)
      ) {
        const nestedDiff = getChangedFields(initVal, currVal);
        if (Object.keys(nestedDiff).length > 0) {
          diff[typedKey] = nestedDiff as any;
        }
      } else {
        diff[typedKey] = currVal;
      }
    }
  });
  return diff;
}

function buildFormData(diff: Partial<Act>): FormData {
  const formData = new FormData();
  (Object.keys(diff) as (keyof Act)[]).forEach((key) => {
    const value = diff[key];
    if (value === null || value === undefined) return;

    // Special handling for transportation_services:
    if (key === "transportation_services") {
      const services = Array.isArray(value) ? value : [];
      services.forEach((service: any) =>
        formData.append("transportation_service_ids", service.toString())
      );
      return;
    }

    // Special handling for file arrays (e.g. accountant_photo)
    if (key === "accountant_photo") {
      if (Array.isArray(value)) {
        value.forEach((file: any) => {
          if (file instanceof File) {
            formData.append("accountant_photo", file);
          }
        });
      }
      return;
    }

    // Special handling for cargo and cargo_images: send as JSON
    if (key === "cargo" || key === "cargo_images") {
      formData.append(key, JSON.stringify(value));
      return;
    }

    if (value instanceof File) {
      formData.append(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item instanceof File) {
          formData.append(`${key}`, item);
        } else {
          formData.append(`${key}`, item + "");
        }
      });
    } else if (typeof value === "object") {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value + "");
    }
  });
  return formData;
}

// Ensure new acts always have a transportation object.
const initialActData: any = {
  number: "",
  qr_code: { qr: "" },
  customer_data: {
    id: 0,
    full_name: "",
    signature: "",
    customer_is_payer: false,
    role: "",
  },
  characteristic: {
    cargo_cost: 0,
    sender_city: "",
    receiver_city: "",
    additional_info: "",
  },
  cargo: [],
  cargo_images: [],
  contract_mercenary_and_warehouse: "",
  transportation: {
    sender: "",
    receiver: "",
    sender_is_payer: false,
  },
};

export default function ActPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [currentStep, setCurrentStep] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statuses, setStatuses] = useState<Status[]>([]);
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
            />
          </>
        ),
      },
    ],
    []
  );

  // If editing, actData is null until fetched; if creating, use initialActData.
  const [actData, setActData] = useState<Act | null>(
    params.id ? null : initialActData
  );
  const originalDataRef = useRef<Act | null>(null);

  useEffect(() => {
    if (params.id) {
      const fetchActData = async () => {
        try {
          const response = await axiosInstance.get(`/acts/${params.id}/`);
          const sanitizedData = JSON.parse(
            JSON.stringify(response.data, (key, value) =>
              typeof value === "number" && isNaN(value) ? "" : value
            )
          );
          setActData(sanitizedData);
          originalDataRef.current = sanitizedData;
        } catch (error) {
          console.error("Error fetching act data:", error);
        }
      };
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

  const handleSend = async () => {
    try {
      if (!originalDataRef.current || !actData) return;
      const changedData = getChangedFields(originalDataRef.current, actData);
      if (!changedData || Object.keys(changedData).length === 0) {
        console.log("No changes detected, nothing to update.");
        return;
      }
      const formData = buildFormData(changedData);
      const response = await axiosInstance.patch(
        `/acts/${params.id}/`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      originalDataRef.current = response.data;
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
      <div className="flex flex-wrap items-center max-[500px]:mt-4 gap-2 sm:gap-4">
        <h2 className="font-semibold text-base sm:text-lg">
          Номер акта {actData.number}
        </h2>
        {getStatusBadge(
          statuses.find((s) => s.key === actData.status)?.value ||
            actData.status ||
            "Status"
        )}
      </div>
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
          <div className="flex items-center space-x-4">
            <label className="text-sm font-semibold text-gray-700">
              Статус:
            </label>
            <select
              value={
                statuses.find((s) => s.value == actData.status)?.key ||
                actData.status ||
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
          {/* Отправить на хранение button now triggers PATCH API immediately */}
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

      {isModalOpen && (
        <CreateSuccessAct
          title="Акт успешно обновлен!"
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </>
  );
}
