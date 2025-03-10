"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useRef, useMemo } from "react";
import Customer from "@/components/Customer";
import PackageCharacteristics from "@/components/PackageCharacteristics";
import CargoPhoto from "@/components/CargoPhoto";
import InformationPackage from "@/components/PackageInformation";
import CreateSuccessAct from "@/components/modals/CreateSuccessAct";
import { useParams } from "next/navigation";
import { axiosInstance, getStatusBadge } from "@/helper/utils";
import { Act, Status } from "@/helper/types";
import QrAct from "@/components/QrAct";
import TransportationTypes from "@/components/TransportationType";
import DriverInfo from "@/components/DriverInfo";
import TransportInfo from "@/components/TransportInfo";
import Checkbox from "@/components/ui/CheckBox";
import ManagerLink from "@/components/ManagerLink";
import CustomerReceiver from "@/components/CustomerReceiver";
import AccountingEsf from "@/features/accountant/AccountingEsf";
import AccountingAvr from "@/features/accountant/AccountingAvr";
import TransportationServicesTables from "@/components/TransportationServicesTable";
import Agreement from "@/components/Agreement";

// --- Normalization & Deep Diff Utilities ---
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

export default function ActPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [currentStep, setCurrentStep] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [actData, setActData] = useState<any>(null);
  // Store the originally fetched data in a ref for diffing.
  const originalDataRef = useRef<Act | null>(null);
  const params = useParams();

  const steps = useMemo(
    () => [
      {
        id: 1,
        name: "Данные о Заказчике и Получателе",
        component: (props: {
          data: Act;
          setData: React.Dispatch<React.SetStateAction<Act>>;
        }) => (
          <>
            <Customer data={props.data} setData={props.setData} />
            <CustomerReceiver data={props.data} setData={props.setData} />
          </>
        ),
      },
      {
        id: 2,
        name: "Характеристики и фотографии груза",
        component: (props: {
          data: Act;
          setData: React.Dispatch<React.SetStateAction<Act>>;
        }) => (
          <>
            <PackageCharacteristics data={props.data} setData={props.setData} />
            <CargoPhoto data={props.data} setData={props.setData} />
          </>
        ),
      },
      {
        id: 3,
        name: "Типы транспорта и информация о водителе",
        component: (props: {
          data: Act;
          setData: React.Dispatch<React.SetStateAction<Act>>;
        }) => (
          <>
            <TransportationTypes data={props.data} setData={props.setData} />
            <DriverInfo data={props.data} setData={props.setData} />
            {/* Пример условной отрисовки блока TransportInfo */}
            {props.data?.transportation_type === "AUTO_SINGLE" && (
              <TransportInfo data={props.data} setData={props.setData} />
            )}
          </>
        ),
      },
      {
        id: 4,
        name: "Упаковка и ссылки для менеджера",
        component: (props: {
          data: Act;
          setData: React.Dispatch<React.SetStateAction<Act>>;
        }) => (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-lg font-medium">
              <label className="flex items-center gap-1 cursor-pointer">
                <Checkbox
                  checked={!!props.data?.packaging_is_damaged}
                  onChange={(e) =>
                    props.setData((prev) => ({
                      ...prev,
                      packaging_is_damaged: e.target.checked,
                    }))
                  }
                />
                Нарушено ли состояние упаковки?
              </label>
            </div>
            <ManagerLink
              title="приема наемником"
              link={`https://tasu-site.vercel.app/carrier/${params.id}`}
            />
          </div>
        ),
      },
      {
        id: 5,
        name: "Договор и услуги",
        component: (props: {
          data: Act;
          setData: React.Dispatch<React.SetStateAction<Act>>;
        }) => (
          <>
            <Agreement
              original={true}
              data={props.data}
              setData={props.setData}
            />
            {/* Второй вариант договора */}
            {/* <Agreement
              original={false}
              data={props.data}
              setData={props.setData}
            /> */}
            <TransportationServicesTables
              data={props.data}
              onChange={(newSelectedIds: number[]) =>
                props.setData((prev) => ({
                  ...prev,
                  transportation_service_ids: newSelectedIds,
                }))
              }
            />
          </>
        ),
      },
      {
        id: 6,
        name: "Информация о получении и выдаче",
        component: (props: {
          data: Act;
          setData: React.Dispatch<React.SetStateAction<Act>>;
        }) => (
          <>
            <InformationPackage
              title={"О получении"}
              data={props.data}
              setData={props.setData}
              role="manager"
            />
            <InformationPackage
              title={"О выдаче"}
              data={props.data}
              setData={props.setData}
              role="manager"
            />
          </>
        ),
      },
      {
        id: 7,
        name: "Документы",
        component: (props: {
          data: Act;
          setData: React.Dispatch<React.SetStateAction<Act>>;
        }) => (
          <>
            <AccountingEsf data={props.data} setData={props.setData} />
            <AccountingAvr data={props.data} setData={props.setData} />
            {/* Если нужен QR-код */}
            {props.data?.qr_code && (
              <QrAct
                qrCodeUrl={props.data?.qr_code + ""}
                actNumber={props.data?.number + ""}
                description="Lorem ipsum dolor sit amet consectetur. Dictum morbi ut lacus ultrices pulvinar lectus adipiscing sit."
              />
            )}
          </>
        ),
      },
    ],
    []
  );

  useEffect(() => {
    if (params.id) {
      const fetchActData = async () => {
        try {
          const response = await axiosInstance.get(`/acts/${params.id}/`);
          // Sanitize data (replace null/NaN with empty strings)
          const sanitizedData = JSON.parse(
            JSON.stringify(response.data, (key, value) =>
              typeof value === "number" && isNaN(value) ? "" : value
            )
          );
          setActData(sanitizedData);
          originalDataRef.current = sanitizedData; // baseline for diffing
          // Second fetch after 500ms.
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

  // Patch sending logic: send only fields that differ from the original.
  const handleSend = async () => {
    try {
      if (!originalDataRef.current || !actData) return;

      const changedData = getChangedFields(originalDataRef.current, actData);

      // If no changes detected, avoid making an unnecessary request.
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
        <div className="hidden max-[500px]:flex mb-4 flex-wrap items-center gap-2 sm:gap-4">
          <h2 className="font-semibold text-base sm:text-lg">
            Номер акта {actData.number}
          </h2>
          {getStatusBadge(
            statuses.find((s) => s.key === actData.status)?.value ||
              actData.status ||
              "Status"
          )}
        </div>
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
              Сохранить
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
          <TransportationTypes data={actData} setData={setActData} />
          <DriverInfo data={actData} setData={setActData} />
          {actData?.transportation_type === "AUTO_SINGLE" ? (
            <TransportInfo data={actData} setData={setActData} />
          ) : null}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-lg font-medium">
              <label className="flex items-center gap-1 cursor-pointer">
                <Checkbox
                  checked={!!actData?.packaging_is_damaged}
                  onChange={(e) =>
                    setActData((prev: any) => ({
                      ...prev,
                      packaging_is_damaged: e.target.checked,
                    }))
                  }
                />
                Нарушено ли состояние упаковки?
              </label>
            </div>
            <ManagerLink
              title="приема наемником"
              link={`https://tasu-site.vercel.app/carrier/${params.id}`}
            />
          </div>
          <Agreement original={true} data={actData} setData={setActData} />
        </div>
        <div className="flex flex-col md:w-1/2 space-y-4">
          <CustomerReceiver data={actData} setData={setActData} />
          <InformationPackage
            title={"О получении"}
            data={actData}
            setData={setActData}
            role="manager"
          />
          {/* <Agreement original={false} data={actData} setData={setActData} /> */}
          <TransportationServicesTables
            data={actData}
            onChange={(newSelectedIds: number[]) =>
              setActData((prev: any) => ({
                ...prev,
                transportation_service_ids: newSelectedIds,
              }))
            }
          />
          <InformationPackage
            title={"О выдаче"}
            data={actData}
            setData={setActData}
            role="manager"
          />
          <AccountingEsf data={actData} setData={setActData} />
          <AccountingAvr data={actData} setData={setActData} />
          <QrAct
            qrCodeUrl={actData?.qr_code + ""}
            actNumber={actData?.number + ""}
            description="Lorem ipsum dolor sit amet consectetur. Dictum morbi ut lacus ultrices pulvinar lectus adipiscing sit."
          />
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
