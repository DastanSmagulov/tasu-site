"use client";

import { useEffect, useState } from "react";
import FilterPanel from "@/shared/FilterPanel";
import Table from "@/shared/Table";
import Pagination from "@/shared/Pagination";
import { TableRow } from "@/helper/types";
import { axiosInstance } from "@/helper/utils";
import "../../styles/globals.css";

interface Filters {
  number: string;
  search: string;
  consignment__cargo_status: string;
  sender_city: string; // we store the city name or ID
  receiver_city: string; // we store the city name or ID
  created_at: string;
  closed_at: string;
  ordering: string;
  limit: string; // always a string, parse it to int
}

function buildQueryParams(filters: Filters) {
  const params = new URLSearchParams();

  // Map each filter key to the expected query param
  if (filters.search) {
    params.set("search", filters.search);
  }
  if (filters.number) {
    params.set("number", filters.number);
  }
  if (filters.consignment__cargo_status) {
    params.set("consignment__cargo_status", filters.consignment__cargo_status);
  }
  if (filters.sender_city) {
    params.set("sender_city__name_ru", filters.sender_city);
  }
  if (filters.receiver_city) {
    params.set("receiver_city__name_ru", filters.receiver_city);
  }
  if (filters.created_at) {
    params.set("created_at", filters.created_at);
  }
  if (filters.closed_at) {
    params.set("closed_at", filters.closed_at);
  }
  if (filters.ordering) {
    params.set("ordering", filters.ordering);
  }
  // Always set limit
  params.set("limit", filters.limit || "10");

  return params.toString();
}

export default function TransceiverPage() {
  const [data, setData] = useState<TableRow[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
  const [prevPageUrl, setPrevPageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<Filters>({
    number: "",
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

  // Fetch data from API
  const fetchActsData = async (url?: string | null) => {
    setLoading(true);
    try {
      let finalUrl = url;

      // If no URL is provided (i.e. not a "next" or "previous" link),
      // build the query string from the current filters.
      if (!finalUrl) {
        const queryString = buildQueryParams(filters);
        finalUrl = `/acts/?${queryString}&offset=0`;
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

  // When filters change, reset to page 1 and fetch new data
  useEffect(() => {
    fetchActsData(null); // pass null so we build from the updated filters
  }, [filters]);

  return (
    <div>
      {/* Filter Panel updates filters via setFilters */}
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
