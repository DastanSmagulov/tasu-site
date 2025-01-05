"use client";

import { useEffect, useState } from "react";
import TabsNavigation from "@/shared/TabsNavigation";
import { useRouter } from "next/navigation";
import FilterPanel from "@/shared/FilterPanel";
import Table from "@/shared/Table";
import Pagination from "@/shared/Pagination";
("./globals.css");

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

const CMPPage = () => {
  const data = [
    {
      id: "#000101",
      customer: "Иванов Иван",
      date: "03 20 2021",
      place: "2 места",
      weight: "15 кг",
      volume: "1.2 м³",
      status: "заявка сформирована",
      statusColor: "bg-blue-300 text-blue-800",
      view: "-",
      amount: "-",
    },
    {
      id: "#000102",
      customer: "Петрова Анна",
      date: "05 15 2021",
      place: "1 место",
      weight: "10 кг",
      volume: "0.8 м³",
      status: "оплата подтверждена",
      statusColor: "bg-purple-200 text-purple-800",
      view: "-",
      amount: "-",
    },
    {
      id: "#000103",
      customer: "Сидоров Алексей",
      date: "07 01 2021",
      place: "3 места",
      weight: "25 кг",
      volume: "2.0 м³",
      status: "акт сформирован",
      statusColor: "bg-blue-200 text-blue-800",
      view: "-",
      amount: "-",
    },
    {
      id: "#000104",
      customer: "Кузнецова Мария",
      date: "09 10 2021",
      place: "1 место",
      weight: "8 кг",
      volume: "0.5 м³",
      status: "доставка завершена",
      statusColor: "bg-green-200 text-green-800",
      view: "-",
      amount: "-",
    },
    {
      id: "#000105",
      customer: "Коновалов Сергей",
      date: "11 18 2021",
      place: "2 места",
      weight: "12 кг",
      volume: "1.1 м³",
      status: "заявка сформирована",
      statusColor: "bg-blue-300 text-blue-800",
      view: "-",
      amount: "-",
    },
    {
      id: "#000106",
      customer: "Федоров Дмитрий",
      date: "12 25 2021",
      place: "1 место",
      weight: "5 кг",
      volume: "0.4 м³",
      status: "оплата подтверждена",
      statusColor: "bg-purple-200 text-purple-800",
      view: "-",
      amount: "-",
    },
    {
      id: "#000107",
      customer: "Смирнова Ольга",
      date: "02 14 2022",
      place: "2 места",
      weight: "18 кг",
      volume: "1.5 м³",
      status: "акт сформирован",
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
      status: "доставка завершена",
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
      status: "отправлен на склад",
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
      status: "заявка сформирована",
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
      <TabsNavigation role="manager" />
      <FilterPanel />
      <Table data={data} role="manager" />
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

export default CMPPage;
