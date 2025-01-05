"use client";

import FilterPanel from "../../../shared/FilterPanel";
import Table from "../../../shared/Table";
import Pagination from "../../../shared/Pagination";
import { useEffect, useState } from "react";
import WarehouseActList from "@/components/WarehouseActList";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
("./globals.css");

// Define the data type
type DocumentData = {
  id: string;
  date: string;
  status: string;
  customer: string;
  place: string;
  weight: string;
  volume: string;
  statusColor: string;
  view: string;
  amount: string;
};

const WarehousePage = () => {
  const data: DocumentData[] = [
    {
      id: "#001234",
      customer: "Белескызы Инжу",
      date: "04 05 2020",
      place: "1 место",
      weight: "20 кг",
      volume: "1.6 м",
      status: "отправлен на склад",
      statusColor: "bg-blue-200 text-blue-800",
      view: "-",
      amount: "-",
    },
    {
      id: "#001234",
      customer: "Санжар Сапар",
      date: "01 29 2020",
      place: "1 место",
      weight: "5 кг",
      volume: "1.6 м",
      status: "отправлен на склад",
      statusColor: "bg-blue-300 text-blue-800",
      view: "-",
      amount: "-",
    },
    {
      id: "#001234",
      customer: "Белескызы Инжу",
      date: "04 05 2020",
      place: "1 место",
      weight: "20 кг",
      volume: "1.6 м",
      status: "отправлен на склад",
      statusColor: "bg-blue-200 text-blue-800",
      view: "-",
      amount: "-",
    },
    {
      id: "#001234",
      customer: "Санжар Сапар",
      date: "01 29 2020",
      place: "1 место",
      weight: "5 кг",
      volume: "1.6 м",
      status: "отправлен на склад",
      statusColor: "bg-blue-300 text-blue-800",
      view: "-",
      amount: "-",
    },
    {
      id: "#001234",
      customer: "Белескызы Инжу",
      date: "04 05 2020",
      place: "1 место",
      weight: "20 кг",
      volume: "1.6 м",
      status: "отправлен на склад",
      statusColor: "bg-blue-200 text-blue-800",
      view: "-",
      amount: "-",
    },
    {
      id: "#001234",
      customer: "Санжар Сапар",
      date: "01 29 2020",
      place: "1 место",
      weight: "5 кг",
      volume: "1.6 м",
      status: "отправлен на склад",
      statusColor: "bg-blue-300 text-blue-800",
      view: "-",
      amount: "-",
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  const totalPages = 4;

  const onPageChange = (page: number) => {
    console.log("Change to page:", page);
    setCurrentPage(page);
  };

  return (
    <div>
      {/* <WarehouseActList /> */}
      <FilterPanel />
      <Table data={data} role="forwarder" />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h1>Показано 10 из 160 данных</h1>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default WarehousePage;
