"use client";

import FilterPanel from "../components/FilterPanel";
import Table from "../components/Table";
import Pagination from "../components/Pagination";
import { useState } from "react";
("./globals.css");

// Define the data type
type DocumentData = {
  id: string;
  number: string;
  client: string;
  date: string;
  status: string;
};

export default function Home() {
  const [data, setData] = useState<DocumentData[]>([
    {
      id: "1",
      number: "#001",
      client: "Client A",
      date: "2024-05-04",
      status: "Shipped",
    },
    // More sample data here
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 4;

  const onPageChange = (page: number) => {
    console.log("Change to page:", page);
    setCurrentPage(page);
    // Update data accordingly
  };

  return (
    <div>
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
