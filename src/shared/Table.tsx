import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import TrashIcon from "../../public/icons/trash.svg";
import Checkbox from "@/components/ui/CheckBox";
import { axiosInstance, formatDate } from "@/helper/utils";
import { TableRow } from "@/helper/types";
import Cookies from "js-cookie";

interface TableProps {
  data: TableRow[];
  loading: boolean;
  fetchActsData: (arg0?: string) => void;
}

const Table: React.FC<TableProps> = ({ data, loading, fetchActsData }) => {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const role = Cookies.get("role");

  const handleDelete = async (ids: string[]) => {
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

  const toggleSelection = (id: string) => {
    setSelectedRows((prevSelected) => {
      const updatedSelected = new Set(prevSelected);
      updatedSelected.has(id)
        ? updatedSelected.delete(id)
        : updatedSelected.add(id);
      return updatedSelected;
    });
  };

  const toggleSelectAll = () => {
    setSelectedRows(
      selectedRows.size === data?.length
        ? new Set()
        : new Set(data.map((row) => row.id))
    );
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="mt-8">
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
              {[
                { label: "Номер", key: "id" },
                { label: "Заказчик", key: "customer" },
                { label: "Дата", key: "date" },
                { label: "Мест", key: "place" },
                { label: "Вес", key: "weight" },
                { label: "Куб", key: "volume" },
                { label: "Статус", key: "status" },
                { label: "Вид", key: "view" },
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
            {data?.map((row: TableRow) => (
              <tr key={row.id} className="text-sm text-gray-800">
                <td className="p-3 pl-10 border border-gray-300">
                  <Checkbox
                    id={`checkbox-${row.id}`}
                    checked={selectedRows.has(row.id)}
                    onChange={() => toggleSelection(row.id)}
                  />
                </td>
                <td className="p-3 border border-gray-300">
                  <Link href={`${role}/act/${row.id}`}>{row.id}</Link>
                </td>
                <td className="p-3 border border-gray-300">{row.customer}</td>
                <td className="p-3 border border-gray-300">
                  {formatDate(row.created_at)}
                </td>
                <td className="p-3 border border-gray-300">
                  {row.cargo.characteristics}
                </td>
                <td className="p-3 font-semibold border border-gray-300">
                  {row.cargo.weight}
                </td>
                <td className="p-3 border border-gray-300">
                  {row.cargo.volume}
                </td>
                <td className="p-3 border border-gray-300">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${row.statusColor}`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="p-3 text-center border border-gray-300">
                  {row.view || "-"}
                </td>
                <td className="p-3 text-center border border-gray-300">
                  {row.total_cost || "-"}
                </td>
              </tr>
            ))}
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

export default Table;
