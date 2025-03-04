"use client";
import React, { useState, useEffect } from "react";
import { axiosInstance } from "@/helper/utils";
import Link from "next/link";
import Cookies from "js-cookie";

interface Calculation {
  id: number;
  name: string;
  additional_info: string;
  created_at: string; // ISO-строка
}

const SavedPage: React.FC = () => {
  const role = Cookies.get("role");
  const [calculations, setCalculations] = useState<Calculation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  // State for modal confirmation: if not null, then modal is open and holds the calculation to delete.
  const [calculationToDelete, setCalculationToDelete] =
    useState<Calculation | null>(null);

  // Функция для форматирования даты и времени
  const formatDateTime = (iso: string) => {
    const date = new Date(iso);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return { date: `${day}.${month}.${year}`, time: `${hours}:${minutes}` };
  };

  const fetchCalculations = async () => {
    try {
      const response = await axiosInstance.get("/calculator/cost-calculation/");
      setCalculations(response.data.results);
    } catch (error) {
      console.error("Error fetching calculations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalculations();
  }, []);

  // Delete API handler for a given calculation
  const handleDeleteCalculation = async (id: number) => {
    try {
      await axiosInstance.delete(`/calculator/cost-calculation/${id}/`);
      // Refresh calculations list after deletion
      fetchCalculations();
    } catch (error) {
      console.error("Error deleting calculation:", error);
      alert("Ошибка при удалении расчёта");
    } finally {
      setCalculationToDelete(null);
    }
  };

  if (loading) {
    return <div>Загрузка сохранённых расчётов...</div>;
  }

  return (
    <div className="min-h-screen mt-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {calculations.map((calc) => {
          const { date, time } = formatDateTime(calc.created_at);
          return (
            <div
              key={calc.id}
              className="bg-white rounded-lg shadow p-6 flex flex-col relative"
            >
              <button
                onClick={() => setCalculationToDelete(calc)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 bg-transparent hover:bg-transparent"
              >
                ✖
              </button>
              <h2 className="text-lg font-semibold mb-2">{calc.name}</h2>
              <p className="text-gray-700 mb-4">{calc.additional_info}</p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm">
                <div className="flex items-center space-x-2 mr-2">
                  <span className="bg-gray-100 px-2 py-1 rounded text-gray-600">
                    {date}
                  </span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-600">{time}</span>
                </div>
                <Link href={`/${role}/cost-calculation/calculator/${calc.id}`}>
                  <button className="mt-2 sm:mt-0 py-1 px-4 border rounded">
                    Открыть расчет
                  </button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation Modal */}
      {calculationToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">
              Подтверждение удаления
            </h3>
            <p className="mb-4">
              Ты уверен, что хочешь удалить расчет "{calculationToDelete.name}"?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setCalculationToDelete(null)}
                className="py-2 px-4 border rounded"
              >
                Нет
              </button>
              <button
                onClick={() => handleDeleteCalculation(calculationToDelete.id)}
                className="py-2 px-4 border rounded"
              >
                Да
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedPage;
