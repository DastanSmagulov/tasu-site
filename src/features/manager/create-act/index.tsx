"use client";

import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
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
import AccountingAvr from "@/features/accountant/AccountingAvr";
import TransportationServicesTable from "@/components/TransportationServicesTable";
import { Act, CargoImage } from "@/helper/types";
import { useParams } from "next/navigation";
import { axiosInstance } from "@/helper/utils";
import Checkbox from "@/components/ui/CheckBox";

import "../../../styles/globals.css";
import CustomerReceiver from "@/components/CustomerReceiver";

// Initial actData (modify as needed)
const initialActData: any = {
  number: "",
  qr_code: {
    qr: "",
  },
  contract_original_act: null,
  contract_mercenary_and_warehouse: null,
  accounting_esf: null,
  accounting_avr: null,
  cargo_status: "",
  customer_data: {
    id: 0,
    full_name: "",
    signature: "",
    customer_is_payer: false,
    role: "",
  },
  characteristic: {
    cargo_cost: 0,
    sender_city: 1,
    receiver_city: 1,
    additional_info: "",
  },
  cargo: [],
  cargo_images: [],
  transportation_type: "",
  driver_data: {
    full_name: "",
    id_card_number: "",
    technical_passport: "",
    plane_id: "",
    partner_id: "",
    train_id: "",
  },
  vehicle_data: {
    auto_info: "",
    license_plate: "",
  },
  packaging_is_damaged: false,
  receiver_data: {
    id: 0,
    full_name: "",
    signature: "",
    role: "",
  },
  receiving_cargo_info: {
    issued: 0,
    accepted: 0,
    date: "",
  },
  transportation_services: [],
  delivery_cargo_info: {
    issued: 0,
    accepted: 0,
    date: "",
  },
  transportation: {
    sender: "",
    receiver: "",
    sender_is_payer: true,
  },
};

interface TransportationQuantityService {
  id: number;
  name: string;
  quantity: string;
  price: string;
}

