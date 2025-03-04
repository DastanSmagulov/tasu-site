"use client";
import React, { useState, useEffect } from "react";
import Table from "@/components/Table";
import { axiosInstance } from "@/helper/utils";
import Checkbox from "@/components/ui/CheckBox";

interface ExpenseItem {
  id: number;
  name: string | number;
  quantity: number;
  price: string;
  total_cost: string;
}

// Common columns for expense items
const expenseColumns = [
  { label: "Наименование", key: "name" },
  { label: "Кол-во", key: "quantity" },
  { label: "Цена", key: "price" },
  { label: "Стоимость", key: "total_cost" },
];

const ExpensesPage: React.FC = () => {
  // State for each expense type
  const [dataCustomer, setDataCustomer] = useState<ExpenseItem[]>([]);
  const [dataPartner, setDataPartner] = useState<ExpenseItem[]>([]);
  const [dataTransportation, setDataTransportation] = useState<ExpenseItem[]>(
    []
  );
  // State for checkbox - only if checked will tables be shown
  const [hasExpenses, setHasExpenses] = useState(false);

  // Fetch functions
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

  useEffect(() => {
    // Only fetch expenses if checkbox is checked
    if (hasExpenses) {
      fetchExpenseCustomer();
      fetchExpensePartner();
      fetchExpenseTransportation();
    }
  }, [hasExpenses]);

  // Expense API handlers for each type

  // Customer
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

  const deleteExpenseCustomer = async (ids: number[]) => {
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

  // Partner
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

  const deleteExpensePartner = async (ids: number[]) => {
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

  // Transportation
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

  const deleteExpenseTransportation = async (ids: number[]) => {
    try {
      await axiosInstance.delete(
        "/expenses/expense-transportation/bulk-delete/",
        { data: { ids } }
      );
      fetchExpenseTransportation();
    } catch (error) {
      console.error("Error deleting transportation expenses:", error);
      alert("Ошибка при удалении расхода Перевозчика");
    }
  };

  // Global report functions
  const handleCreateReport = () => {
    const reportPayload = {
      customer: dataCustomer,
      partner: dataPartner,
      transportation: dataTransportation,
    };
    console.log("Creating report with payload:", reportPayload);
    // Send reportPayload to your endpoint if needed.
  };

  const handleSendReport = async () => {
    console.log("Отправка отчета...");
    // Implement report submission if needed.
  };

  return (
    <div className="flex flex-col bg-gray-50 pb-10">
      <h1 className="text-2xl font-bold my-4">Наименование</h1>
      <div className="flex gap-2 my-4 items-center">
        <Checkbox
          id="expensesCheckbox"
          checked={hasExpenses}
          onChange={(e) => setHasExpenses(e.target.checked)}
        />
        <p>Есть расходы?</p>
      </div>
      {hasExpenses && (
        <>
          <div className="flex flex-col gap-10">
            {/* Customer Expenses Table */}
            <Table
              text="Расход Заказчика"
              columns={expenseColumns}
              data={dataCustomer}
              onRowSelect={(selectedRows) => {
                // Not used here because onDeleteRows is provided
              }}
              onAddRow={addExpenseCustomer}
              onDeleteRows={(selectedRows: Set<number>) => {
                const ids = Array.from(selectedRows).map(
                  (index) => dataCustomer[index].id
                );
                deleteExpenseCustomer(ids);
              }}
              onEditRow={(id, updatedData) =>
                updateExpenseCustomer(id, updatedData)
              }
              width="full"
            />

            {/* Partner Expenses Table */}
            <Table
              text="Расход Партнёров"
              columns={expenseColumns}
              data={dataPartner}
              onRowSelect={() => {}}
              onAddRow={addExpensePartner}
              onDeleteRows={(selectedRows: Set<number>) => {
                const ids = Array.from(selectedRows).map(
                  (index) => dataPartner[index].id
                );
                deleteExpensePartner(ids);
              }}
              onEditRow={(id, updatedData) =>
                updateExpensePartner(id, updatedData)
              }
              width="full"
            />

            {/* Transportation Expenses Table */}
            <Table
              text="Расход Перевозчика"
              columns={expenseColumns}
              data={dataTransportation}
              onRowSelect={() => {}}
              onAddRow={addExpenseTransportation}
              onDeleteRows={(selectedRows: Set<number>) => {
                const ids = Array.from(selectedRows).map(
                  (index) => dataTransportation[index].id
                );
                deleteExpenseTransportation(ids);
              }}
              onEditRow={(id, updatedData) =>
                updateExpenseTransportation(id, updatedData)
              }
              width="full"
            />
          </div>

          <div className="flex flex-wrap justify-end gap-4 mt-8">
            <button
              onClick={handleCreateReport}
              className="font-semibold border border-gray-500 px-4 py-2 bg-white hover:bg-gray-100 text-black rounded-lg"
            >
              Создать карточку
            </button>
            <button
              onClick={handleSendReport}
              className="font-semibold px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
            >
              Выслать
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ExpensesPage;
