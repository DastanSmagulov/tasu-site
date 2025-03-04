"use client";
import React, { useState, useEffect } from "react";
import Checkbox from "./ui/CheckBox";
import { axiosInstance } from "@/helper/utils";

// --- Type definitions for each category ---
interface PackagingService {
  id: number;
  name: string;
  small: string; // mapped from API quantity
  medium: string; // mapped from API middle_tariff
  large: number; // mapped from API price
}

interface WarehouseService {
  id: number;
  name: string;
  type: string;
  price: string;
}

interface AdditionalService {
  id: number;
  name: string;
  price: string;
}

// --- Helper function to compute total price ---
const computeTotal = (services: { [key: string]: any }[], priceField: string) =>
  services.reduce((total, service) => {
    const price = parseFloat(service[priceField]);
    return total + (isNaN(price) ? 0 : price);
  }, 0);

// --- Utility functions for row-level selection ---
const toggleSelectAll = (
  items: { id: number }[],
  setSelectedRows: React.Dispatch<React.SetStateAction<Set<number>>>,
  checked: boolean
) => {
  setSelectedRows(checked ? new Set(items.map((item) => item.id)) : new Set());
};

const toggleRowSelection = (
  id: number,
  selectedRows: Set<number>,
  setSelectedRows: React.Dispatch<React.SetStateAction<Set<number>>>
) => {
  const newSet = new Set(selectedRows);
  newSet.has(id) ? newSet.delete(id) : newSet.add(id);
  setSelectedRows(newSet);
};

const handleDelete = (
  selectedRows: Set<number>,
  selectedIds: number[],
  setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>,
  setSelectedRows: React.Dispatch<React.SetStateAction<Set<number>>>,
  category: string,
  onChange?: (category: string, newIds: number[]) => void
) => {
  const updated = selectedIds.filter((id) => !selectedRows.has(id));
  setSelectedIds(updated);
  if (onChange) onChange(category, updated);
  setSelectedRows(new Set());
};

// --- Props for the unified services table ---
interface CalculatorServicesTableProps {
  initialPackagingIds?: number[];
  initialWarehouseIds?: number[];
  initialAdditionalIds?: number[];
  onChange?: (category: string, newIds: number[]) => void;
  onChangeCost: (value: string) => void;
  costValue: string;
}

