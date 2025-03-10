import React, { useState, useEffect } from "react";
import Checkbox from "./ui/CheckBox";
import { Act } from "@/helper/types";
import { axiosInstance } from "@/helper/utils";

interface TransportationQuantityService {
  id: number;
  name: string;
  quantity: string;
  price: string;
}

interface PackagingService {
  id: number;
  type: string;
  info1: string; // low_tariff
  info2: string; // middle_tariff
  info3: string; // price
}

interface WarehouseService {
  id: number;
  type: string;
  info1: string; // additional info (for example, service type)
  info2: string; // price
}

interface ServicesTablesProps {
  onChange: (newSelectedIds: number[]) => void; // update parent's data
  data: Act; // Act should have a field: transportation_services: number[]
}

// Helper function to compute total price for given services and price field.
const computeTotal = (services: any[], priceField: string) => {
  return services?.reduce((total, service) => {
    const price = parseFloat(service[priceField]);
    return total + (isNaN(price) ? 0 : price);
  }, 0);
};

const TransportationServicesTables: React.FC<ServicesTablesProps> = ({
  onChange,
  data,
}) => {
  // Use a local state for selected IDs (initialized from parent's data)
  const [selectedIds, setSelectedIds] = useState<number[]>(
    data?.transportation_services || []
  );

  // When parent's data changes, update our local state.
  useEffect(() => {
    setSelectedIds(data?.transportation_services || []);
  }, [data?.transportation_services]);

  /*** TRANSPORTATION SERVICES ***/
  const [transportationQuantityServices, setTransportationQuantityServices] =
    useState<TransportationQuantityService[]>([]);
  const [selectedTransportationRows, setSelectedTransportationRows] = useState<
    Set<number>
  >(new Set());
  const [showAddTransportation, setShowAddTransportation] = useState(false);
  const [newTransportationServiceId, setNewTransportationServiceId] = useState<
    number | ""
  >("");

  const selectedTransportationServices =
    transportationQuantityServices?.filter((service) =>
      selectedIds.includes(service.id)
    ) || [];
  const availableTransportationOptions =
    transportationQuantityServices?.filter(
      (service) => !selectedIds.includes(service.id)
    ) || [];

  useEffect(() => {
    if (
      showAddTransportation &&
      availableTransportationOptions?.length > 0 &&
      newTransportationServiceId === ""
    ) {
      setNewTransportationServiceId(availableTransportationOptions[0].id);
    }
  }, [
    showAddTransportation,
    availableTransportationOptions,
    newTransportationServiceId,
  ]);

  /*** PACKAGING SERVICES ***/
  const [packagingServices, setPackagingServices] = useState<
    PackagingService[]
  >([]);
  const [loadingPackaging, setLoadingPackaging] = useState(true);
  const [selectedPackagingRows, setSelectedPackagingRows] = useState<
    Set<number>
  >(new Set());
  const [showAddPackaging, setShowAddPackaging] = useState(false);
  const [newPackagingServiceId, setNewPackagingServiceId] = useState<
    number | ""
  >("");

  const selectedPackagingServices =
    packagingServices?.filter((service) => selectedIds.includes(service.id)) ||
    [];
  const availablePackagingOptions =
    packagingServices?.filter((service) => !selectedIds.includes(service.id)) ||
    [];

  useEffect(() => {
    const fetchPackagingServices = async () => {
      try {
        const response = await axiosInstance.get(`admin/packaging-services/`);
        setPackagingServices(
          response.data.results.map((service: any) => ({
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
        setLoadingPackaging(false);
      }
    };
    fetchPackagingServices();
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

  useEffect(() => {
    if (
      showAddPackaging &&
      availablePackagingOptions?.length > 0 &&
      newPackagingServiceId === ""
    ) {
      setNewPackagingServiceId(availablePackagingOptions[0].id);
    }
  }, [showAddPackaging, availablePackagingOptions, newPackagingServiceId]);

  /*** WAREHOUSE SERVICES ***/
  const [warehouseServices, setWarehouseServices] = useState<
    WarehouseService[]
  >([]);
  const [loadingWarehouse, setLoadingWarehouse] = useState(true);
  const [selectedWarehouseRows, setSelectedWarehouseRows] = useState<
    Set<number>
  >(new Set());
  const [showAddWarehouse, setShowAddWarehouse] = useState(false);
  const [newWarehouseServiceId, setNewWarehouseServiceId] = useState<
    number | ""
  >("");

  const selectedWarehouseServices =
    warehouseServices?.filter((service) => selectedIds.includes(service.id)) ||
    [];
  const availableWarehouseOptions =
    warehouseServices?.filter((service) => !selectedIds.includes(service.id)) ||
    [];

  useEffect(() => {
    const fetchWarehouseServices = async () => {
      try {
        const response = await axiosInstance.get(`/admin/warehouse-services/`);
        setWarehouseServices(
          response.data.results.map((warehouseService: any) => ({
            id: warehouseService.id,
            type: warehouseService.name,
            info1: warehouseService.type,
            info2: warehouseService.price,
          }))
        );
      } catch (error) {
        console.error("Error fetching warehouse services:", error);
      } finally {
        setLoadingWarehouse(false);
      }
    };
    fetchWarehouseServices();
  }, []);

  useEffect(() => {
    if (
      showAddWarehouse &&
      availableWarehouseOptions?.length > 0 &&
      newWarehouseServiceId === ""
    ) {
      setNewWarehouseServiceId(availableWarehouseOptions[0].id);
    }
  }, [showAddWarehouse, availableWarehouseOptions, newWarehouseServiceId]);

  /*** Дополнительные услуги Checkbox ***/
  const [showAdditionalServices, setShowAdditionalServices] = useState(false);

  /*** GENERIC HANDLERS ***/
  const toggleSelectAll = (
    services: { id: number }[],
    setSelected: React.Dispatch<React.SetStateAction<Set<number>>>,
    isChecked: boolean
  ) => {
    if (isChecked) {
      setSelected(new Set(services.map((service) => service.id)));
    } else {
      setSelected(new Set());
    }
  };

  const toggleRowSelection = (
    id: number,
    selected: Set<number>,
    setSelected: React.Dispatch<React.SetStateAction<Set<number>>>
  ) => {
    const newSelected = new Set(selected);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelected(newSelected);
  };

  // Deletes the given set of IDs from the main selected array.
  const handleDelete = (
    selectedToDelete: Set<number>,
    resetSelected: () => void
  ) => {
    const updatedIds = selectedIds.filter((id) => !selectedToDelete.has(id));
    setSelectedIds(updatedIds);
    onChange(updatedIds);
    resetSelected();
  };

  // Adds a new service (if not already selected) to the main array.
  const handleAddService = (
    newId: number | "",
    setShow: React.Dispatch<React.SetStateAction<boolean>>,
    setNewId: React.Dispatch<React.SetStateAction<number | "">>
  ) => {
    if (newId !== "" && !selectedIds.includes(newId as number)) {
      const updated = [...selectedIds, newId as number];
      setSelectedIds(updated);
      onChange(updated);
    }
    setShow(false);
    setNewId("");
  };

  // Compute totals for each type of service
  const transportationTotal = computeTotal(
    selectedTransportationServices,
    "price"
  );
  const packagingTotal = computeTotal(selectedPackagingServices, "info3");
  const warehouseTotal = computeTotal(selectedWarehouseServices, "info2");
  // Combined total for all services
  const servicesTotal = transportationTotal + packagingTotal + warehouseTotal;

  const cargoCost =
    parseFloat(data?.characteristic?.cargo_cost?.toString() || "0") || 0;

  return (
    <div>
      {/* Transportation Services Section */}
      <section>
        <h2 className="text-xl font-bold mb-4">Транспортные услуги</h2>
        {selectedTransportationServices?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border text-gray-900 font-normal border-gray-300 mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border border-gray-300">
                    <Checkbox
                      onChange={(e) =>
                        toggleSelectAll(
                          selectedTransportationServices,
                          setSelectedTransportationRows,
                          e.target.checked
                        )
                      }
                      checked={
                        selectedTransportationRows.size ===
                          selectedTransportationServices?.length &&
                        selectedTransportationServices?.length > 0
                      }
                    />
                  </th>
                  <th className="p-2 border border-gray-300 text-left font-semibold">
                    Наименование
                  </th>
                  <th className="p-2 border border-gray-300 text-left font-semibold">
                    Количество
                  </th>
                  <th className="p-2 border border-gray-300 text-left font-semibold">
                    Цена
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedTransportationServices?.map((service) => (
                  <tr key={service.id}>
                    <td className="p-2 border border-gray-300">
                      <Checkbox
                        checked={selectedTransportationRows.has(service.id)}
                        onChange={() =>
                          toggleRowSelection(
                            service.id,
                            selectedTransportationRows,
                            setSelectedTransportationRows
                          )
                        }
                      />
                    </td>
                    <td className="p-2 border border-gray-300">
                      {service.name}
                    </td>
                    <td className="p-2 border border-gray-300">
                      {service.quantity}
                    </td>
                    <td className="p-2 border border-gray-300">
                      {service.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Нет выбранных транспортных услуг.</p>
        )}
        {selectedTransportationRows.size > 0 && (
          <button
            onClick={() =>
              handleDelete(selectedTransportationRows, () =>
                setSelectedTransportationRows(new Set())
              )
            }
            className="mt-4 py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Удалить выбранную услугу
          </button>
        )}
        <div className="mt-4">
          {showAddTransportation ? (
            <div className="flex max-[500px]:flex-col min-[500px]:items-center gap-2">
              {availableTransportationOptions?.length > 0 ? (
                <>
                  <select
                    value={newTransportationServiceId}
                    onChange={(e) =>
                      setNewTransportationServiceId(Number(e.target.value))
                    }
                    className="border rounded px-2 py-1"
                  >
                    {availableTransportationOptions?.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name} (Кол.: {service.quantity}, Цена:{" "}
                        {service.price})
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() =>
                      handleAddService(
                        newTransportationServiceId,
                        setShowAddTransportation,
                        setNewTransportationServiceId
                      )
                    }
                    className="py-2 px-4 rounded"
                  >
                    Добавить
                  </button>
                  <button
                    onClick={() => setShowAddTransportation(false)}
                    className="py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Отмена
                  </button>
                </>
              ) : (
                <p>Нет возможных услуг для добавления.</p>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowAddTransportation(true)}
              className="py-2 px-4 rounded"
            >
              Добавить новую услугу
            </button>
          )}
        </div>
      </section>

      {/* Доп услуги Checkbox */}
      <div className="mt-8">
        <label className="flex items-center gap-2">
          <Checkbox
            checked={showAdditionalServices}
            onChange={(e) => setShowAdditionalServices(e.target.checked)}
          />
          <span>Показать доп. услуги</span>
        </label>
      </div>

      {/* Additional Services Sections */}
      {showAdditionalServices && (
        <>
          {packagingServices?.length > 0 || warehouseServices?.length > 0 ? (
            <>
              {/* Packaging Services Section */}
              <section className="mt-8">
                <h2 className="text-xl font-bold mb-4">Упаковочные услуги</h2>
                {loadingPackaging ? (
                  <p>Загрузка упаковочных услуг...</p>
                ) : selectedPackagingServices?.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="table-auto w-full border-collapse border text-gray-900 font-normal border-gray-300 mb-4">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="p-2 border border-gray-300">
                            <Checkbox
                              onChange={(e) =>
                                toggleSelectAll(
                                  selectedPackagingServices,
                                  setSelectedPackagingRows,
                                  e.target.checked
                                )
                              }
                              checked={
                                selectedPackagingRows.size ===
                                  selectedPackagingServices?.length &&
                                selectedPackagingServices?.length > 0
                              }
                            />
                          </th>
                          <th className="p-2 border border-gray-300 text-left font-semibold">
                            Тип
                          </th>
                          <th className="p-2 border border-gray-300 text-left font-semibold">
                            Низкий тариф
                          </th>
                          <th className="p-2 border border-gray-300 text-left font-semibold">
                            Средний тариф
                          </th>
                          <th className="p-2 border border-gray-300 text-left font-semibold">
                            Цена
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedPackagingServices?.map((service) => (
                          <tr key={service.id}>
                            <td className="p-2 border border-gray-300">
                              <Checkbox
                                checked={selectedPackagingRows.has(service.id)}
                                onChange={() =>
                                  toggleRowSelection(
                                    service.id,
                                    selectedPackagingRows,
                                    setSelectedPackagingRows
                                  )
                                }
                              />
                            </td>
                            <td className="p-2 border border-gray-300">
                              {service.type}
                            </td>
                            <td className="p-2 border border-gray-300">
                              {service.info1}
                            </td>
                            <td className="p-2 border border-gray-300">
                              {service.info2}
                            </td>
                            <td className="p-2 border border-gray-300">
                              {service.info3}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p>Нет выбранных упаковочных услуг.</p>
                )}
                {selectedPackagingRows.size > 0 && (
                  <button
                    onClick={() =>
                      handleDelete(selectedPackagingRows, () =>
                        setSelectedPackagingRows(new Set())
                      )
                    }
                    className="mt-4 py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Удалить выбранную услугу
                  </button>
                )}
                <div className="mt-4">
                  {showAddPackaging ? (
                    <div className="flex max-[500px]:flex-col min-[500px]:items-center gap-2">
                      {availablePackagingOptions?.length > 0 ? (
                        <>
                          <select
                            value={newPackagingServiceId}
                            onChange={(e) =>
                              setNewPackagingServiceId(Number(e.target.value))
                            }
                            className="border rounded px-2 py-1"
                          >
                            {availablePackagingOptions?.map((service) => (
                              <option key={service.id} value={service.id}>
                                {service.type} (Низкий тариф: {service.info1},
                                Средний тариф: {service.info2}, Цена:{" "}
                                {service.info3})
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() =>
                              handleAddService(
                                newPackagingServiceId,
                                setShowAddPackaging,
                                setNewPackagingServiceId
                              )
                            }
                            className="py-2 px-4 rounded"
                          >
                            Добавить
                          </button>
                          <button
                            onClick={() => setShowAddPackaging(false)}
                            className="py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-600"
                          >
                            Отмена
                          </button>
                        </>
                      ) : (
                        <p>Нет возможных услуг для добавления.</p>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowAddPackaging(true)}
                      className="py-2 px-4 rounded"
                    >
                      Добавить новую услугу
                    </button>
                  )}
                </div>
              </section>

              {/* Warehouse Services Section */}
              <section className="mt-8">
                <h2 className="text-xl font-bold mb-4">Складские услуги</h2>
                {loadingWarehouse ? (
                  <p>Загрузка складских услуг...</p>
                ) : selectedWarehouseServices?.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="table-auto w-full border-collapse border text-gray-900 font-normal border-gray-300 mb-4">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="p-2 border border-gray-300">
                            <Checkbox
                              onChange={(e) =>
                                toggleSelectAll(
                                  selectedWarehouseServices,
                                  setSelectedWarehouseRows,
                                  e.target.checked
                                )
                              }
                              checked={
                                selectedWarehouseRows.size ===
                                  selectedWarehouseServices?.length &&
                                selectedWarehouseServices?.length > 0
                              }
                            />
                          </th>
                          <th className="p-2 border border-gray-300 text-left font-semibold">
                            Тип
                          </th>
                          <th className="p-2 border border-gray-300 text-left font-semibold">
                            Информация
                          </th>
                          <th className="p-2 border border-gray-300 text-left font-semibold">
                            Цена
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedWarehouseServices?.map((service) => (
                          <tr key={service.id}>
                            <td className="p-2 border border-gray-300">
                              <Checkbox
                                checked={selectedWarehouseRows.has(service.id)}
                                onChange={() =>
                                  toggleRowSelection(
                                    service.id,
                                    selectedWarehouseRows,
                                    setSelectedWarehouseRows
                                  )
                                }
                              />
                            </td>
                            <td className="p-2 border border-gray-300">
                              {service.type}
                            </td>
                            <td className="p-2 border border-gray-300">
                              {service.info1}
                            </td>
                            <td className="p-2 border border-gray-300">
                              {service.info2}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p>Нет выбранных складских услуг.</p>
                )}
                {selectedWarehouseRows.size > 0 && (
                  <button
                    onClick={() =>
                      handleDelete(selectedWarehouseRows, () =>
                        setSelectedWarehouseRows(new Set())
                      )
                    }
                    className="mt-4 py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Удалить выбранную услугу
                  </button>
                )}
                <div className="mt-4">
                  {showAddWarehouse ? (
                    <div className="flex max-[500px]:flex-col min-[500px]:items-center gap-2">
                      {availableWarehouseOptions?.length > 0 ? (
                        <>
                          <select
                            value={newWarehouseServiceId}
                            onChange={(e) =>
                              setNewWarehouseServiceId(Number(e.target.value))
                            }
                            className="border rounded px-2 py-1"
                          >
                            {availableWarehouseOptions?.map((service) => (
                              <option key={service.id} value={service.id}>
                                {service.type} (Информация: {service.info1},
                                Цена: {service.info2})
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() =>
                              handleAddService(
                                newWarehouseServiceId,
                                setShowAddWarehouse,
                                setNewWarehouseServiceId
                              )
                            }
                            className="py-2 px-4 rounded"
                          >
                            Добавить
                          </button>
                          <button
                            onClick={() => setShowAddWarehouse(false)}
                            className="py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-600"
                          >
                            Отмена
                          </button>
                        </>
                      ) : (
                        <p>Нет возможных услуг для добавления.</p>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowAddWarehouse(true)}
                      className="py-2 px-4 rounded"
                    >
                      Добавить новую услугу
                    </button>
                  )}
                </div>
              </section>
            </>
          ) : (
            <p>Не осталось других таблица</p>
          )}
        </>
      )}
      {/* Combined services total */}
      <div className="flex justify-end mt-4 font-bold flex-col items-end">
        <div className="mb-1">
          <span>Итого за услуги: </span>
          <span>{servicesTotal.toFixed(2)} тг.</span>
        </div>
        <div className="mb-1">
          <span>Стоимость груза: </span>
          <span>{cargoCost.toFixed(2)} тг.</span>
        </div>
        <div>
          <span>Общая сумма: </span>
          <span>{(servicesTotal + cargoCost).toFixed(2)} тг.</span>
        </div>
      </div>
    </div>
  );
};

export default TransportationServicesTables;
