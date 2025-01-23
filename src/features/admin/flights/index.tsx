"use client";
import Table from "@/components/Table";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const FlightsPage = () => {
  const [dataCars, setDataCars] = useState([]);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const token = Cookies.get("auth_token");

  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Fetch cars from the API and transform to desired format
  const fetchCars = async () => {
    try {
      const response = await axiosInstance.get(`/admin/cars/`);
      setDataCars(
        response.data.map((car: any) => ({
          type: car.license_plate,
          info1: car.brand,
          info2: car.color,
          info3: car.model,
          info4: "", // Add an empty field for info4
        }))
      );
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  // Add a car to the API
  const addCar = async (car: {
    license_plate: string;
    brand: string;
    model: string;
    color: string;
  }) => {
    try {
      await axiosInstance.post(`/admin/cars/`, car);
      await fetchCars(); // Refresh the cars data
    } catch (error) {
      console.error("Error adding car:", error);
    }
  };

  const deleteCar = async (id: number) => {
    try {
      await axiosInstance.delete(`/admin/cars/${id}/`);
      await fetchCars(); // Refresh the cars data
    } catch (error) {
      console.error("Error deleting car:", error);
    }
  };

  const handleRowSelect = (selectedRows: any[]) => {
    console.log("Selected Rows:", selectedRows);
  };

  useEffect(() => {
    fetchCars();
  }, []);

  console.log(dataCars);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex gap-10">
        <Table
          text="Города отправление"
          columns={[
            { label: "No", key: "type" },
            { label: "Наименование", key: "info1" },
          ]}
          data={[
            { type: "1.", info1: "Астана" },
            { type: "1.", info1: "Астана" },
            { type: "1.", info1: "Астана" },
            { type: "1.", info1: "Астана" },
          ]}
          onRowSelect={handleRowSelect}
          width="3/12"
        />
        <Table
          text="Города получения"
          columns={[
            { label: "No", key: "type" },
            { label: "Наименование", key: "info1" },
          ]}
          data={[
            { type: "1.", info1: "Астана" },
            { type: "1.", info1: "Астана" },
            { type: "1.", info1: "Астана" },
            { type: "1.", info1: "Астана" },
          ]}
          onRowSelect={handleRowSelect}
          width="3/12"
        />
      </div>
      <Table
        text="Машина"
        columns={[
          { label: "Госномер", key: "type" },
          { label: "Бренд", key: "info1" },
          { label: "Цвет", key: "info2" },
          { label: "Модель", key: "info3" },
          { label: "Доп. поле", key: "info4" },
        ]}
        data={dataCars}
        onRowSelect={handleRowSelect}
        width="1/2"
      />
      <Table
        text="Самолет"
        columns={[
          { label: "Номер рейса", key: "type" },
          { label: "Авиа компания", key: "info1" },
        ]}
        data={[
          { type: "Number", info1: "Text" },
          { type: "Number", info1: "Text" },
          { type: "Number", info1: "Text" },
          { type: "Number", info1: "Text" },
        ]}
        onRowSelect={handleRowSelect}
        width="1/2"
      />
      <Table
        text="Поезд"
        columns={[
          { label: "Номер поезда", key: "type" },
          { label: "Маршрут поезда", key: "info1" },
          { label: "Жд компания", key: "info2" },
        ]}
        data={[
          { type: "Name", info1: "", info2: "Text" },
          { type: "Name", info1: "", info2: "Text" },
          { type: "Name", info1: "", info2: "Text" },
          { type: "Name", info1: "", info2: "Text" },
          { type: "Name", info1: "", info2: "Text" },
        ]}
        onRowSelect={handleRowSelect}
        width="1/2"
      />
    </div>
  );
};

export default FlightsPage;
