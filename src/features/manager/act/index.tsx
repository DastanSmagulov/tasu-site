"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useMemo } from "react";
import Customer from "@/components/Customer";
import PackageCharacteristics from "@/components/PackageCharacteristics";
import CargoPhoto from "@/components/CargoPhoto";
import InformationPackage from "@/components/PackageInformation";
import Shipping from "@/components/Shipping";
import CreateSuccessAct from "@/components/modals/CreateSuccessAct";
import { useParams } from "next/navigation";
import { axiosInstance } from "@/helper/utils";
import { Act } from "@/helper/types";
import CustomerReceiver from "@/components/CustomerReceiver";
import TransportationTypes from "@/components/TransportationType";
import DriverInfo from "@/components/DriverInfo";
import TransportInfo from "@/components/TransportInfo";
import ManagerLink from "@/components/ManagerLink";
import TransportationServicesTable from "@/components/TransportationServicesTable";
import AccountingEsf from "@/features/accountant/AccountingEsf";
import AccountingAvr from "@/features/accountant/AccountingAvr";
import Checkbox from "@/components/ui/CheckBox";
import "../../../styles/globals.css";
import Agreement from "@/components/Agreement";
import QrAct from "@/components/QrAct";

interface TransportationQuantityService {
  id: number;
  name: string;
  quantity: string;
  price: string;
}

interface Status {
  key: string;
  value: string;
}

