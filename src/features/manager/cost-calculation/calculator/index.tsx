"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { axiosInstance } from "@/helper/utils";
import CalculationDescription from "@/components/CalculationDescription";
import DeliveryCity from "@/components/DeliveryCity";
import Insurance from "@/components/Insurance";
import CalculatorServicesTable from "@/components/CalculatorServicesTable";
import CreateSuccessAct from "@/components/modals/CreateSuccessAct";

export default function CalculatorPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const calculationId = params?.id;

  const [calculationData, setCalculationData] = useState<any>(null);

  useEffect(() => {
    if (calculationId) {
      const fetchCalculationById = async () => {
        try {
          const response = await axiosInstance.get(
            `/calculator/cost-calculation/${calculationId}/`
          );
          setCalculationData({
            ...response.data,
            transportation_services: response?.data?.transportation_services
              ? response?.data?.transportation_services.map((s: any) => s.id)
              : [],
            packaging_services: response.data.service_package
              ? response.data.service_package.map((s: any) => s.id)
              : [],
            warehouse_services: response.data.service_warehouse
              ? response.data.service_warehouse.map((s: any) => s.id)
              : [],
            additional_services: response.data.service_additional
              ? response.data.service_additional.map((s: any) => s.id)
              : [],
          });
        } catch (error) {
          console.error("Error fetching calculation by id:", error);
        }
      };
      fetchCalculationById();
    } else {
      setCalculationData({
        name: "",
        additional_info: "",
        sender_city: "Алматы",
        receiver_city: "Алматы",
        insurance_cost_cargo: "",
        service_transportation: {
          cost_transportation: 0,
          delivery_in_other_city: 0,
          pickup_cargo: 0,
          colloquial_cargo: 0,
        },
        packaging_services: [],
        additional_services: [],
        warehouse_service_cost_cargo: "",
        transportation_services: [],
        warehouse_services: [],
      });
    }
  }, [calculationId]);

  if (status === "loading" || !calculationData) {
    return <div>Загрузка...</div>;
  }

  // Build payload in the required shape.
  const buildPayload = () => {
    return {
      name: calculationData.name,
      additional_info: calculationData.additional_info,
      sender_city: calculationData.sender_city,
      receiver_city: calculationData.receiver_city,
      insurance_cost_cargo: calculationData.insurance_cost_cargo,
      service_transportation: calculationData.service_transportation,
      services: [
        ...calculationData.packaging_services,
        ...calculationData.warehouse_services,
        ...calculationData.additional_services,
      ],
      warehouse_service_cost_cargo:
        calculationData.warehouse_service_cost_cargo,
    };
  };

  const handleSubmitCalculation = async () => {
    const payload = buildPayload();
    try {
      setLoading(true);
      console.log(payload);
      const response = await axiosInstance.post(
        "/calculator/cost-calculation/",
        payload
      );
      setIsSuccessModalOpen(true);
    } catch (error) {
      alert("Ошибка при отправке расчета");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <CalculationDescription
        calculationData={calculationData}
        setCalculationData={setCalculationData}
      />
      <DeliveryCity
        senderCity={calculationData.sender_city}
        receiverCity={calculationData.receiver_city}
        onChange={(sender, receiver) =>
          setCalculationData((prev: any) => ({
            ...prev,
            sender_city: sender,
            receiver_city: receiver,
          }))
        }
      />
      <Insurance
        cargoValue={calculationData.insurance_cost_cargo}
        onChange={(value) =>
          setCalculationData((prev: any) => ({
            ...prev,
            insurance_cost_cargo: value,
          }))
        }
      />
      {/* Transportation form for service_transportation */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Услуги перевозки</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-gray-700">
              Стоимость перевозки
            </label>
            <input
              type="number"
              value={calculationData.service_transportation.cost_transportation}
              onChange={(e) =>
                setCalculationData((prev: any) => ({
                  ...prev,
                  service_transportation: {
                    ...prev.service_transportation,
                    cost_transportation: Number(e.target.value),
                  },
                }))
              }
              placeholder="указать цену"
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-gray-700">
              Доставка в другом городе
            </label>
            <input
              type="number"
              value={
                calculationData.service_transportation.delivery_in_other_city
              }
              onChange={(e) =>
                setCalculationData((prev: any) => ({
                  ...prev,
                  service_transportation: {
                    ...prev.service_transportation,
                    delivery_in_other_city: Number(e.target.value),
                  },
                }))
              }
              placeholder="указать цену"
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-gray-700">
              Забор груза с города нахождения
            </label>
            <input
              type="number"
              value={calculationData.service_transportation.pickup_cargo}
              onChange={(e) =>
                setCalculationData((prev: any) => ({
                  ...prev,
                  service_transportation: {
                    ...prev.service_transportation,
                    pickup_cargo: Number(e.target.value),
                  },
                }))
              }
              placeholder="указать цену"
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-gray-700">
              Разгрузочно-погрузочные работы
            </label>
            <input
              type="number"
              value={calculationData.service_transportation.colloquial_cargo}
              onChange={(e) =>
                setCalculationData((prev: any) => ({
                  ...prev,
                  service_transportation: {
                    ...prev.service_transportation,
                    colloquial_cargo: Number(e.target.value),
                  },
                }))
              }
              placeholder="указать цену"
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none"
            />
          </div>
        </div>
      </section>
      {/* Unified services table for Packaging, Warehouse, and Additional services */}
      <CalculatorServicesTable
        initialPackagingIds={calculationData.packaging_services}
        initialWarehouseIds={calculationData.warehouse_services}
        initialAdditionalIds={calculationData.additional_services}
        costValue={calculationData.warehouse_service_cost_cargo}
        onChange={(category, newIds) =>
          setCalculationData((prev: any) => ({
            ...prev,
            [category]: newIds,
          }))
        }
        onChangeCost={(value) =>
          setCalculationData((prev: any) => ({
            ...prev,
            warehouse_service_cost_cargo: value,
          }))
        }
      />
      <div className="flex flex-wrap justify-end gap-4 mt-8">
        <button
          onClick={handleSubmitCalculation}
          className="font-semibold px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
          disabled={loading}
        >
          {loading ? "Отправка..." : "Сформировать расчет"}
        </button>
      </div>
      {isSuccessModalOpen && (
        <CreateSuccessAct
          title="Расчет успешно создан"
          setIsModalOpen={setIsSuccessModalOpen}
          description={
            "Расчет успешно передан. Ожидайте подтверждения или дополнительную информацию в ближайшее время."
          }
        />
      )}
    </div>
  );
}
