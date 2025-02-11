"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Table from "@/components/Table";
import { axiosInstance } from "@/helper/utils";
import "../../../styles/globals.css";

// Define data types
type UserData = {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  role: string;
};

type ClientData = {
  id: number;
  role: string;
  full_name: string;
  phone: string;
  client_address: string;
  account_details: string;
};

type Role = {
  key: string;
  value: string;
};

export default function UsersPage() {
  const [employeesData, setEmployeesData] = useState<UserData[]>([]);
  const [clientsData, setClientsData] = useState<ClientData[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const employeesColumns = [
    { label: "ФИО", key: "full_name" },
    { label: "Почта", key: "email" },
    { label: "Номер телефона", key: "phone" },
    {
      label: "Роль",
      key: "role",
      type: "dropdown" as const,
      options: roles.map((r) => ({ value: r.key, label: r.value })),
    },
  ];

  const clientsColumns = [
    { label: "ФИО", key: "full_name" },
    {
      label: "Заказчик/Получатель",
      key: "role",
      type: "dropdown" as const,
      options: [
        {
          key: "CUSTOMER",
          value: "Заказчик",
        },
        {
          key: "RECEIVER",
          value: "Получатель",
        },
      ].map((r) => ({ value: r.key, label: r.value })),
    },
    { label: "Номер телефона", key: "phone" },
    { label: "Адрес", key: "client_address" },
    { label: "Реквизиты", key: "account_details" },
  ];

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/admin/users/");
      setEmployeesData(response.data.results);
    } catch (err) {
      setError("Не удалось загрузить сотрудников.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch clients
  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/admin/users/get-customers/");
      setClientsData(response.data);
    } catch (err) {
      setError("Не удалось загрузить клиентов.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch roles
  const fetchRoles = async () => {
    try {
      const response = await axiosInstance.get("/constants/roles/");
      setRoles(response.data);
    } catch (err) {
      setError("Не удалось загрузить роли.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchClients();
    fetchRoles();
  }, []);

  const handleAddEmployee = async (newEmployee: any) => {
    try {
      await axiosInstance.post("/admin/users/", newEmployee);
      await fetchEmployees();
    } catch (err) {
      setError("Ошибка при добавлении сотрудника.");
      console.error(err);
    }
  };

  const handleEditEmployee = async (
    id: number,
    updatedEmployee: Partial<UserData>
  ) => {
    console.log(id, updatedEmployee);
    try {
      const filteredUpdates = Object.fromEntries(
        Object.entries(updatedEmployee).filter(
          ([_, value]) => value !== undefined
        )
      );

      if (Object.keys(filteredUpdates).length === 0) return;

      await axiosInstance.patch(
        `/admin/users/${id}/update-employee/`,
        filteredUpdates
      );
      await fetchEmployees();
    } catch (err) {
      setError("Ошибка при редактировании сотрудника.");
      console.error(err);
    }
  };

  const handleDeleteEmployee = async (ids: number[]) => {
    try {
      await axiosInstance.delete(`/admin/users/bulk-delete/`, {
        data: { ids },
      });
      await fetchEmployees();
    } catch (err) {
      setError("Ошибка при удалении сотрудника.");
      console.error(err);
    }
  };

  const handleAddClient = async (newClient: any) => {
    try {
      await axiosInstance.post("/admin/users/create-customer/", newClient);
      await fetchClients();
    } catch (err) {
      setError("Ошибка при добавлении клиента.");
      console.error(err);
    }
  };

  const handleEditClient = async (
    id: number,
    updatedClient: Partial<ClientData>
  ) => {
    console.log(updatedClient);
    try {
      const filteredUpdates = Object.fromEntries(
        Object.entries(updatedClient).filter(
          ([_, value]) => value !== undefined
        )
      );

      if (Object.keys(filteredUpdates).length === 0) return;

      await axiosInstance.patch(
        `/admin/users/${id}/update-customer/`,
        filteredUpdates
      );
      await fetchClients();
    } catch (err) {
      setError("Ошибка при редактировании клиента.");
      console.error(err);
    }
  };

  const handleDeleteClient = async (ids: number[]) => {
    try {
      await axiosInstance.delete(`/admin/users/bulk-delete/`, {
        data: { ids },
      });
      await fetchClients();
    } catch (err) {
      setError("Ошибка при удалении клиента.");
      console.error(err);
    }
  };

  const { status } = useSession();
  if (status === "loading" || loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="flex flex-col gap-10 mt-4 w-full">
      {error && <div className="text-red-500">{error}</div>}
      <Table
        text="Сотрудники"
        columns={employeesColumns}
        data={employeesData}
        width="full"
        onAddRow={handleAddEmployee}
        onEditRow={handleEditEmployee}
        onDeleteRows={(selectedRows) => {
          const ids = Array.from(selectedRows).map(
            (index) => employeesData[index].id
          );
          handleDeleteEmployee(ids);
        }}
      />
      <Table
        text="Клиенты"
        columns={clientsColumns}
        data={clientsData}
        width="full"
        onAddRow={handleAddClient}
        onEditRow={handleEditClient}
        onDeleteRows={(selectedRows) => {
          const ids = Array.from(selectedRows).map(
            (index) => clientsData[index].id
          );
          handleDeleteClient(ids);
        }}
      />
    </div>
  );
}
