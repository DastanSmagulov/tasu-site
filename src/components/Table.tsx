// components/DataTable.tsx
import React from "react";

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

interface TableProps {
  data: TableRow[];
}

const Table: React.FC<TableProps> = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full rounded-lg shadow-md table-no-side-borders">
        <thead>
          <tr className="bg-white text-gray-700 font-semibold text-sm">
            <th className="p-3">
              <input type="checkbox" className="checkbox checkbox-sm" />
            </th>
            <th className="p-3 text-left">Номер</th>
            <th className="p-3 text-left">Заказчик</th>
            <th className="p-3 text-left">Дата</th>
            <th className="p-3 text-left">Мест</th>
            <th className="p-3 text-left">Вес</th>
            <th className="p-3 text-left">Куб</th>
            <th className="p-3 text-left">Статус</th>
            <th className="p-3 text-left">Вид</th>
            <th className="p-3 text-left">Сумма</th>
            <th className="p-3"></th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {data?.map((row, index) => (
            <tr key={index} className="text-sm text-gray-800">
              <td className="p-3 pl-10 border border-gray-300">
                <input type="checkbox" className="checkbox checkbox-sm" />
              </td>
              <td className="p-3 border border-gray-300">{row.id}</td>
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
                <button className="text-gray-400 hover:text-gray-600">
                  •••
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