const CalculatorServicesTable: React.FC<CalculatorServicesTableProps> = ({
  initialPackagingIds = [],
  initialWarehouseIds = [],
  initialAdditionalIds = [],
  onChange,
  onChangeCost,
  costValue,
}) => {
  // Packaging services: fetched from API.
  const [packagingServices, setPackagingServices] = useState<
    PackagingService[]
  >([]);
  const [selectedPackagingIds, setSelectedPackagingIds] =
    useState<number[]>(initialPackagingIds);
  const [selectedPackagingRows, setSelectedPackagingRows] = useState<
    Set<number>
  >(new Set());
  const [showAddPackaging, setShowAddPackaging] = useState(false);
  const [newPackagingId, setNewPackagingId] = useState<number | "">("");

  useEffect(() => {
    const fetchPackagingServices = async () => {
      try {
        const response = await axiosInstance.get("admin/packaging-services/");
        setPackagingServices(
          response.data.results.map((service: any) => ({
            id: service.id,
            name: service.name,
            small: service.quantity || "", // if quantity is null, fallback to empty string
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

  useEffect(() => {
    setSelectedPackagingIds(initialPackagingIds);
  }, [initialPackagingIds]);

  // Auto-select first available packaging option when adding.
  useEffect(() => {
    const available = packagingServices.filter(
      (s) => !selectedPackagingIds.includes(s.id)
    );
    if (showAddPackaging && available.length > 0 && newPackagingId === "") {
      setNewPackagingId(available[0].id);
    }
  }, [
    showAddPackaging,
    packagingServices,
    selectedPackagingIds,
    newPackagingId,
  ]);

  // Warehouse services: fetched from API.
  const [warehouseServices, setWarehouseServices] = useState<
    WarehouseService[]
  >([]);
  const [selectedWarehouseIds, setSelectedWarehouseIds] =
    useState<number[]>(initialWarehouseIds);
  const [selectedWarehouseRows, setSelectedWarehouseRows] = useState<
    Set<number>
  >(new Set());
  const [showAddWarehouse, setShowAddWarehouse] = useState(false);
  const [newWarehouseId, setNewWarehouseId] = useState<number | "">("");

  useEffect(() => {
    const fetchWarehouse = async () => {
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
    fetchWarehouse();
  }, []);

  useEffect(() => {
    setSelectedWarehouseIds(initialWarehouseIds);
  }, [initialWarehouseIds]);

  useEffect(() => {
    const available = warehouseServices.filter(
      (s) => !selectedWarehouseIds.includes(s.id)
    );
    if (showAddWarehouse && available.length > 0 && newWarehouseId === "") {
      setNewWarehouseId(available[0].id);
    }
  }, [
    showAddWarehouse,
    warehouseServices,
    selectedWarehouseIds,
    newWarehouseId,
  ]);

  // Additional services: fetched from API.
  const [additionalServices, setAdditionalServices] = useState<
    AdditionalService[]
  >([]);
  const [selectedAdditionalIds, setSelectedAdditionalIds] =
    useState<number[]>(initialAdditionalIds);
  const [selectedAdditionalRows, setSelectedAdditionalRows] = useState<
    Set<number>
  >(new Set());
  const [showAddAdditional, setShowAddAdditional] = useState(false);
  const [newAdditionalId, setNewAdditionalId] = useState<number | "">("");

  useEffect(() => {
    const fetchAdditional = async () => {
      try {
        const response = await axiosInstance.get("/admin/additional-services/");
        setAdditionalServices(response.data.results);
      } catch (error) {
        console.error("Error fetching additional services:", error);
      }
    };
    fetchAdditional();
  }, []);

  // Auto-select first available additional service when adding.
  useEffect(() => {
    const available = additionalServices.filter(
      (s) => !selectedAdditionalIds.includes(s.id)
    );
    if (showAddAdditional && available.length > 0 && newAdditionalId === "") {
      setNewAdditionalId(available[0].id);
    }
  }, [
    showAddAdditional,
    additionalServices,
    selectedAdditionalIds,
    newAdditionalId,
  ]);

  useEffect(() => {
    setSelectedAdditionalIds(initialAdditionalIds);
  }, [initialAdditionalIds]);

  const availableOptions = <T extends { id: number }>(
    all: T[],
    selected: number[]
  ) => all.filter((item) => !selected.includes(item.id));

  const handleAdd = (
    newId: number | "",
    selected: number[],
    setSelected: React.Dispatch<React.SetStateAction<number[]>>,
    setShow: React.Dispatch<React.SetStateAction<boolean>>,
    setNewId: React.Dispatch<React.SetStateAction<number | "">>,
    category: string
  ) => {
    if (newId !== "" && !selected.includes(newId as number)) {
      const updated = [...selected, newId as number];
      setSelected(updated);
      if (onChange) onChange(category, updated);
    }
    setShow(false);
    setNewId("");
  };

  const handleDeleteAll = (
    setSelected: React.Dispatch<React.SetStateAction<number[]>>,
    category: string
  ) => {
    setSelected([]);
    if (onChange) onChange(category, []);
  };

  const packagingTotal = computeTotal(
    packagingServices.filter((s) => selectedPackagingIds.includes(s.id)),
    "large"
  );
  const warehouseTotal = computeTotal(
    warehouseServices.filter((s) => selectedWarehouseIds.includes(s.id)),
    "price"
  );
  const additionalTotal = computeTotal(
    additionalServices.filter((s) => selectedAdditionalIds.includes(s.id)),
    "price"
  );
  const grandTotal = packagingTotal + warehouseTotal + additionalTotal;

  // Render section function
  const renderSection = <T extends { id: number }>(
    title: string,
    allServices: T[],
    selectedIds: number[],
    availableItems: T[],
    renderRow: (item: T) => JSX.Element,
    showAdd: boolean,
    setShow: React.Dispatch<React.SetStateAction<boolean>>,
    newId: number | "",
    setNewId: React.Dispatch<React.SetStateAction<number | "">>,
    addHandler: () => void,
    selectedRows: Set<number>,
    setSelectedRows: React.Dispatch<React.SetStateAction<Set<number>>>,
    deleteHandler: () => void
  ) => (
    <section className="mb-8">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {selectedIds.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse mb-6 border text-gray-900 font-normal border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border border-gray-300 w-12">
                  <Checkbox
                    onChange={(e) =>
                      toggleSelectAll(
                        allServices.filter((s) => selectedIds.includes(s.id)),
                        setSelectedRows,
                        e.target.checked
                      )
                    }
                    checked={
                      selectedRows.size ===
                        allServices.filter((s) => selectedIds.includes(s.id))
                          .length &&
                      allServices.filter((s) => selectedIds.includes(s.id))
                        .length > 0
                    }
                  />
                </th>
                <th className="p-2 border border-gray-300 text-left font-semibold">
                  Наименование
                </th>
                <th className="p-2 border border-gray-300 text-left font-semibold">
                  Цена
                </th>
              </tr>
            </thead>
            <tbody>
              {allServices
                .filter((s) => selectedIds.includes(s.id))
                .map((s) => (
                  <tr key={s.id}>
                    <td className="p-2 border border-gray-300 text-center">
                      <Checkbox
                        checked={selectedRows.has(s.id)}
                        onChange={() =>
                          toggleRowSelection(
                            s.id,
                            selectedRows,
                            setSelectedRows
                          )
                        }
                      />
                    </td>
                    {renderRow(s)}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Нет выбранных услуг.</p>
      )}
      {selectedRows.size > 0 && (
        <button
          onClick={deleteHandler}
          className="mt-4 py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Удалить выбранную услугу
        </button>
      )}
      <div className="mt-4">
        {showAdd ? (
          <div className="flex flex-col sm:flex-row items-center gap-2">
            {availableItems.length > 0 ? (
              <>
                <select
                  value={newId}
                  onChange={(e) => setNewId(Number(e.target.value))}
                  className="border rounded px-2 py-1"
                >
                  {availableItems.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.id} - {(s as any).name} (Цена:{" "}
                      {(s as any).price || (s as any).large})
                    </option>
                  ))}
                </select>
                <button onClick={addHandler} className="py-2 px-4 rounded">
                  Добавить
                </button>
                <button
                  onClick={() => setShow(false)}
                  className="py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Отмена
                </button>
              </>
            ) : (
              <p>Нет доступных услуг для добавления.</p>
            )}
          </div>
        ) : (
          <button onClick={() => setShow(true)} className="py-2 px-4 rounded">
            Добавить новую услугу
          </button>
        )}
      </div>
    </section>
  );

  return (
    <div className="">
      {/* Section: Услуги упаковки */}
      {renderSection<PackagingService>(
        "Услуги упаковки",
        packagingServices,
        selectedPackagingIds,
        availableOptions(packagingServices, selectedPackagingIds),
        (s) => (
          <>
            <td className="p-2 border border-gray-300">{s.name}</td>
            <td className="p-2 border border-gray-300">{s.large}</td>
          </>
        ),
        showAddPackaging,
        setShowAddPackaging,
        newPackagingId,
        setNewPackagingId,
        () =>
          handleAdd(
            newPackagingId,
            selectedPackagingIds,
            setSelectedPackagingIds,
            setShowAddPackaging,
            setNewPackagingId,
            "packaging_services"
          ),
        selectedPackagingRows,
        setSelectedPackagingRows,
        () =>
          handleDelete(
            selectedPackagingRows,
            selectedPackagingIds,
            setSelectedPackagingIds,
            setSelectedPackagingRows,
            "packaging_services",
            onChange
          )
      )}

      {/* Section: Складские услуги */}
      <div className="flex flex-col gap-1 mb-8">
        <label className="font-semibold text-gray-700">Стоимость груза</label>
        <input
          type="text"
          value={costValue}
          onChange={(e) => onChangeCost(e.target.value)}
          placeholder="указать цену"
          className="border border-gray-300 rounded px-4 py-2 focus:outline-none w-full md:w-36"
        />
      </div>

      {renderSection<WarehouseService>(
        "Складские услуги",
        warehouseServices,
        selectedWarehouseIds,
        availableOptions(warehouseServices, selectedWarehouseIds),
        (s) => (
          <>
            <td className="p-2 border border-gray-300">{s.name}</td>
            <td className="p-2 border border-gray-300">{s.price}</td>
          </>
        ),
        showAddWarehouse,
        setShowAddWarehouse,
        newWarehouseId,
        setNewWarehouseId,
        () =>
          handleAdd(
            newWarehouseId,
            selectedWarehouseIds,
            setSelectedWarehouseIds,
            setShowAddWarehouse,
            setNewWarehouseId,
            "warehouse_services"
          ),
        selectedWarehouseRows,
        setSelectedWarehouseRows,
        () =>
          handleDelete(
            selectedWarehouseRows,
            selectedWarehouseIds,
            setSelectedWarehouseIds,
            setSelectedWarehouseRows,
            "warehouse_services",
            onChange
          )
      )}

      {/* Section: Доп услуги */}
      {renderSection<AdditionalService>(
        "Доп услуги",
        additionalServices,
        selectedAdditionalIds,
        availableOptions(additionalServices, selectedAdditionalIds),
        (s) => (
          <>
            <td className="p-2 border border-gray-300">{s.name}</td>
            <td className="p-2 border border-gray-300">{s.price}</td>
          </>
        ),
        showAddAdditional,
        setShowAddAdditional,
        newAdditionalId,
        setNewAdditionalId,
        () =>
          handleAdd(
            newAdditionalId,
            selectedAdditionalIds,
            setSelectedAdditionalIds,
            setShowAddAdditional,
            setNewAdditionalId,
            "additional_services"
          ),
        selectedAdditionalRows,
        setSelectedAdditionalRows,
        () =>
          handleDelete(
            selectedAdditionalRows,
            selectedAdditionalIds,
            setSelectedAdditionalIds,
            setSelectedAdditionalRows,
            "additional_services",
            onChange
          )
      )}

      {/* Totals
      <div className="flex justify-end mt-4 font-bold flex-col items-end">
        <div className="mb-1">
          <span>Общая сумма услуг: </span>
          <span>{grandTotal.toFixed(2)} тг.</span>
        </div>
      </div> */}
    </div>
  );
};

export default CalculatorServicesTable;
