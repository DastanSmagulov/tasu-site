"use client";

import FilterPanel from "../../components/FilterPanel";
import Table from "../../components/Table";
import Pagination from "../../components/Pagination";
import { useState } from "react";
import TabsNavigation from "@/components/TabsNavigation";
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

export default function Home() {
  const [data, setData] = useState<DocumentData[]>([
    {
      id: "#001234",
      customer: "Белескызы Инжу",
      date: "04 05 2020",
      place: "1 место",
      weight: "20 кг",
      volume: "1.6 м",
      status: "акт сформирован",
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
      status: "заявка сформирована",
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
      status: "оплата подтверждена",
      statusColor: "bg-purple-200 text-purple-800",
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
      status: "оплата подтверждена",
      statusColor: "bg-purple-200 text-purple-800",
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
      status: "оплата подтверждена",
      statusColor: "bg-purple-200 text-purple-800",
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
      status: "оплата подтверждена",
      statusColor: "bg-purple-200 text-purple-800",
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
      status: "оплата подтверждена",
      statusColor: "bg-purple-200 text-purple-800",
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
      status: "оплата подтверждена",
      statusColor: "bg-purple-200 text-purple-800",
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
      status: "оплата подтверждена",
      statusColor: "bg-purple-200 text-purple-800",
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
      status: "оплата подтверждена",
      statusColor: "bg-purple-200 text-purple-800",
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
      status: "оплата подтверждена",
      statusColor: "bg-purple-200 text-purple-800",
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
      status: "оплата подтверждена",
      statusColor: "bg-purple-200 text-purple-800",
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
      status: "оплата подтверждена",
      statusColor: "bg-purple-200 text-purple-800",
      view: "-",
      amount: "-",
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 4;

  const onPageChange = (page: number) => {
    console.log("Change to page:", page);
    setCurrentPage(page);
  };

  return (
    <div>
      <TabsNavigation />
      <FilterPanel />
      <Table data={data} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}
