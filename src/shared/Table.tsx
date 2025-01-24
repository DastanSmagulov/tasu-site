import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import TrashIcon from "../../public/icons/trash.svg";
import Checkbox from "@/components/ui/CheckBox";

interface TableRow {
  id: string;
  customer: string;
  date: string;
  place: string;
  weight: string;
  volume: string;
  status: string;
  statusColor: string;
  view: string;
  amount: string;
}

const Table: React.FC = () => {
  const [data, setData] = useState<TableRow[]>([]);
  const token = Cookies.get("auth_token");
  const extractRoleFromToken = (token: string | undefined): string => {
    if (!token) return "guest"; // Fallback role if the token is missing
    try {
      // Decode the token payload (manually or using a library like jwt-decode)
      const base64Url = token.split(".")[1]; // Get the payload part
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const decodedPayload = JSON.parse(atob(base64)); // Decode and parse JSON
      return decodedPayload.role.key.toLowerCase() || "guest"; // Fallback if role isn't present
    } catch (error) {
      console.error("Error decoding token:", error);
      return "guest"; // Fallback role on error
    }
  };

  const [role] = useState(() => extractRoleFromToken(token));
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [sortConfig, setSortConfig] = useState<{
    key: keyof TableRow;
    direction: string;
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

      try {
        const response = await axios.get(`${API_BASE_URL}/acts/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;

        const tableData: TableRow[] = data.results.map((item: any) => ({
          id: `#${item.id}`,
          customer: String(item.customer),
          date: new Date(item.created_at).toLocaleDateString(),
          place: item.cargo.characteristics,
          weight: item.cargo.weight,
          volume: item.cargo.volume,
          status: item.status,
          statusColor:
            item.status === "Создан" ? "bg-green-100 text-green-800" : "",
          view: "-",
          amount: item.total_cost,
        }));

        setData(tableData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data;
    const sorted = [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
    return sorted;
  }, [data, sortConfig]);

  const handleSort = (key: keyof TableRow) => {
    setSortConfig((prevConfig) => {
      if (prevConfig?.key === key && prevConfig.direction === "ascending") {
        return { key, direction: "descending" };
      }
      return { key, direction: "ascending" };
    });
  };

  const toggleSelection = (id: string) => {
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
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(data.map((row) => row.id)));
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

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
                { label: "Мест", key: "place" },
                { label: "Вес", key: "weight" },
                { label: "Куб", key: "volume" },
                { label: "Статус", key: "status" },
                { label: "Вид", key: "view" },
                { label: "Сумма", key: "amount" },
              ].map((col) => (
                <th
                  key={col.key}
                  className="p-3 text-left cursor-pointer"
                  onClick={() => handleSort(col.key as keyof TableRow)}
                >
                  {col.label}
                  <span className="ml-1 text-xs">
                    {sortConfig?.key === col.key
                      ? sortConfig.direction === "ascending"
                        ? "↑"
                        : "↓"
                      : "↑↓"}
                  </span>
                </th>
              ))}
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {sortedData.map((row) => (
              <tr key={row.id} className="text-sm text-gray-800">
                <td className="p-3 pl-10 border border-gray-300">
                  <Checkbox
                    id={`checkbox-${row.id}`}
                    checked={selectedRows.has(row.id)}
                    onChange={() => toggleSelection(row.id)}
                  />
                </td>
                <td className="p-3 border border-gray-300">
                  <Link href={`${role}/act/${row.id.slice(1)}`}>{row.id}</Link>
                </td>
                <td className="p-3 border border-gray-300">{row.customer}</td>
                <td className="p-3 border border-gray-300">{row.date}</td>
                <td className="p-3 border border-gray-300">{row.place}</td>
                <td className="p-3 font-semibold border border-gray-300">
                  {row.weight}
                </td>
                <td className="p-3 border border-gray-300">{row.volume}</td>
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
                  {row.amount || "-"}
                </td>
                <td className="p-3 text-center border border-gray-300">
                  <button className="text-gray-400 bg-transparent hover:bg-transparent hover:text-gray-600">
                    •••
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex gap-4 mt-4">
        {selectedRows.size > 0 && (
          <button className="btn text-white font-bold btn-sm bg-[#EE4040] hover:bg-[#f54d4d] border-none">
            <Image src={TrashIcon} width={10} height={10} alt="trash" /> Удалить
          </button>
        )}
      </div>
    </div>
  );
};

export default Table;
