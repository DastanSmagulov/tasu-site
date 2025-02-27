"use client";

import { useEffect, useState } from "react";
import FilterPanel from "@/shared/FilterPanel";
import Table from "@/shared/Table";
import Pagination from "@/shared/Pagination";
import { axiosInstance } from "@/helper/utils";
import { TableRow } from "@/helper/types";
import "../../styles/globals.css";
import ManagerTable from "@/shared/ManagerTable";

const ManagerPage = () => {
  const [data, setData] = useState<TableRow[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
  const [prevPageUrl, setPrevPageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    number: "",
    search: "",
    consignment__cargo_status: "",
    sender_city__name_ru: "",
    receiver_city__name_ru: "",
    created_at: "",
    closed_at: "",
    ordering: "",
    limit: "10",
  });

  function formatDateForServer(dateStr: string) {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  const limit = parseInt(filters.limit, 10);

  const buildQueryString = () => {
    const params = new URLSearchParams();

    if (filters.search) {
      params.set("search", filters.search);
    }
    if (filters.number) {
      params.set("number", filters.number);
    }
    if (filters.consignment__cargo_status) {
      params.set(
        "consignment__cargo_status",
        filters.consignment__cargo_status
      );
    }
    if (filters.sender_city__name_ru) {
      params.set("sender_city__name_ru", filters.sender_city__name_ru);
    }
    if (filters.receiver_city__name_ru) {
      params.set("receiver_city__name_ru", filters.receiver_city__name_ru);
    }
    if (filters.created_at) {
      params.set("created_at", formatDateForServer(filters.created_at));
    }
    if (filters.closed_at) {
      params.set("closed_at", formatDateForServer(filters.closed_at));
    }
    if (filters.ordering) {
      params.set("ordering", filters.ordering);
    }
    // Always set limit and reset offset.
    params.set("limit", filters.limit || "10");
    params.set("offset", "0");

    return params.toString();
  };

  /** Fetch data from API **/
  const fetchActsData = async (url?: string | null) => {
    setLoading(true);
    try {
      let finalUrl: string;
      if (url) {
        finalUrl = url;
      } else {
        const queryString = buildQueryString();
        finalUrl = `/acts/?${queryString}`;
      }
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
      <FilterPanel filters={filters} setFilters={setFilters} />
      <ManagerTable
        data={data}
        fetchActsData={fetchActsData}
        loading={loading}
      />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4">
        <h1 className="text-gray-700">
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
};

export default ManagerPage;