// Your initial act data (default values)
const initialActData: any = {
  contract_original_act: null,
  contract_mercenary_and_warehouse: null,
  number: "0",
  accounting_esf: null,
  accounting_avr: null,
  cargo_status: "",
  customer_data: {
    id: 0,
    full_name: "",
    phone: "",
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
  transportation_type: "",
  driver_data: {
    full_name: "",
    id_card_number: "",
    technical_passport: "",
  },
  vehicle_data: {
    auto_info: "",
    state_number: "",
  },
  packaging_is_damaged: false,
  receiver_data: {
    id: 0,
    full_name: "",
    phone: "",
    signature: "",
    role: "",
  },
  receiving_cargo_info: {
    issued: "",
    accepted: "",
    date: "",
  },
  transportation_services: [],
  delivery_cargo_info: {
    issued: "",
    accepted: "",
    date: "",
  },
  transportation: {
    sender: "",
    receiver: "",
    sender_is_payer: false,
  },
  status: "FORMED", // We'll use keys here (e.g. "FORMED")
};

//
// Helper functions for normalization and diffing (unchanged)
//
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
          formData.append(`${key}[]`, item + "");
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
  const [actData, setActData] = useState<Act>(initialActData);
  const [originalActData, setOriginalActData] = useState<Act>(initialActData);
  const [transportationQuantityServices, setTransportationQuantityServices] =
    useState<TransportationQuantityService[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const params = useParams();

  useEffect(() => {
    if (params.id) {
      const fetchActData = async () => {
        try {
          const response = await axiosInstance.get(`/acts/${params.id}/`);
          console.log("Fetched act data:", response.data);
          setActData(response.data);
          setOriginalActData(response.data);
        } catch (error) {
          console.error("Error fetching act data:", error);
        }
      };

      // First fetch on mount.
      fetchActData();

      // Second fetch after 500ms.
      const timer = setTimeout(() => {
        fetchActData();
      }, 500);

      return () => clearTimeout(timer);
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

  // Fetch available transportation services.
  useEffect(() => {
    const fetchTransportationQuantityServices = async () => {
      try {
        const response = await axiosInstance.get(
          `admin/transportation-services/quantity/`
        );
        setTransportationQuantityServices(
          response.data.results.map(
            (service: TransportationQuantityService) => ({
              id: service.id,
              name: service.name,
              quantity: service.quantity,
              price: service.price,
            })
          )
        );
      } catch (error) {
        console.error(
          "Error fetching transportation quantity services:",
          error
        );
      }
    };
    fetchTransportationQuantityServices();
  }, []);

  const handleNext = () => {
    setCurrentStep((prev) => (prev < stepsMemo.length - 1 ? prev + 1 : prev));
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handlePrint = () => {
    window.print();
  };

  // Handle sending patch: compute diff and send only changed fields.
  const handleSend = async () => {
    try {
      const changedData = getChangedFields(originalActData, actData);
      const formData = buildFormData(changedData);
      console.log(actData);
      const response = await axiosInstance.patch(
        `/acts/${params.id}/`,
        formData
      );
      console.log(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error sending act data:", error);
      alert("Ошибка при отправке акта");
    }
  };

  // Memoize steps for mobile and desktop layouts.
  const stepsMemo = useMemo(
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
            <InformationPackage
              title={"О получении"}
              data={props.data}
              setData={props.setData}
            />
          </>
        ),
      },
      {
        id: 4,
        name: "Типы транспорта и информация о водителе",
        component: (props: {
          data: Act;
          setData: React.Dispatch<React.SetStateAction<Act>>;
        }) => (
          <>
            <TransportationTypes data={props.data} setData={props.setData} />
            <DriverInfo data={props.data} setData={props.setData} />
          </>
        ),
      },
      {
        id: 5,
        name: "Информация о транспортировке и ссылки для менеджера",
        component: (props: {
          data: Act;
          setData: React.Dispatch<React.SetStateAction<Act>>;
        }) => (
          <>
            <TransportInfo data={props.data} setData={props.setData} />
            <ManagerLink
              title="приема наемником"
              link="https://tasu-site.vercel.app/carrier"
            />
            <ManagerLink
              title="передачи наемником"
              link="https://tasu-site.vercel.app/carrier/packageInfo"
            />
          </>
        ),
      },
      {
        id: 6,
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
            <TransportationServicesTable
              availableTransportationServices={transportationQuantityServices}
              data={actData}
              onChange={(newSelectedIds: number[]) =>
                setActData((prev) => ({
                  ...prev,
                  transportation_service_ids: newSelectedIds,
                }))
              }
            />
            <InformationPackage
              title={"О выдаче"}
              data={actData}
              setData={setActData}
            />
          </>
        ),
      },
      {
        id: 7,
        name: "Документы для отправки",
        component: (props: {
          data: Act;
          setData: React.Dispatch<React.SetStateAction<Act>>;
        }) => (
          <>
            {/* <Shipping data={props.data} setData={props.setData} /> */}
            <AccountingEsf data={props.data} setData={props.setData} />
            <AccountingAvr data={props.data} setData={props.setData} />
          </>
        ),
      },
      {
        id: 8,
        name: "QR Код акта",
        component: () => (
          <>
            {actData && actData.status === "READY_FOR_SHIPMENT" && (
              <QrAct
                qrCodeUrl="/images/qr-code.png"
                actNumber={actData?.number + ""}
                description="Lorem ipsum dolor sit amet consectetur. Dictum morbi ut lacus ultrices pulvinar lectus adipiscing sit."
              />
            )}
          </>
        ),
      },
      {
        id: 9,
        name: "Подтверждение успешной отправки",
        component: () => <CreateSuccessAct />,
      },
    ],
    [actData, transportationQuantityServices]
  );

  const CurrentComponent = stepsMemo[currentStep].component as any;

  if (sessionStatus === "loading") {
    return <div>Загрузка...</div>;
  }

  return (
    <>
      {/* Mobile Layout */}
      <div className="block min-[500px]:hidden p-4 max-w-md bg-yellow-50">
        <h1 className="text-xl font-semibold text-center mb-4">ПриемСдатчик</h1>
        <div className="w-full flex flex-col items-center">
          <div className="w-full bg-gray-200 rounded-full h-2.5 relative">
            <div
              className="bg-yellow-400 h-2.5 rounded-full"
              style={{
                width: `${Math.round(
                  ((currentStep + 1) / stepsMemo.length) * 100
                )}%`,
              }}
            ></div>
          </div>
          <p className="text-sm mt-2">
            Шаг {currentStep + 1} из {stepsMemo.length} (
            {Math.round(((currentStep + 1) / stepsMemo.length) * 100)}%)
          </p>
        </div>
        <div className="my-4 overflow-x-hidden flex flex-col gap-3">
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
          {currentStep < stepsMemo.length - 1 ? (
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
      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
        <h2 className="font-semibold text-base sm:text-lg">
          Номер акта {actData.number}
        </h2>
        <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-500 text-white">
          {statuses.find((s) => s.key === actData.status)?.value ||
            actData.status ||
            "Status"}
        </span>
      </div>
      <div className="hidden min-[500px]:flex act-flex gap-4 mt-4 w-full">
        <div className="flex flex-col lg:w-1/2 space-y-4">
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
                    setActData((prev) => ({
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
              link="https://tasu-site.vercel.app/carrier"
            />
            <ManagerLink
              title="передачи наемником"
              link="https://tasu-site.vercel.app/carrier/packageInfo"
            />
          </div>
          <Agreement original={true} data={actData} setData={setActData} />
        </div>
        <div className="flex flex-col lg:w-1/2 space-y-4">
          <CustomerReceiver data={actData} setData={setActData} />
          <InformationPackage
            title={"О получении"}
            data={actData}
            setData={setActData}
          />
          <Agreement original={false} data={actData} setData={setActData} />
          <TransportationServicesTable
            availableTransportationServices={transportationQuantityServices}
            data={actData}
            onChange={(newSelectedIds: number[]) =>
              setActData((prev) => ({
                ...prev,
                transportation_service_ids: newSelectedIds,
              }))
            }
          />
          <InformationPackage
            title={"О выдаче"}
            data={actData}
            setData={setActData}
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
              value={
                statuses.find((s) => s.value == actData.status)?.key ||
                actData.status ||
                "Status"
              }
              onChange={(e) =>
                setActData((prev) => ({ ...prev, status: e.target.value }))
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
            onClick={() =>
              setActData((prev) => ({ ...prev, status: "SENT_TO_STORAGE" }))
            }
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