export default function CreateActPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [currentStep, setCurrentStep] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actData, setActData] = useState<Act>(initialActData);
  const [transportationQuantityServices, setTransportationQuantityServices] =
    useState<TransportationQuantityService[]>([]);
  const params = useParams();

  // Define our helper function BEFORE we use it
  const fetchTransportationQuantityServices = async () => {
    try {
      const response = await axiosInstance.get(
        `admin/transportation-services/quantity/`
      );
      setTransportationQuantityServices(
        response.data.results.map((service: TransportationQuantityService) => ({
          id: service.id,
          name: service.name,
          quantity: service.quantity,
          price: service.price,
        }))
      );
    } catch (error) {
      console.error("Error fetching transportation quantity services:", error);
    }
  };

  // Fetch act data if editing an existing act
  useEffect(() => {
    if (params.id) {
      const fetchActData = async () => {
        try {
          const response = await axiosInstance.get(`/acts/${params.id}/`);
          setActData(response.data);
        } catch (error) {
          console.error("Error fetching act data:", error);
        }
      };
      fetchActData();
    }
  }, [params.id]);

  useEffect(() => {
    if (!params.id) {
      const fetchNewActData = async () => {
        try {
          const response = await axiosInstance.get("/acts/get_act_data/");
          const { act_number, qr_code } = response.data;
          setActData((prev) => ({
            ...prev,
            number: act_number,
            qr_code: { qr: qr_code },
          }));
        } catch (error) {
          console.error("Error fetching new act data:", error);
        }
      };
      fetchNewActData();
    }
  }, [params.id]);

  // Fetch the available transportation services (only once)
  useEffect(() => {
    fetchTransportationQuantityServices();
  }, []);

  const handleSend = async () => {
    console.log(actData);
    try {
      const formData = new FormData();

      // List of file fields to handle
      const fileFields: (keyof Act)[] = [
        "accounting_esf",
        "accounting_avr",
        "contract_mercenary_and_warehouse",
        "contract_original_act",
      ];

      // Append file fields:
      fileFields.forEach((field) => {
        const value = actData[field];
        if (value) {
          // If the value is a File object, append it directly.
          if (value instanceof File) {
            formData.append(field, value);
          } else if (typeof value === "string" && value.startsWith("http")) {
            // If it's a URL string (file already uploaded), append as text.
            formData.append(field, value);
          } else if (
            typeof value === "object" &&
            value !== null &&
            !Array.isArray(value)
          ) {
            const nestedObj = value as Record<string, any>;
            Object.keys(nestedObj).forEach((subKey) => {
              formData.append(`${field}[${subKey}]`, nestedObj[subKey]);
            });
          }
        }
      });

      // Append the remaining fields from actData.
      (Object.keys(actData) as (keyof Act)[]).forEach((key) => {
        // Skip file fields already processed.
        if (fileFields.includes(key)) return;
        const value = actData[key];
        if (value === null || value === undefined) return;

        // Special handling for arrays.
        if (Array.isArray(value)) {
          // For transportation_service_ids, append each id separately.
          if (key === "transportation_service_ids") {
            value.forEach((id) => {
              formData.append(key, id.toString());
            });
          } else {
            // For other arrays, you might send a JSON string.
            formData.append(key, JSON.stringify(value));
          }
        } else if (typeof value === "object") {
          // For nested objects, send as JSON.
          formData.append(key, JSON.stringify(value));
        } else {
          // For primitives, append directly.
          formData.append(key, value + "");
        }
      });
      const response = await axiosInstance.post("/acts/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error sending act data:", error);
      alert("Ошибка при отправке акта");
    }
  };

  const handleNext = () => {
    if (currentStep < stepsMemo.length - 1) {
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

  // Memoize steps for mobile and desktop layouts.
  const stepsMemo = useMemo(
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
              link="https://tasu-site.vercel.app/carrier"
            />
            <ManagerLink
              title="передачи наемником"
              link="https://tasu-site.vercel.app/carrier/packageInfo"
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
            <Agreement
              original={false}
              data={props.data}
              setData={props.setData}
            />
            <TransportationServicesTable
              availableTransportationServices={transportationQuantityServices}
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
            />
            <InformationPackage
              title={"О выдаче"}
              data={props.data}
              setData={props.setData}
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
    [transportationQuantityServices]
  );
  // Get the current step component (if needed, you could also render steps conditionally)
  const CurrentComponent = stepsMemo[currentStep].component as any;

  if (sessionStatus === "loading") {
    return <div>Загрузка...</div>;
  }

  return (
    <>
      {/* Mobile layout */}
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
              className="font-semibold px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500"
            >
              Отправить
            </button>
          )}
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden min-[500px]:flex act-flex gap-4 mt-4 w-full">
        <div className="flex flex-col lg:w-1/2 space-y-4">
          <Customer data={actData} setData={setActData} />
          <PackageCharacteristics data={actData} setData={setActData} />
          <CargoPhoto data={actData} setData={setActData} />
          <TransportationTypes data={actData} setData={setActData} />
          <DriverInfo data={actData} setData={setActData} />
          {actData?.transportation_type === "AUTO_SINGLE" ? (
            <TransportInfo data={actData} setData={setActData} />
          ) : (
            <></>
          )}
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
              link="https://tasu.kz/shortlive_reference_607/"
            />
            <ManagerLink
              title="передачи наемником"
              link="https://tasu.kz/shortlive_reference_148/"
            />
          </div>
          <Agreement original={true} data={actData} setData={setActData} />
        </div>
        <div className="flex flex-col lg:w-1/2 space-y-4">
          {/* <Shipping data={actData} setData={setActData} /> */}
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
        </div>
      </div>

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
            Отправить на хранение
          </button>
          <div className="flex items-center space-x-4">
            <label className="text-sm font-semibold text-gray-700">
              Статус:
            </label>
            <select
              value={actData?.status || ""}
              onChange={(e) => {
                setActData((prev) => ({ ...prev, status: e.target.value }));
              }}
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
      {isModalOpen && (
        <CreateSuccessAct
          title="Акт успешно создан!"
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </>
  );
}
