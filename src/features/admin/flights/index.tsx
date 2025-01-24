"use client";
import Table from "@/components/Table";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

interface Car {
  id: number;
  type: string;
  info1: string;
  info2: string;
  info3: string;
}

interface Flight {
  id: number;
  type: string;
  info1: string;
}

interface Train {
  id: number;
  type: string;
  info1: string;
  info2: string;
}

const FlightsPage = () => {
  const [dataCars, setDataCars] = useState<Car[]>([]);
  const [dataFlights, setDataFlights] = useState<Flight[]>([]);
  const [dataTrains, setDataTrains] = useState<Train[]>([]);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const token = Cookies.get("auth_token");

  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Fetch cars from the API
  const fetchCars = async () => {
    try {
      const response = await axiosInstance.get(`/admin/cars/`);
      setDataCars(
        response.data.results.map((car: any) => ({
          id: car.id,
          type: car.license_plate,
          info1: car.brand,
          info2: car.color,
          info3: car.model,
        }))
      );
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  // Fetch flights from the API
  const fetchFlights = async () => {
    try {
      const response = await axiosInstance.get(`/admin/planes/`);
      setDataFlights(
        response.data.results.map((plane: any) => ({
          id: plane.id,
          type: plane.flight_number,
          info1: plane.airline,
        }))
      );
    } catch (error) {
      console.error("Error fetching flights:", error);
    }
  };

  // Fetch trains from the API
  const fetchTrains = async () => {
    try {
      const response = await axiosInstance.get(`/admin/trains/`);
      setDataTrains(
        response.data.results.map((train: any) => ({
          id: train.id,
          type: train.train_number,
          info1: train.train_route,
          info2: train.railway_company,
        }))
      );
    } catch (error) {
      console.error("Error fetching trains:", error);
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

  // Add a flight to the API
  const addFlight = async (flight: {
    flight_number: string;
    airline: string;
  }) => {
    try {
      await axiosInstance.post(`/admin/planes/`, flight);
      await fetchFlights(); // Refresh the flights data
    } catch (error) {
      console.error("Error adding flight:", error);
    }
  };

  // Add a train to the API
  const addTrain = async (train: {
    train_number: string;
    train_route: string;
    railway_company: string;
  }) => {
    try {
      await axiosInstance.post(`/admin/trains/`, train);
      await fetchTrains(); // Refresh the trains data
    } catch (error) {
      console.error("Error adding train:", error);
    }
  };

  // Add these functions to handle patching individual items
  const updateCar = async (id: number, updatedData: Partial<Car>) => {
    try {
      await axiosInstance.patch(`/admin/cars/${id}/`, updatedData);
      await fetchCars(); // Refresh the cars data
    } catch (error) {
      console.error("Error updating car:", error);
    }
  };

  const updateFlight = async (id: number, updatedData: Partial<Flight>) => {
    try {
      await axiosInstance.patch(`/admin/planes/${id}/`, updatedData);
      await fetchFlights(); // Refresh the flights data
    } catch (error) {
      console.error("Error updating flight:", error);
    }
  };

  const updateTrain = async (id: number, updatedData: Partial<Train>) => {
    try {
      await axiosInstance.patch(`/admin/trains/${id}/`, updatedData);
      await fetchTrains(); // Refresh the trains data
    } catch (error) {
      console.error("Error updating train:", error);
    }
  };

  // Bulk delete cars from the API
  const deleteCars = async (ids: number[]) => {
    try {
      await axiosInstance.delete(`/admin/cars/bulk-delete/`, { data: { ids } });
      await fetchCars(); // Refresh the cars data
    } catch (error) {
      console.error("Error deleting cars:", error);
    }
  };

  // Bulk delete flights from the API
  const deleteFlights = async (ids: number[]) => {
    try {
      await axiosInstance.delete(`/admin/planes/bulk-delete/`, {
        data: { ids },
      });
      await fetchFlights(); // Refresh the flights data
    } catch (error) {
      console.error("Error deleting flights:", error);
    }
  };

  // Bulk delete trains from the API
  const deleteTrains = async (ids: number[]) => {
    try {
      await axiosInstance.delete(`/admin/trains/bulk-delete/`, {
        data: { ids },
      });
      await fetchTrains(); // Refresh the trains data
    } catch (error) {
      console.error("Error deleting trains:", error);
    }
  };

  const handleRowSelect = (selectedRows: any[]) => {
    console.log("Selected Rows:", selectedRows);
  };

  const handleAddCar = (newRow: any) => {
    const newCar = {
      license_plate: newRow.type,
      brand: newRow.info1,
      model: newRow.info3,
      color: newRow.info2,
    };
    addCar(newCar);
  };

  const handleAddFlight = (newRow: any) => {
    const newFlight = {
      flight_number: newRow.type,
      airline: newRow.info1,
    };
    addFlight(newFlight);
  };

  const handleAddTrain = (newRow: any) => {
    const newTrain = {
      train_number: newRow.type,
      train_route: newRow.info1,
      railway_company: newRow.info2,
    };
    addTrain(newTrain);
  };

  useEffect(() => {
    fetchCars();
    fetchFlights();
    fetchTrains();
  }, []);

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
        ]}
        data={dataCars}
        onRowSelect={handleRowSelect}
        onAddRow={handleAddCar}
        onDeleteRows={(selectedRows) => {
          const ids = Array.from(selectedRows).map(
            (index) => dataCars[index].id
          );
          deleteCars(ids);
        }}
        onEditRow={(id, updatedData) => updateCar(id, updatedData)}
        width="1/2"
      />
      <Table
        text="Самолет"
        columns={[
          { label: "Номер рейса", key: "type" },
          { label: "Авиа компания", key: "info1" },
        ]}
        data={dataFlights}
        onRowSelect={handleRowSelect}
        onAddRow={handleAddFlight}
        onDeleteRows={(selectedRows) => {
          const ids = Array.from(selectedRows).map(
            (index) => dataFlights[index].id
          );
          deleteFlights(ids);
        }}
        onEditRow={(id, updatedData) => updateFlight(id, updatedData)}
        width="1/2"
      />
      <Table
        text="Поезд"
        columns={[
          { label: "Номер поезда", key: "type" },
          { label: "Маршрут поезда", key: "info1" },
          { label: "Жд компания", key: "info2" },
        ]}
        data={dataTrains}
        onRowSelect={handleRowSelect}
        onAddRow={handleAddTrain}
        onDeleteRows={(selectedRows) => {
          const ids = Array.from(selectedRows).map(
            (index) => dataTrains[index].id
          );
          deleteTrains(ids);
        }}
        onEditRow={(id, updatedData) => updateTrain(id, updatedData)}
        width="1/2"
      />
    </div>
  );
};

export default FlightsPage;
