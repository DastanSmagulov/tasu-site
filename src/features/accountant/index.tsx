"use client";

import { useEffect, useState } from "react";
import TabsNavigation from "@/shared/TabsNavigation";
import { useRouter } from "next/navigation";
import FilterPanel from "@/shared/FilterPanel";
import Table from "@/shared/Table";
import Pagination from "@/shared/Pagination";
import "../../styles/globals.css";
import { axiosInstance } from "@/helper/utils";
import { AccountantTableRow, TableRow } from "@/helper/types";
import AccountantTable from "@/shared/AccountantTable";

const AccountantPage = () => {
  const [data, setData] = useState<AccountantTableRow[]>([]);
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

  const limit = parseInt(filters.limit, 10);

  /** Build a URL query string from filters **/
  const buildQueryString = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.append(key, value);
      }
    });
    // Reset offset to 0 on filters change.
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
      <TabsNavigation role="accountant" />
      <FilterPanel filters={filters} setFilters={setFilters} />
      <AccountantTable
        data={data}
        fetchActsData={fetchActsData}
        loading={loading}
      />
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
};

export default AccountantPage;
