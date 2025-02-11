"use client";

import { useEffect, useState } from "react";
import { TableRow } from "@/helper/types";
import { axiosInstance } from "@/helper/utils";
import TabsNavigation from "@/shared/TabsNavigation";
import FilterPanel from "@/shared/FilterPanel";
import Pagination from "@/shared/Pagination";
import Table from "@/shared/Table";

export default function AdminPage() {
  const [data, setData] = useState<TableRow[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
  const [prevPageUrl, setPrevPageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    consignment__cargo_status: "",
    sender_city: "",
    receiver_city: "",
    created_at: "",
    closed_at: "",
    ordering: "",
    limit: "10",
  });

  const limit = parseInt(filters.limit, 10);

  /** Fetch data from API **/
  const fetchActsData = async (url?: string | null) => {
    setLoading(true);
    try {
      let finalUrl = url || `/acts/?limit=${limit}&offset=0`; // Default to first page if no URL

      const response = await axiosInstance.get(finalUrl);
      setData(response.data.results);
      setTotalCount(response.data.count);
      setNextPageUrl(response.data.next);
      setPrevPageUrl(response.data.previous);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  /** When filters change, reset to page 1 and fetch new data **/
  useEffect(() => {
    fetchActsData();
  }, [filters]);

  return (
    <div>
      <TabsNavigation role="admin" />
      <FilterPanel filters={filters} setFilters={setFilters} />
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
      </div>
    </div>
  );
}
