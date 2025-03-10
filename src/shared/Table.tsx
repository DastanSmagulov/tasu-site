import React, { useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import TrashIcon from "../../public/icons/trash.svg";
import Checkbox from "@/components/ui/CheckBox";
import { axiosInstance, formatDate, getStatusBadge } from "@/helper/utils";
import Cookies from "js-cookie";

const Table = ({ data, loading, fetchActsData }: any) => {
  const [selectedRows, setSelectedRows] = useState(new Set());
  const role = Cookies.get("role");

  // Sorting state: field and direction ('asc' or 'desc')
  const [sortConfig, setSortConfig] = useState<{
    field: string;
    direction: "asc" | "desc";
  } | null>(null);

  const handleDelete = async (ids: unknown[]) => {
    if (ids.length === 0) return;
    try {
      await axiosInstance.delete(`/acts/bulk-delete/`, {
        data: { ids },
      });
      setSelectedRows(new Set());
      fetchActsData();
    } catch (error) {
      console.error("Error deleting items:", error);
    }
  };

  const toggleSelection = (id: number) => {
    setSelectedRows((prevSelected) => {
      const updatedSelected = new Set(prevSelected);
      if (updatedSelected.has(id)) {
        updatedSelected.delete(id);
      } else {
        updatedSelected.add(id);
      }
      return updatedSelected;
    });
  };

  const toggleSelectAll = () => {
    setSelectedRows(
      selectedRows.size === data?.length
        ? new Set()
        : new Set(data?.map((row: any) => row.id))
    );
  };

  // Helper to compute total cargo weight
  const calculateTotalWeight = (cargo: any) => {
    if (!cargo || !Array.isArray(cargo)) return 0;
    return cargo.reduce((sum, item) => sum + (item.weight || 0), 0);
  };

  // Helper to compute total cargo volume.
  const calculateTotalVolume = (cargo: any) => {
    if (!cargo || !Array.isArray(cargo)) return 0;
    return cargo.reduce((sum, item) => {
      if (item.dimensions && item.dimensions.length > 0) {
        return sum + (item.dimensions[0].amount || 0);
      }
      return sum;
    }, 0);
  };

  // Helper to get sortable value for each row given a field key.
  const getSortableValue = (act: any, field: string) => {
    switch (field) {
      case "id":
        return act.id;
      case "customer":
        return act.customer?.full_name?.toLowerCase() || "";
      case "date":
        return act.created_at ? new Date(act.created_at).getTime() : 0;
      case "places":
        return act.cargo ? act.cargo.slots : 0;
      case "weight":
        return act.cargo?.weight || 0;
      case "status":
        return act.status?.toLowerCase() || "";
      case "amount":
        return act.total_cost || 0;
      default:
        return act[field];
    }
  };

  // Create sorted data copy if sortConfig is set.
  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data;
    const sorted = [...data].sort((a, b) => {
      const aVal = getSortableValue(a, sortConfig.field);
      const bVal = getSortableValue(b, sortConfig.field);
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [data, sortConfig]);

  // Handler to update sort configuration.
  const handleSort = (field: string) => {
    setSortConfig((prev) => {
      if (prev && prev.field === field) {
        return { field, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { field, direction: "asc" };
    });
  };

  // Header columns with keys and labels.
  const columns = [
    { label: "Номер", key: "id" },
    { label: "Заказчик", key: "customer" },
    { label: "Дата", key: "date" },
    { label: "Места", key: "places" },
    { label: "Вес", key: "weight" },
    { label: "Статус", key: "status" },
    { label: "Сумма", key: "amount" },
  ];

  // Render both arrows; active arrow darker, inactive lighter.
  const renderSortArrow = (field: string) => {
    const isSorted = sortConfig && sortConfig.field === field;
    return (
      <span className="ml-1 inline-flex flex-row">
        <span
          className={`text-[10px] font-thin ${
            isSorted && sortConfig!.direction === "asc"
              ? "text-gray-900"
              : "text-gray-400"
          }`}
        >
          ▲
        </span>
        <span
          className={`text-[10px] font-thin ${
            isSorted && sortConfig!.direction === "desc"
              ? "text-gray-900"
              : "text-gray-400"
          }`}
        >
          ▼
        </span>
      </span>
    );
  };

  return (
    <div className="mt-8">
      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="table-auto w-full rounded-lg shadow-md">
              <thead>
                <tr className="bg-white text-gray-700 font-semibold text-sm">
                  <th className="p-3 pl-10">
                    <Checkbox
                      id="select-all"
                      checked={selectedRows.size === data?.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className="p-3 text-left cursor-pointer select-none"
                      onClick={() => handleSort(col.key)}
                    >
                      {col.label}
                      {renderSortArrow(col.key)}
                    </th>
                  ))}
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {sortedData?.map((act: any) => {
                  const actNumber = act.number || "-";
                  const actId = act.id || "-";
                  const customer = act.customer?.full_name || "-";
                  const date = act.created_at ? act.created_at : "-";
                  const places = act.cargo ? act.cargo.slots : 0;
                  const weight = act.cargo?.weight;
                  const status = act.status || "-";
                  const amount = act.total_cost || "-";
                  return (
                    <tr key={actId} className="text-sm text-gray-800">
                      <td className="p-3 pl-10 border border-gray-300">
                        <Checkbox
                          id={`checkbox-${actId}`}
                          checked={selectedRows.has(actId)}
                          onChange={() => toggleSelection(Number(actId))}
                        />
                      </td>
                      <td className="p-3 border border-gray-300">
                        {role !== "admin" ? (
                          <Link href={`/${role}/act/${actId}`}>
                            {actNumber}
                          </Link>
                        ) : (
                          <h2>{actNumber}</h2>
                        )}
                      </td>
                      <td className="p-3 border border-gray-300">{customer}</td>
                      <td className="p-3 border border-gray-300">
                        {formatDate(date)}
                      </td>
                      <td className="p-3 border border-gray-300">{places}</td>
                      <td className="p-3 font-semibold border border-gray-300">
                        {weight}
                      </td>
                      <td className="p-3 border border-gray-300">
                        {getStatusBadge(status)}
                      </td>
                      <td className="p-3 text-center border border-gray-300">
                        {amount}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {selectedRows.size > 0 && (
            <div className="flex gap-4 mt-4">
              <button
                className="btn text-white font-bold btn-sm bg-[#EE4040] hover:bg-[#f54d4d] border-none"
                onClick={() => handleDelete(Array.from(selectedRows))}
              >
                <Image src={TrashIcon} width={10} height={10} alt="trash" />{" "}
                Удалить
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Table;
