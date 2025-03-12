"use client";
import React, { useState, useEffect, useMemo } from "react";
import Table from "@/components/Table";
import { axiosInstance } from "@/helper/utils";
import { ExpenseItem } from "@/helper/types";

const expenseColumns = [
  { label: "Наименование", key: "name" },
  { label: "Кол-во", key: "quantity" },
  { label: "Цена", key: "price" },
  { label: "Стоимость", key: "total_cost" },
];

const ExpensesTable: React.FC = () => {
  // State for each expense type
  const [dataCustomer, setDataCustomer] = useState<ExpenseItem[]>([]);
  const [dataPartner, setDataPartner] = useState<ExpenseItem[]>([]);
  const [dataTransportation, setDataTransportation] = useState<ExpenseItem[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  // Fetch functions for each expense type
  const fetchExpenseCustomer = async () => {
    try {
      const response = await axiosInstance.get("/expenses/expense-customer/");
      setDataCustomer(response.data.results);
    } catch (error) {
      console.error("Error fetching customer expenses:", error);
    }
  };

  const fetchExpensePartner = async () => {
    try {
      const response = await axiosInstance.get("/expenses/expense-partner/");
      setDataPartner(response.data.results);
    } catch (error) {
      console.error("Error fetching partner expenses:", error);
    }
  };

  const fetchExpenseTransportation = async () => {
    try {
      const response = await axiosInstance.get(
        "/expenses/expense-transportation/"
      );
      setDataTransportation(response.data.results);
    } catch (error) {
      console.error("Error fetching transportation expenses:", error);
    }
  };

  // Fetch all expense data when component mounts
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([
        fetchExpenseCustomer(),
        fetchExpensePartner(),
        fetchExpenseTransportation(),
      ]);
      setLoading(false);
    };
    fetchAll();
  }, []);

  // API handlers (implement these as needed)
  const addExpenseCustomer = async (newRow: any) => {
    try {
      const payload = {
        name: newRow.name || "Новый расход",
        quantity: newRow.quantity || 1,
        price: newRow.price || "0",
        total_cost: newRow.total_cost || "0",
      };
      await axiosInstance.post("/expenses/expense-customer/", payload);
      fetchExpenseCustomer();
    } catch (error) {
      console.error("Error creating customer expense:", error);
      alert("Ошибка при создании расхода Заказчика");
    }
  };

  const updateExpenseCustomer = async (
    id: number,
    updatedData: Partial<ExpenseItem>
  ) => {
    try {
      await axiosInstance.patch(
        `/expenses/expense-customer/${id}/`,
        updatedData
      );
      fetchExpenseCustomer();
    } catch (error) {
      console.error("Error updating customer expense:", error);
      alert("Ошибка при обновлении расхода Заказчика");
    }
  };

  const deleteExpenseCustomer = async (selectedRows: Set<number>) => {
    const ids = Array.from(selectedRows);
    try {
      await axiosInstance.delete("/expenses/expense-customer/bulk-delete/", {
        data: { ids },
      });
      fetchExpenseCustomer();
    } catch (error) {
      console.error("Error deleting customer expenses:", error);
      alert("Ошибка при удалении расхода Заказчика");
    }
  };

  const addExpensePartner = async (newRow: any) => {
    try {
      const payload = {
        name: newRow.name || "Новый расход",
        quantity: newRow.quantity || 1,
        price: newRow.price || "0",
        total_cost: newRow.total_cost || "0",
      };
      await axiosInstance.post("/expenses/expense-partner/", payload);
      fetchExpensePartner();
    } catch (error) {
      console.error("Error creating partner expense:", error);
      alert("Ошибка при создании расхода Партнёров");
    }
  };

  const updateExpensePartner = async (
    id: number,
    updatedData: Partial<ExpenseItem>
  ) => {
    try {
      await axiosInstance.patch(
        `/expenses/expense-partner/${id}/`,
        updatedData
      );
      fetchExpensePartner();
    } catch (error) {
      console.error("Error updating partner expense:", error);
      alert("Ошибка при обновлении расхода Партнёров");
    }
  };

  const deleteExpensePartner = async (selectedRows: Set<number>) => {
    const ids = Array.from(selectedRows);
    try {
      await axiosInstance.delete("/expenses/expense-partner/bulk-delete/", {
        data: { ids },
      });
      fetchExpensePartner();
    } catch (error) {
      console.error("Error deleting partner expenses:", error);
      alert("Ошибка при удалении расхода Партнёров");
    }
  };

  const addExpenseTransportation = async (newRow: any) => {
    try {
      const payload = {
        name: newRow.name || "Новый расход",
        quantity: newRow.quantity || 1,
        price: newRow.price || "0",
        total_cost: newRow.total_cost || "0",
      };
      await axiosInstance.post("/expenses/expense-transportation/", payload);
      fetchExpenseTransportation();
    } catch (error) {
      console.error("Error creating transportation expense:", error);
      alert("Ошибка при создании расхода Перевозчика");
    }
  };

  const updateExpenseTransportation = async (
    id: number,
    updatedData: Partial<ExpenseItem>
  ) => {
    try {
      await axiosInstance.patch(
        `/expenses/expense-transportation/${id}/`,
        updatedData
      );
      fetchExpenseTransportation();
    } catch (error) {
      console.error("Error updating transportation expense:", error);
      alert("Ошибка при обновлении расхода Перевозчика");
    }
  };

  const deleteExpenseTransportation = async (selectedRows: Set<number>) => {
    const ids = Array.from(selectedRows);
    try {
      await axiosInstance.delete(
        "/expenses/expense-transportation/bulk-delete/",
        {
          data: { ids },
        }
      );
      fetchExpenseTransportation();
    } catch (error) {
      console.error("Error deleting transportation expenses:", error);
      alert("Ошибка при удалении расхода Перевозчика");
    }
  };

  if (loading) return <p>Загрузка расходов...</p>;

  return (
    <div className="flex flex-col gap-10">
      {/* Customer Expenses Table */}
      <Table
        text="Расход Заказчика"
        columns={expenseColumns}
        data={dataCustomer}
        onRowSelect={() => {}}
        onAddRow={addExpenseCustomer}
        onDeleteRows={deleteExpenseCustomer}
        onEditRow={(id, updatedData) => updateExpenseCustomer(id, updatedData)}
        width="full"
      />

      {/* Partner Expenses Table */}
      <Table
        text="Расход Партнёров"
        columns={expenseColumns}
        data={dataPartner}
        onRowSelect={() => {}}
        onAddRow={addExpensePartner}
        onDeleteRows={deleteExpensePartner}
        onEditRow={(id, updatedData) => updateExpensePartner(id, updatedData)}
        width="full"
      />

      {/* Transportation Expenses Table */}
      <Table
        text="Расход Перевозчика"
        columns={expenseColumns}
        data={dataTransportation}
        onRowSelect={() => {}}
        onAddRow={addExpenseTransportation}
        onDeleteRows={deleteExpenseTransportation}
        onEditRow={(id, updatedData) =>
          updateExpenseTransportation(id, updatedData)
        }
        width="full"
      />
    </div>
  );
};

export default ExpensesTable;
