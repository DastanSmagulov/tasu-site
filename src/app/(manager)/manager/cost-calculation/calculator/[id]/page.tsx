"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Cookies from "js-cookie";
import { axiosInstance } from "@/helper/utils";
import CalculationDescription from "@/components/CalculationDescription";
import DeliveryCity from "@/components/DeliveryCity";
import Insurance from "@/components/Insurance";
import CalculatorServicesTable from "@/components/CalculatorServicesTable";
import CreateSuccessAct from "@/components/modals/CreateSuccessAct";

export default function CalculatorPage() {
  const role = Cookies.get("role");
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const calculationId = params?.id;

  // Shared state for calculation data.
  const [calculationData, setCalculationData] = useState<any>(null);

  // Lifted state for service details.
  const [packagingServices, setPackagingServices] = useState<any[]>([]);
  const [warehouseServices, setWarehouseServices] = useState<any[]>([]);
  const [additionalServices, setAdditionalServices] = useState<any[]>([]);

  // Fetch calculation data.
  useEffect(() => {
    if (calculationId) {
      const fetchCalculationById = async () => {
        try {
          const response = await axiosInstance.get(
            `/calculator/cost-calculation/${calculationId}/`
          );
          setCalculationData({
            ...response.data,
            transportation_services: response.data.transportation_services
              ? response.data.transportation_services.map((s: any) => s.id)
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
        // These arrays store the IDs that will be sent.
        packaging_services: [],
        additional_services: [],
        warehouse_services: [],
        warehouse_service_cost_cargo: "",
        transportation_services: [],
      });
    }
  }, [calculationId]);

  // Fetch packaging services from API.
  useEffect(() => {
    const fetchPackagingServices = async () => {
      try {
        const response = await axiosInstance.get("admin/packaging-services/");
        // Map API data to our PackagingService shape.
        setPackagingServices(
          response.data.results.map((service: any) => ({
            id: service.id,
            name: service.name,
            // Map quantity to small (or empty if null)
            small: service.quantity || "",
            medium: service.middle_tariff,
            large: Number(service.price),
          }))
        );
      } catch (error) {
        console.error("Error fetching packaging services:", error);
      }
    };
    fetchPackagingServices();
  }, []);

  // Fetch warehouse services from API.
  useEffect(() => {
    const fetchWarehouseServices = async () => {
      try {
        const response = await axiosInstance.get("/admin/warehouse-services/");
        setWarehouseServices(
          response.data.results.map((ws: any) => ({
            id: ws.id,
            name: ws.name,
            type: ws.type,
            price: ws.price,
          }))
        );
      } catch (error) {
        console.error("Error fetching warehouse services:", error);
      }
    };
    fetchWarehouseServices();
  }, []);

  // Fetch additional services from API.
  useEffect(() => {
    const fetchAdditionalServices = async () => {
      try {
        const response = await axiosInstance.get("/admin/additional-services/");
        setAdditionalServices(response.data.results);
      } catch (error) {
        console.error("Error fetching additional services:", error);
      }
    };
    fetchAdditionalServices();
  }, []);

  if (status === "loading" || !calculationData) {
    return <div>Загрузка...</div>;
  }

  // Calculate overall total cost.
  const calculateTotalCost = () => {
    // Transportation total: sum all fields
    const trans = calculationData.service_transportation;
    const transportationTotal =
      (Number(trans.cost_transportation) || 0) +
      (Number(trans.delivery_in_other_city) || 0) +
      (Number(trans.pickup_cargo) || 0) +
      (Number(trans.colloquial_cargo) || 0) +
      Number(calculationData.insurance_cost_cargo);

    // For packaging services, look up the price from the fetched packagingServices array.
    const packagesTotal = calculationData.packaging_services.reduce(
      (sum: number, id: number) => {
        const service = packagingServices.find((s) => s.id === id);
        return sum + (service ? service.large : 0);
      },
      0
    );

    // Warehouse services total.
    const warehouseTotal = calculationData.warehouse_services.reduce(
      (sum: number, id: number) => {
        const service = warehouseServices.find((s) => s.id === id);
        return sum + (service ? Number(service.price) : 0);
      },
      0
    );

    // Additional services total.
    const additionalTotal = calculationData.additional_services.reduce(
      (sum: number, id: number) => {
        const service = additionalServices.find((s) => s.id === id);
        return sum + (service ? Number(service.price) : 0);
      },
      0
    );

    // Warehouse service cost (as a number).
    const warehouseServiceCost =
      Number(calculationData.warehouse_service_cost_cargo) || 0;

    return (
      transportationTotal +
      packagesTotal +
      warehouseTotal +
      additionalTotal +
      warehouseServiceCost
    );
  };

  // Build payload merging the service arrays into a single "services" field.
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
      const response = await axiosInstance.patch(
        `/calculator/cost-calculation/${calculationId}/`,
        payload
      );
      console.log("Расчет успешно обновлен:", response.data);
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error("Ошибка при отправке расчета:", error);
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
      {/* Display overall total cost */}
      <div className="mt-4 text-right font-bold">
        <span>Общая стоимость услуг: </span>
        <span>{calculateTotalCost().toFixed(2)} тг.</span>
      </div>
      <div className="flex flex-wrap justify-end gap-4 mt-8">
        <button
          onClick={handleSubmitCalculation}
          className="font-semibold px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
          disabled={loading}
        >
          {loading ? "Отправка..." : "Сохранить"}
        </button>
        <button
          onClick={() => {
            const encodedData = encodeURIComponent(
              JSON.stringify(calculationData)
            );
            router.push(`/${role}/create-act?data=${encodedData}`);
          }}
          className="font-semibold px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white"
        >
          Сформировать акт
        </button>
      </div>
      {isSuccessModalOpen && (
        <CreateSuccessAct
          title="Расчет успешно обновлен"
          description="f"
          setIsModalOpen={setIsSuccessModalOpen}
        />
      )}
    </div>
  );
}
