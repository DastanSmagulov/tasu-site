"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import InformationPackage from "@/components/PackageInformation";
import CityTariffsTable from "@/components/CityTariff";
import Table from "@/components/Table";
import Insurance from "@/components/Insurance";
import InterCity from "@/components/InterCity";
import { axiosInstance } from "@/helper/utils";

("./globals.css");

interface WarehouseService {
  id: number;
  name: string;
  type: string;
  price: string;
}

interface PackagingService {
  id: number;
  name: string;
  low_tariff: string | null;
  middle_tariff: string | null;
  price: string;
}

interface TransportationQuantityService {
  id: number;
  name: string;
  quantity: string;
  price: string;
}

interface TransportationWeightService {
  id: number;
  name: string;
  weight: string;
  price: string;
}

interface CityTransportation {
  id: number;
  sender_city: {
    id: number;
    country: string;
    name_ru: string;
    name_kz: string;
    name_en: string;
  };
  receiver_city: {
    id: number;
    country: string;
    name_ru: string;
    name_kz: string;
    name_en: string;
  };
  price: string;
}

interface City {
  id: number;
  country: string;
  name_ru: string;
  name_kz: string;
  name_en: string;
}

export default function TariffPage() {
  const { data: session, status } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [warehouseServices, setWarehouseServices] = useState<
    WarehouseService[]
  >([]);
  const [cities, setCities] = useState<City[]>([]);
  const [dataCities, setDataCities] = useState<CityTransportation[]>([]);
  const [packagingServices, setPackagingServices] = useState<
    PackagingService[]
  >([]);
  const [transportationQuantityServices, setTransportationQuantityServices] =
    useState<TransportationQuantityService[]>([]);
  const [transportationWeightServices, setTransportationWeightServices] =
    useState<TransportationWeightService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWarehouseServices();
    fetchPackagingServices();
    fetchTransportationQuantityServices();
    fetchTransportationWeightServices();
    fetchCities();
    fetchCityList();
  }, []);

  // Transform city data for the table
  const cityTableData = dataCities.map((city) => ({
    id: city.id,
    sender_city:
      cities.find((c) => c.id === city.sender_city.id)?.name_ru || "",
    receiver_city:
      cities.find((c) => c.id === city.receiver_city.id)?.name_ru || "",
    price: city.price,
  }));

  const fetchPackagingServices = async () => {
    try {
      const response = await axiosInstance.get(`admin/packaging-services/`);
      setPackagingServices(
        response.data.results.map((service: PackagingService) => ({
          id: service.id,
          type: service.name,
          info1: service.low_tariff,
          info2: service.middle_tariff,
          info3: service.price,
        }))
      );
    } catch (error) {
      console.error("Error fetching packaging services:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWarehouseServices = async () => {
    try {
      const response = await axiosInstance.get(`/admin/warehouse-services/`);
      setWarehouseServices(
        response.data.results.map((warehouseService: WarehouseService) => ({
          id: warehouseService.id,
          type: warehouseService.name,
          info1: warehouseService.type,
          info2: warehouseService.price,
        }))
      );
    } catch (error) {
      console.error("Error fetching warehouse services:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const fetchTransportationWeightServices = async () => {
    try {
      const response = await axiosInstance.get(
        `admin/transportation-services/weight/`
      );
      setTransportationWeightServices(
        response.data.results.map((service: TransportationWeightService) => ({
          id: service.id,
          name: service.name,
          weight: service.weight,
          price: service.price,
        }))
      );
    } catch (error) {
      console.error("Error fetching transportation weight services:", error);
    }
  };

  // Fetch list of cities for dropdowns
  const fetchCityList = async () => {
    try {
      const response = await axiosInstance.get(`/admin/cities/`);
      setCities(response.data.results);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  // Add a warehouse service
  const addWarehouseService = async (newRow: any) => {
    const newWarehouseService = {
      name: newRow.type,
      type: newRow.info1,
      price: newRow.info2,
    };
    try {
      await axiosInstance.post(
        `/admin/warehouse-services/`,
        newWarehouseService
      );
      await fetchWarehouseServices(); // Refresh warehouse services
    } catch (error) {
      console.error("Error adding warehouse service:", error);
    }
  };

  const addPackagingService = async (newRow: any) => {
    const newPackagingService = {
      name: newRow.type,
      low_tariff: newRow.info1 || null,
      middle_tariff: newRow.info2 || null,
      price: newRow.info3,
    };
    try {
      await axiosInstance.post(
        `/admin/packaging-services/`,
        newPackagingService
      );
      await fetchPackagingServices(); // Refresh packaging services
    } catch (error) {
      console.error("Error adding packaging service:", error);
    }
  };

  const addTransportationQuantityService = async (newRow: any) => {
    const newService = {
      name: newRow.name,
      quantity: newRow.quantity,
      price: newRow.price,
    };
    try {
      await axiosInstance.post(
        `/admin/transportation-services/quantity/`,
        newService
      );
      await fetchTransportationQuantityServices(); // Refresh data
    } catch (error) {
      console.error("Error adding transportation quantity service:", error);
    }
  };

  const addTransportationWeightService = async (newRow: any) => {
    const newService = {
      name: newRow.name,
      weight: newRow.weight,
      price: newRow.price,
    };
    try {
      await axiosInstance.post(
        `/admin/transportation-services/weight/`,
        newService
      );
      await fetchTransportationWeightServices(); // Refresh data
    } catch (error) {
      console.error("Error adding transportation weight service:", error);
    }
  };

  // Fetch city transportations from the API
  const fetchCities = async () => {
    try {
      const response = await axiosInstance.get(`/admin/city-transportations/`);
      setDataCities(response.data.results);
    } catch (error) {
      console.error("Error fetching city transportations:", error);
    }
  };

  // Add a city transportation to the API
  const addCityTransportation = async (data: {
    sender_city: string;
    receiver_city: string;
    price: string;
  }) => {
    try {
      await axiosInstance.post(`/admin/city-transportations/`, data);
      await fetchCities(); // Refresh the city transportations data
    } catch (error) {
      console.error("Error adding city transportation:", error);
    }
  };

  // Handle adding a new city transportation
  const handleAddCityTransportation = async (newRow: any): Promise<void> => {
    const newCityTransportation = {
      sender_city: newRow.sender_city,
      receiver_city: newRow.receiver_city,
      price: newRow.price,
    };
    addCityTransportation(newCityTransportation);
  };

  // Update a city transportation in the API
  const updateCityTransportation = async (
    id: number,
    updatedData: {
      sender_city: string;
      receiver_city: string;
      price: string;
    }
  ) => {
    try {
      await axiosInstance.patch(
        `/admin/city-transportations/${id}/`,
        updatedData
      );
      await fetchCities(); // Refresh the city transportations data
    } catch (error) {
      console.error("Error updating city transportation:", error);
    }
  };

  // Bulk delete city transportations from the API
  const deleteCityTransportations = async (ids: number[]) => {
    try {
      await axiosInstance.delete(`/admin/city-transportations/bulk-delete/`, {
        data: { ids },
      });
      await fetchCities(); // Refresh the city transportations data
    } catch (error) {
      console.error("Error deleting city transportations:", error);
    }
  };

  // Handle updating a city transportation
  const handleUpdateCityTransportation = (id: number, updatedRow: any) => {
    const updatedCityTransportation = {
      sender_city: updatedRow.sender_city,
      receiver_city: updatedRow.receiver_city,
      price: updatedRow.price,
    };
    updateCityTransportation(id, updatedCityTransportation);
  };

  // Handle deleting city transportations
  const handleDeleteCityTransportations = (ids: number[]) => {
    deleteCityTransportations(ids);
  };

  // Update warehouse service
  const updateWarehouseService = async (id: number, updatedData: any) => {
    const updatedWarehouseService = {
      name: updatedData.type,
      type: updatedData.info1,
      price: updatedData.info2,
    };
    try {
      const response = await axiosInstance.patch(
        `/admin/warehouse-services/${id}/`,
        updatedWarehouseService
      );
      console.log(response);
      await fetchWarehouseServices();
    } catch (error) {
      console.error("Error updating warehouse service:", error);
    }
  };

  // Update packaging service
  const updatePackagingService = async (id: number, updatedData: any) => {
    const updatedPackagingService = {
      name: updatedData.type,
      low_tariff: updatedData.info1 || null,
      middle_tariff: updatedData.info2 || null,
      price: updatedData.info3,
    };
    try {
      const response = await axiosInstance.patch(
        `/admin/packaging-services/${id}/`,
        updatedPackagingService
      );
      console.log(response);
      await fetchPackagingServices();
    } catch (error) {
      console.error("Error updating packaging service:", error);
    }
  };

  const updateTransportationQuantityService = async (
    id: number,
    updatedData: any
  ) => {
    const updatedService = {
      name: updatedData.name,
      quantity: updatedData.quantity,
      price: updatedData.price,
    };
    try {
      await axiosInstance.patch(
        `/admin/transportation-services/quantity/${id}/`,
        updatedService
      );
      await fetchTransportationQuantityServices(); // Refresh data
    } catch (error) {
      console.error("Error updating transportation quantity service:", error);
    }
  };

  const updateTransportationWeightService = async (
    id: number,
    updatedData: any
  ) => {
    const updatedService = {
      name: updatedData.name,
      weight: updatedData.weight,
      price: updatedData.price,
    };
    try {
      await axiosInstance.patch(
        `/admin/transportation-services/weight/${id}/`,
        updatedService
      );
      await fetchTransportationWeightServices(); // Refresh data
    } catch (error) {
      console.error("Error updating transportation weight service:", error);
    }
  };

  // Delete warehouse services
  const deleteWarehouseService = async (ids: number[]) => {
    try {
      await axiosInstance.delete(`/admin/warehouse-services/bulk-delete/`, {
        data: { ids },
      });
      await fetchWarehouseServices(); // Refresh data
    } catch (error) {
      console.error("Error deleting warehouse services:", error);
    }
  };

  // Delete packaging services
  const deletePackagingService = async (ids: number[]) => {
    try {
      await axiosInstance.delete(`/admin/packaging-services/bulk-delete/`, {
        data: { ids },
      });
      await fetchPackagingServices(); // Refresh data
    } catch (error) {
      console.error("Error deleting packaging services:", error);
    }
  };

  const deleteTransportationQuantityService = async (ids: number[]) => {
    try {
      await axiosInstance.delete(
        `/admin/transportation-services/quantity/bulk-delete/`,
        {
          data: { ids },
        }
      );
      await fetchTransportationQuantityServices(); // Refresh data
    } catch (error) {
      console.error("Error deleting transportation quantity services:", error);
    }
  };

  const deleteTransportationWeightService = async (ids: number[]) => {
    try {
      await axiosInstance.delete(
        `/admin/transportation-services/weight/bulk-delete/`,
        {
          data: { ids },
        }
      );
      await fetchTransportationWeightServices(); // Refresh data
    } catch (error) {
      console.error("Error deleting transportation weight services:", error);
    }
  };

  const transportationQuantityColumns = [
    { label: "Наименование", key: "name" },
    { label: "Количество", key: "quantity" },
    { label: "Цена", key: "price" },
  ];

  const transportationWeightColumns = [
    { label: "Наименование", key: "name" },
    { label: "Вес", key: "weight" },
    { label: "Цена", key: "price" },
  ];

  const packagingColumns = [
    { label: "Наименование", key: "type" },
    { label: "Тариф Маленький", key: "info1" },
    { label: "Тариф Средний", key: "info2" },
    { label: "Цена", key: "info3" },
  ];

  const cityColumns = [
    { label: "Город отправление", key: "type" },
    { label: "Город получение", key: "info1" },
    { label: "Тариф", key: "info2" },
  ];

  const cityData = [
    { type: "Астана", info1: "Алматы", info2: "5000" },
    { type: "Астана", info1: "Оскемен", info2: "8000" },
    { type: "Астана", info1: "Шымкент", info2: "3000" },
  ];

  const handleRowSelect = (selectedRows: any[]) => {
    console.log("Selected Rows:", selectedRows);
  };

  return (
    <>
      <div className="flex mt-4 w-full">
        <div className="flex flex-col gap-10 mb-10">
          <InterCity />
          <Table
            text="Города отправления и получения"
            columns={[
              {
                label: "Город отправления",
                key: "sender_city",
                type: "dropdown",
                options: cities.map((city) => ({
                  value: city.id + "",
                  label: city.name_ru,
                })),
              },
              {
                label: "Город получения",
                key: "receiver_city",
                type: "dropdown",
                options: cities.map((city) => ({
                  value: city.id + "",
                  label: city.name_ru,
                })),
              },
              { label: "Цена", key: "price", type: "text" },
            ]}
            data={cityTableData}
            onRowSelect={handleRowSelect}
            onAddRow={handleAddCityTransportation}
            onEditRow={handleUpdateCityTransportation}
            onDeleteRows={(selectedRows) => {
              const ids = Array.from(selectedRows).map(
                (index) => cityTableData[index].id
              );
              handleDeleteCityTransportations(ids);
            }}
            width="full"
          />
          {/* <Insurance
            cargoValue={calculationData.insurance_cost_cargo}
            onChange={(value) =>
              setCalculationData((prev: any) => ({
                ...prev,
                insurance_cost_cargo: value,
              }))
            }
          />{" "} */}
          <Table
            text="Услуги по количеству"
            columns={transportationQuantityColumns}
            data={transportationQuantityServices}
            onRowSelect={handleRowSelect}
            onAddRow={addTransportationQuantityService}
            onDeleteRows={(selectedRows) => {
              const ids = Array.from(selectedRows).map(
                (index) => transportationQuantityServices[index].id
              );
              deleteTransportationQuantityService(ids);
            }}
            onEditRow={(id, updatedData) =>
              updateTransportationQuantityService(id, updatedData)
            }
            width="full"
          />
          <Table
            text="Услуги по весу"
            columns={transportationWeightColumns}
            data={transportationWeightServices}
            onRowSelect={handleRowSelect}
            onAddRow={addTransportationWeightService}
            onDeleteRows={(selectedRows) => {
              const ids = Array.from(selectedRows).map(
                (index) => transportationWeightServices[index].id
              );
              deleteTransportationWeightService(ids);
            }}
            onEditRow={(id, updatedData) =>
              updateTransportationWeightService(id, updatedData)
            }
            width="full"
          />
          <Table
            text="Складские услуги"
            columns={[
              { label: "Наименование", key: "type" },
              { label: "Тип", key: "info1" },
              { label: "Цена", key: "info2" },
            ]}
            data={warehouseServices}
            onRowSelect={handleRowSelect}
            onAddRow={addWarehouseService}
            onDeleteRows={(selectedRows) => {
              const ids = Array.from(selectedRows).map(
                (index) => warehouseServices[index].id
              );
              deleteWarehouseService(ids);
            }}
            onEditRow={(id, updatedData) =>
              updateWarehouseService(id, updatedData)
            }
            width="full"
          />
          <Table
            text="Услуги упаковки"
            columns={packagingColumns}
            data={packagingServices}
            onRowSelect={handleRowSelect}
            onAddRow={addPackagingService}
            onDeleteRows={(selectedRows) => {
              const ids = Array.from(selectedRows).map(
                (index) => packagingServices[index].id
              );
              deletePackagingService(ids);
            }}
            onEditRow={(id, updatedData) =>
              updatePackagingService(id, updatedData)
            }
            width="full"
          />
        </div>
      </div>
    </>
  );
}
