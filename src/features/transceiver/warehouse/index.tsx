"use client";

import FilterPanel from "../../../shared/FilterPanel";
import Table from "../../../shared/Table";
import Pagination from "../../../shared/Pagination";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/helper/utils";
import { TableRow } from "@/helper/types";

const WarehousePage = () => {
  const [data, setData] = useState<TableRow[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
  const [prevPageUrl, setPrevPageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  // Set consignment__cargo_status to "IN_STORAGE" by default.
  const [filters, setFilters] = useState({
    search: "",
    consignment__cargo_status: "IN_STORAGE",
    sender_city: "",
    receiver_city: "",
    created_at: "",
    closed_at: "",
    ordering: "",
    limit: "10",
  });

  /** Fetch data from API **/
  const fetchActsData = async (url?: string | null) => {
    setLoading(true);
    try {
      let finalUrl = url;
      if (!finalUrl) {
        // Build query parameters from the filters and add an offset=0
        const queryParams = { ...filters, offset: "0" };
        finalUrl = `/acts/?${new URLSearchParams(queryParams).toString()}`;
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

  const limit = parseInt(filters.limit, 10);

  return (
    <div>
      <FilterPanel filters={filters} setFilters={setFilters} />
      {/* Display message if no acts are found and loading is complete */}
      {!loading && data.length === 0 ? (
        <p className="text-center text-lg text-gray-700">
          Нет актов на складе.
        </p>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default WarehousePage;
