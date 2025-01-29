"use client";

import React, { useEffect, useState } from "react";
import Table from "../../components/Table";
import { axiosInstance } from "@/helper/utils";

type CargoItem = {
  id?: number;
  name_kz: string;
  name_ru: string;
  name_en: string;
};

const CargoCharacteristics = () => {
  const [cargoData, setCargoData] = useState<CargoItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const columns = [
    { label: "Название (RU)", key: "name_ru" },
    { label: "Название (KZ)", key: "name_kz" },
    { label: "Название (EN)", key: "name_en" },
  ];

  // Fetch cargo data
  const fetchCargoData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/admin/characteristics/");
      const sortedData = response.data.results.sort(
        (a: CargoItem, b: CargoItem) => a.id! - b.id!
      );
      setCargoData(sortedData);
    } catch (err) {
      setError("Failed to fetch cargo data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Add new cargo characteristic
  const handleAddCargo = async (newCargo: CargoItem) => {
    try {
      await axiosInstance.post("/admin/characteristics/", newCargo);
      fetchCargoData();
    } catch (err) {
      setError("Failed to add cargo characteristic. Please try again.");
      console.error(err);
    }
  };

  // Update cargo characteristic
  const handleUpdateCargo = async (
    id: number,
    updatedCargo: Partial<CargoItem>
  ) => {
    try {
      await axiosInstance.patch(`/admin/characteristics/${id}/`, updatedCargo);
      fetchCargoData();
    } catch (err) {
      setError("Failed to update cargo characteristic. Please try again.");
      console.error(err);
    }
  };

  // Delete cargo characteristics in bulk
  const handleDeleteCargo = async (ids: number[]) => {
    try {
      await axiosInstance.delete("/admin/characteristics/bulk-delete/", {
        data: { ids },
      });
      fetchCargoData();
    } catch (err) {
      setError("Failed to delete cargo characteristics. Please try again.");
      console.error(err);
    }
  };

  const handleRowSelect = (selectedRows: any[]) => {
    console.log("Selected Rows:", selectedRows);
  };

  useEffect(() => {
    fetchCargoData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen w-full">
      {error && <div className="text-red-500">{error}</div>}
      <Table
        text="Характер груза"
        columns={columns}
        data={cargoData}
        onRowSelect={handleRowSelect}
        width="2/3"
        onAddRow={handleAddCargo}
        onDeleteRows={(selectedRows) => {
          const ids = Array.from(selectedRows).map((index) =>
            Number(cargoData[index].id)
          );
          handleDeleteCargo(ids);
        }}
        onEditRow={(id, updatedData) => handleUpdateCargo(id, updatedData)}
      />
    </div>
  );
};

export default CargoCharacteristics;
