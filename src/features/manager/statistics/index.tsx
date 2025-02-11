"use client";

import FilterPanel from "../../../shared/FilterPanel";
import Table from "../../../shared/Table";
import Pagination from "../../../shared/Pagination";
import { useEffect, useState } from "react";
import StatisticsComponent from "@/components/Statistiks";
import { axiosInstance } from "@/helper/utils";
import { TableRow } from "@/helper/types";
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

export default function StatisticsPage() {
  const [data, setData] = useState<TableRow[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [previousPage, setPreviousPage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    consignment__cargo_status: "",
    sender_city: "",
    receiver_city: "",
    created_at: "",
    closed_at: "",
    ordering: "",
    limit: "10", // API работает с limit и offset
  });

  const limit = parseInt(filters.limit, 10);

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const fetchActsData = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();

      // Append filters to the query params
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      queryParams.append("page", currentPage.toString());

      const url = `/acts/?${queryParams.toString()}`;

      // Fetch filtered acts
      const actsResponse = await axiosInstance.get(url);
      const actsData = actsResponse.data.results;

      // Update pagination state
      setTotalCount(actsResponse.data.count);
      setNextPage(actsResponse.data.next);
      setPreviousPage(actsResponse.data.previous);

      // Process data...
      setData(actsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActsData();
  }, [filters, currentPage]);

  return (
    <div>
      {/* <WarehouseActList /> */}
      <StatisticsComponent />
      {/* <FilterPanel filters={filters} setFilters={setFilters} />
      <Table data={data} fetchActsData={fetchActsData} loading={loading} />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h1>
          Показано {data.length} из {totalCount} данных
        </h1>
        <Pagination
          totalCount={totalCount}
          pageSize={limit}
          next={nextPageUrl}
          previous={prevPageUrl}
          onPageChange={fetchActsData}
        />
      </div> */}
    </div>
  );
}
