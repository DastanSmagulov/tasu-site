"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Customer from "@/components/Customer";
import PackageCharacteristics from "@/components/PackageCharacteristics";
import CargoPhoto from "@/components/CargoPhoto";
import { useEffect, useState } from "react";
import InformationPackage from "@/components/PackageInformation";
import CreateSuccessAct from "@/components/modals/CreateSuccessAct";
import { Act } from "@/helper/types";
import { useParams } from "next/navigation";
import { axiosInstance } from "@/helper/utils";

// Define the data type for your document (if needed)
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

const steps = [
  { id: 1, name: "Данные о Заказчике", component: Customer },
  { id: 2, name: "Характер и Вес Груза", component: PackageCharacteristics },
  { id: 3, name: "Фотографии Груза", component: CargoPhoto },
  { id: 4, name: "Данные о Получения Груза", component: InformationPackage },
];

const initialActData: any = {
  number: "",
  qr_code: {
    qr: "",
  },
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
  receiving_cargo_info: {
    issued: "",
    accepted: "",
    date: "",
  },
  cargo_images: [],
  transportation: {
    sender: "1",
    receiver: "5",
    sender_is_payer: true,
  },
};

export default function CreateActPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStorageChecked, setIsStorageChecked] = useState(false);
  const [actStatus, setActStatus] = useState("акт сформирован");
  const [actData, setActData] = useState<Act>(initialActData);
  const params = useParams();

  useEffect(() => {
    // If there is an ID, fetch the existing act data (edit mode)
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

  if (status === "loading") {
    return <div>Загрузка...</div>;
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

  // Helper function to convert any property named "id" (or ending in "_id")
  // to a number. It does this recursively on arrays and objects.
  const convertIds = (data: any): any => {
    if (Array.isArray(data)) {
      return data.map(convertIds);
    } else if (typeof data === "object" && data !== null) {
      const newObj: any = {};
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const value = data[key];
          if (key.toLowerCase() === "id" || key.toLowerCase().endsWith("_id")) {
            // Convert to number if possible (if empty string, use 0)
            newObj[key] = value === "" || value === null ? 0 : Number(value);
          } else {
            newObj[key] = convertIds(value);
          }
        }
      }
      return newObj;
    }
    return data;
  };

  const handleSend = async () => {
    try {
      // First, convert all id fields to numbers.
      const convertedActData = convertIds(actData);

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
        const value = convertedActData[field];
        console.log(`Field ${field}:`, value);
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

      // Append the remaining fields from convertedActData.
      (Object.keys(convertedActData) as (keyof Act)[]).forEach((key) => {
        // Skip file fields already processed.
        if (fileFields.includes(key)) return;
        const value = convertedActData[key];
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
      console.log("response", response.data);
      setActData(response.data);
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
            title="О Получении"
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
              className="font-semibold px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500"
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
          <InformationPackage
            title="О Получении"
            data={actData}
            setData={setActData}
          />
        </div>
      </div>

      {/* New Bottom-Left Section */}
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
