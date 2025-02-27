import React, { useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import TrashIcon from "../../public/icons/trash.svg";
import Checkbox from "@/components/ui/CheckBox";
import { axiosInstance, formatDate, getStatusBadge } from "@/helper/utils";
import Cookies from "js-cookie";
import { Act } from "@/helper/types";

const ManagerTable = ({ data, loading, fetchActsData }: any) => {
  const [selectedRows, setSelectedRows] = useState(new Set());
  const role = Cookies.get("role");

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
      selectedRows.size === data.length
        ? new Set()
        : new Set(data.map((row: any) => row.id))
    );
  };

  if (loading) return <p>Загрузка...</p>;

  // Helper to compute total cargo weight
  const calculateTotalWeight = (cargo: any) => {
    if (!cargo || !Array.isArray(cargo)) return 0;
    return cargo.reduce((sum, item) => sum + (item.weight || 0), 0);
  };

  // Helper to compute total cargo volume.
  // Here we assume that each cargo item has a "dimensions" array and we use the first element's "amount".
  const calculateTotalVolume = (cargo: any) => {
    if (!cargo || !Array.isArray(cargo)) return 0;
    return cargo.reduce((sum, item) => {
      if (item.dimensions && item.dimensions.length > 0) {
        return sum + (item.dimensions[0].amount || 0);
      }
      return sum;
    }, 0);
  };

  return (
    <div className="mt-8">
      <div className="overflow-x-auto">
        <table className="table-auto w-full rounded-lg shadow-md">
          <thead>
            <tr className="bg-white text-gray-700 font-semibold text-sm">
              <th className="p-3 pl-10">
                <Checkbox
                  id="select-all"
                  checked={selectedRows.size === data.length}
                  onChange={toggleSelectAll}
                />
              </th>
              {[
                { label: "Номер", key: "id" },
                { label: "Заказчик", key: "customer" },
                { label: "Дата", key: "date" },
                { label: "Слоты", key: "places" },
                { label: "ЭСФ", key: "esf" },
                { label: "АВР", key: "abp" },
                { label: "Статус", key: "status" },
                { label: "Сумма", key: "amount" },
              ].map((col) => (
                <th key={col.key} className="p-3 text-left">
                  {col.label}
                </th>
              ))}
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {data
              ?.slice()
              .sort((a: any, b: any) => {
                const dateA = new Date(a.created_at).getTime();
                const dateB = new Date(b.created_at).getTime();
                console.log(dateA, dateB);
                return dateB - dateA;
              })
              .map((act: any) => {
                // Map act fields to table columns:
                const actNumber = act.number || "-";
                const actId = act.id || "-";
                const customer = act.customer?.full_name || "-";
                // Use receiving_cargo_info.date (or delivery_cargo_info.date) and format it:
                const date = act.created_at ? act.created_at : "-";
                const places = act.cargo ? act.cargo.slots : 0;
                const has_esf = act.has_esf;
                const has_avr = act.has_avr;
                // For status, you might have a dedicated field; here we fallback to transportation_type
                const status = act.status || "-";
                // For view, we use transportation_type
                const view = act.transportation_type || "-";
                // For amount, we use characteristic.cargo_cost
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
                        <Link href={`${role}/act/${actId}`}>{actNumber}</Link>
                      ) : (
                        <h2>{actNumber}</h2>
                      )}
                    </td>
                    <td className="p-3 border border-gray-300">{customer}</td>
                    <td className="p-3 border border-gray-300">
                      {formatDate(date)}
                    </td>
                    <td className="p-3 border border-gray-300">{places}</td>
                    <td className="p-3 border border-gray-300">
                      <Checkbox checked={!!has_esf} />
                    </td>
                    <td className="p-3 border border-gray-300">
                      <Checkbox checked={!!has_avr} />
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
            <Image src={TrashIcon} width={10} height={10} alt="trash" /> Удалить
          </button>
        </div>
      )}
    </div>
  );
};

export default ManagerTable;
