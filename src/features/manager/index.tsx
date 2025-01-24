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

const ManagerPage = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = 4;

  const onPageChange = (page: number) => {
    console.log("Change to page:", page);
    setCurrentPage(page);
  };

  return (
    <div>
      <TabsNavigation role="manager" />
      <FilterPanel />
      <Table />
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

export default ManagerPage;
