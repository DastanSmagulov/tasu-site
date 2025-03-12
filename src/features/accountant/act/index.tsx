"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import CreateSuccessAct from "@/components/modals/CreateSuccessAct";
import PaymentPhoto from "@/components/PaymentPhoto";
import AccountingEsf from "@/features/accountant/AccountingEsf";
import AccountingAbp from "@/features/accountant/AccountingAvr";
import { axiosInstance } from "@/helper/utils";
import { Act } from "@/helper/types";
import ExpensesTable from "../ExpensesTable";

// --- Normalization & Deep Diff Utilities ---

function normalizeValue(val: any): any {
  if (typeof val === "number" && isNaN(val)) return "";
  if (val === null || val === undefined) return "";
  return val;
}

function isEqualNormalized(val1: any, val2: any): boolean {
  // Both are numbers and NaN:
  if (
    typeof val1 === "number" &&
    isNaN(val1) &&
    typeof val2 === "number" &&
    isNaN(val2)
  ) {
    return true;
  }
  // If both are objects or arrays:
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
      // If both values are non-null objects and not arrays, perform a nested diff.
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
    if (value instanceof File) {
      formData.append(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item instanceof File) {
          // Append each file under the same key.
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actData, setActData] = useState<Act | null>(null);
  const router = useRouter();
  const params = useParams();
  // Store the originally fetched data for diffing.
  const originalDataRef = useRef<Act | null>(null);

  useEffect(() => {
    if (!params.id) return;
    let timer: ReturnType<typeof setTimeout>;

    const fetchActData = async () => {
      try {
        const response = await axiosInstance.get(`/acts/${params.id}/`);
        setActData(response.data);
        originalDataRef.current = response.data;
      } catch (error) {
        console.error("Error fetching act data:", error);
      }
    };

    fetchActData();
    timer = setTimeout(fetchActData, 500);

    return () => clearTimeout(timer);
  }, [params.id]);

  const handlePrint = () => {
    window.print();
  };

  const handleSend = async () => {
    if (!actData || !originalDataRef.current) {
      alert("Нет данных акта для отправки");
      return;
    }
    const changedData = getChangedFields(originalDataRef.current, actData);
    if (!changedData || Object.keys(changedData).length === 0) {
      console.log("No changes detected, nothing to update.");
      return;
    }
    try {
      const formData = buildFormData(changedData);
      const response = await axiosInstance.patch(
        `/acts/${actData.id}/`,
        formData
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

  const openExpenses = () => {
    router.push("/accountant/expenses");
  };

  return (
    <div>
      {sessionStatus === "loading" ? (
        <div>Загрузка сессии...</div>
      ) : !actData ? (
        <div>Загрузка данных акта...</div>
      ) : (
        <>
          <div className="flex flex-row max-lg:flex-col gap-4 mt-4 w-full">
            <div className="flex flex-col lg:w-1/2 space-y-4">
              <PaymentPhoto data={actData} setData={setActData} />
              <AccountingEsf data={actData} setData={setActData} />
              <AccountingAbp data={actData} setData={setActData} />
              <div>
                <h2 className="text-lg font-semibold mb-4 text-[#1D1B23]">
                  Расходы
                </h2>
                <ExpensesTable />
              </div>
            </div>
            <div className="flex flex-col lg:w-1/2 space-y-4">
              {/* Uncomment Shipping if needed */}
              {/* <Shipping /> */}
            </div>
          </div>
          <div className="flex flex-wrap justify-end gap-4 mt-8 text-[#000000]">
            <button className="font-semibold border border-gray-500 px-4 py-2 bg-white hover:bg-gray-100 text-black rounded-lg">
              Создать карточку
            </button>
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
            <button className="font-semibold border border-gray-500 px-4 py-2 bg-white hover:bg-gray-100 text-black rounded-lg">
              Сохранить
            </button>
            <button
              onClick={handleSend}
              className="font-semibold px-4 py-2 rounded-lg"
            >
              Выслать
            </button>
          </div>
          {isModalOpen && (
            <CreateSuccessAct
              title="Акт успешно обновлен!"
              setIsModalOpen={setIsModalOpen}
            />
          )}
        </>
      )}
    </div>
  );
}
