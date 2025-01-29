"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Table from "@/components/Table";
import { axiosInstance } from "@/helper/utils";
import "../../../styles/globals.css";

// Define the data type for users and roles
type UserData = {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  role: string;
};

type ClientData = {
  id: number;
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
    { label: "Роль", key: "role" },
  ];

  const clientsColumns = [
    { label: "ФИО", key: "full_name" },
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
      setError("Failed to fetch employees. Please try again.");
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
      setError("Failed to fetch clients. Please try again.");
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
      setError("Failed to fetch roles. Please try again.");
      console.error(err);
    }
  };

  // Add employee
  const handleAddEmployee = async (newEmployee: UserData) => {
    try {
      await axiosInstance.post("/admin/users/", newEmployee);
      await fetchEmployees();
    } catch (err) {
      setError("Failed to add employee. Please try again.");
      console.error(err);
    }
  };

  // Add client
  const handleAddClient = async (newClient: ClientData) => {
    try {
      await axiosInstance.post("/admin/users/create-customer/", newClient);
      await fetchClients();
    } catch (err) {
      setError("Failed to add client. Please try again.");
      console.error(err);
    }
  };

  // Edit client
  const handleEditClient = async (id: number, updatedClient: ClientData) => {
    try {
      await axiosInstance.patch(`/admin/users/${id}/`, updatedClient);
      await fetchClients();
    } catch (err) {
      setError("Failed to edit client. Please try again.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchClients();
    fetchRoles();
  }, []);

  const { data: session, status } = useSession();

  if (status === "loading" || loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex flex-col gap-10 mt-4 w-full">
        {error && <div className="text-red-500">{error}</div>}
        <Table
          text="Сотрудники"
          columns={employeesColumns}
          data={employeesData}
          width="full"
          onAddRow={(newEmployee: UserData) => (
            <div>
              <input
                type="text"
                placeholder="Full Name"
                className="border p-2 rounded"
                onChange={(e) => (newEmployee.full_name = e.target.value)}
              />
              <input
                type="email"
                placeholder="Email"
                className="border p-2 rounded"
                onChange={(e) => (newEmployee.email = e.target.value)}
              />
              <input
                type="text"
                placeholder="Phone"
                className="border p-2 rounded"
                onChange={(e) => (newEmployee.phone = e.target.value)}
              />
              <select
                className="border p-2 rounded"
                onChange={(e) => (newEmployee.role = e.target.value)}
              >
                <option value="">Select Role</option>
                {roles.map((role) => (
                  <option key={role.key} value={role.key}>
                    {role.value}
                  </option>
                ))}
              </select>
              <button
                className="bg-blue-500 text-white p-2 rounded"
                onClick={() => handleAddEmployee(newEmployee)}
              >
                Add Employee
              </button>
            </div>
          )}
        />
        <Table
          text="Клиенты"
          columns={clientsColumns}
          data={clientsData}
          width="full"
          onAddRow={(newClient: ClientData) => (
            <div>
              <input
                type="text"
                placeholder="Full Name"
                className="border p-2 rounded"
                onChange={(e) => (newClient.full_name = e.target.value)}
              />
              <input
                type="text"
                placeholder="Phone"
                className="border p-2 rounded"
                onChange={(e) => (newClient.phone = e.target.value)}
              />
              <input
                type="text"
                placeholder="Address"
                className="border p-2 rounded"
                onChange={(e) => (newClient.client_address = e.target.value)}
              />
              <input
                type="text"
                placeholder="Requisites"
                className="border p-2 rounded"
                onChange={(e) => (newClient.account_details = e.target.value)}
              />
              <button
                className="bg-blue-500 text-white p-2 rounded"
                onClick={() => handleAddClient(newClient)}
              >
                Add Client
              </button>
            </div>
          )}
          // onEditRow={(id: number, updatedClient: ClientData) =>
          //   handleEditClient(id, updatedClient)
          // }
        />
      </div>
    </>
  );
}
