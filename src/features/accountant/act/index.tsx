"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import CreateSuccessAct from "@/components/modals/CreateSuccessAct";
import PaymentPhoto from "@/components/PaymentPhoto";
import AccountingEsf from "@/features/accountant/AccountingEsf";
import AccountingAbp from "@/features/accountant/AccountingAvr";
import { axiosInstance } from "@/helper/utils";
import { Act } from "@/helper/types";

// Optionally, define an initial act data object if no ID is provided.
const initialActData: Act = {
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
  transportation_service_ids: [],
  delivery_cargo_info: {
    issued: "",
    accepted: "",
    date: "",
  },
  status: "акт сформирован",
};

export default function ActPage() {
  const { data: session, status } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  // actData state with its setter so that child components can update the act data.
  const [actData, setActData] = useState<Act | null>(null);
  const router = useRouter();
  const params = useParams();
  const actStatus: string = "готов к отправке";
  const role: string = "manager";

  // While session is loading, display a loader.
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  // GET API call to fill the fields.
  useEffect(() => {
    const fetchActData = async () => {
      if (params.id) {
        try {
          const response = await axiosInstance.get(`/acts/${params.id}/`);
          setActData(response.data);
        } catch (error) {
          console.error("Error fetching act data:", error);
        }
      } else {
        // No act ID provided, set actData to an initial default object.
        setActData(initialActData);
      }
    };

    if (params.id) {
      fetchActData();
    }
  }, [params.id]);

  const handlePrint = () => {
    window.print();
  };

  // Updated handleSend: sends a PATCH request with actData before opening the modal.
  const handleSend = async () => {
    if (!actData) {
      alert("Нет данных акта для отправки");
      return;
    }
    try {
      const response = await axiosInstance.patch(
        `/acts/${actData.id}/`,
        actData
      );
      console.log("Patch response:", response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error sending act data:", error);
      alert("Ошибка при отправке акта");
    }
  };

  const openExpenses = () => {
    router.push("/accountant/expenses");
  };

  return (
    <>
      <div className="flex flex-row max-lg:flex-col gap-4 mt-4 w-full">
        <div className="flex flex-col lg:w-1/2 space-y-4">
          {/* Pass both data and setData so that child components can update actData */}
          <PaymentPhoto data={actData} setData={setActData} />
          <AccountingEsf data={actData} setData={setActData} />
          <AccountingAbp data={actData} setData={setActData} />
          <div>
            <h2 className="text-lg font-semibold mb-4 text-[#1D1B23]">
              Расходы
            </h2>
            <button
              onClick={openExpenses}
              className="font-semibold px-4 py-2 rounded-lg"
            >
              Указать из таблицы
            </button>
          </div>
        </div>
        <div className="flex flex-col lg:w-1/2 space-y-4">
          {/* Uncomment Shipping if needed */}
          {/* <Shipping /> */}
        </div>
      </div>
      <div className="flex flex-wrap justify-end gap-4 mt-8 text-[#000000]">
        {/* Create Card Button */}
        <button className="font-semibold border border-gray-500 px-4 py-2 bg-white hover:bg-gray-100 text-black rounded-lg">
          Создать карточку
        </button>

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
        <button className="font-semibold border border-gray-500 px-4 py-2 bg-white hover:bg-gray-100 text-black rounded-lg">
          Сохранить
        </button>

        {/* Send Button */}
        <button
          onClick={handleSend}
          className="font-semibold px-4 py-2 rounded-lg"
        >
          Выслать
        </button>
      </div>
      {isModalOpen && <CreateSuccessAct setIsModalOpen={setIsModalOpen} />}
    </>
  );
}
