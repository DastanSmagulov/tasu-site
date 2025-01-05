"use client";

import { useEffect, useState } from "react";
import TabsNavigation from "@/shared/TabsNavigation";
import { useRouter } from "next/navigation";
import FilterPanel from "@/shared/FilterPanel";
import Table from "@/shared/Table";
import Pagination from "@/shared/Pagination";
import "../../styles/globals.css";

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

const AccountantPage = () => {
  const data = [
    {
      id: "#000107",
      customer: "Смирнова Ольга",
      date: "02 14 2022",
      place: "2 места",
      weight: "18 кг",
      volume: "1.5 м³",
      status: "не готов к отправке",
      statusColor: "bg-blue-200 text-blue-800",
      view: "-",
      amount: "-",
    },
    {
      id: "#000108",
      customer: "Васильев Александр",
      date: "03 30 2022",
      place: "3 места",
      weight: "22 кг",
      volume: "2.3 м³",
      status: "готов к отправке",
      statusColor: "bg-green-200 text-green-800",
      view: "-",
      amount: "-",
    },
    {
      id: "#000109",
      customer: "Егоров Алексей",
      date: "05 21 2022",
      place: "1 место",
      weight: "7 кг",
      volume: "0.7 м³",
      status: "не готов к отправке",
      statusColor: "bg-purple-200 text-purple-800",
      view: "-",
      amount: "-",
    },
    {
      id: "#000110",
      customer: "Павлова Ирина",
      date: "06 10 2022",
      place: "2 места",
      weight: "14 кг",
      volume: "1.3 м³",
      status: "готов к отправке",
      statusColor: "bg-blue-300 text-blue-800",
      view: "-",
      amount: "-",
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  //   if (status === "loading") {
  //     return <div>Loading...</div>;
  //   }

  const totalPages = 4;

  const onPageChange = (page: number) => {
    console.log("Change to page:", page);
    setCurrentPage(page);
  };

  return (
    <div>
      <TabsNavigation role="accountant" />
      <FilterPanel />
      <Table data={data} role="accountant" />
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

export default AccountantPage;
