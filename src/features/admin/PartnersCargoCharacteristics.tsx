"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "../../components/Table";
import { axiosInstance } from "@/helper/utils";

type PartnerCargoItem = {
  id?: number; // Added for API operations
  checked: boolean;
  name: string;
  bin: string;
  service: string;
};

const PartnerCargoCharacteristics = () => {
  const [partners, setPartners] = useState<PartnerCargoItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch partners data from the API
  const fetchPartners = async () => {
    try {
      const response = await axiosInstance.get(`/admin/partners/`);
      setPartners(response.data.results);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching partners:", error);
      setError("Failed to fetch partners. Please try again.");
      setLoading(false);
    }
  };

  // Add a new partner
  const handleAddPartner = async (newPartner: any) => {
    console.log(newPartner);
    try {
      const response = await axiosInstance.post(`/admin/partners/`, newPartner);
      setPartners((prev) => [...prev, response.data]);
    } catch (error) {
      console.error("Error adding partner:", error);
      setError("Failed to add partner. Please try again.");
    }
  };

  // Edit an existing partner
  const handleEditPartner = async (
    id: number,
    updatedData: Partial<PartnerCargoItem>
  ) => {
    try {
      const response = await axiosInstance.patch(
        `/admin/partners/${id}/`,
        updatedData
      );
      setPartners((prev) =>
        prev.map((partner) =>
          partner.id === id ? { ...partner, ...response.data } : partner
        )
      );
    } catch (error) {
      console.error("Error editing partner:", error);
      setError("Failed to edit partner. Please try again.");
    }
  };

  const deletePartners = async (ids: number[] | undefined) => {
    try {
      await axiosInstance.delete(`/admin/partners/bulk-delete/`, {
        data: { ids }, // Wrap the array in an object with the key "ids"
      });

      await fetchPartners();
    } catch (error) {
      console.error("Error deleting partners:", error);
      setError("Failed to delete partners. Please try again.");
    }
  };

  // Fetch partners on component mount
  useEffect(() => {
    fetchPartners();
  }, []);

  // Define table columns
  const columns = [
    { label: "Партнеры", key: "name" },
    { label: "БИН", key: "bin" },
    { label: "Товар / Услуга", key: "service" },
  ];

  // Transform data for the table
  const tableData = partners.map((partner) => ({
    id: partner.id,
    name: partner.name,
    bin: partner.bin,
    service: partner.service,
  }));

  // Handle row selection
  const handleRowSelect = (selectedRows: any[]) => {
    console.log("Selected Rows:", selectedRows);
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Table
        text="Характер груза"
        columns={columns}
        data={tableData}
        onRowSelect={handleRowSelect}
        onAddRow={handleAddPartner}
        onEditRow={handleEditPartner}
        onDeleteRows={(selectedRows) => {
          const ids = Array.from(selectedRows).map((index) =>
            Number(partners[index].id)
          );
          deletePartners(ids);
        }}
        width="1/2"
      />
    </div>
  );
};

export default PartnerCargoCharacteristics;
