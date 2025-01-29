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
  const [newEmployee, setNewEmployee] = useState<UserData>({
    id: 0,
    full_name: "",
    email: "",
    phone: "",
    role: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<UserData>>({});

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
  const handleAddEmployee = async () => {
    const errors: Partial<UserData> = {};
    if (!newEmployee.full_name) errors.full_name = "Full Name is required";
    if (!newEmployee.email) errors.email = "Email is required";
    if (!newEmployee.phone) errors.phone = "Phone is required";
    if (!newEmployee.role) errors.role = "Role is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      await axiosInstance.post("/admin/users/", newEmployee);
      await fetchEmployees();
      setNewEmployee({ id: 0, full_name: "", email: "", phone: "", role: "" });
      setFormErrors({});
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
        />
        <div className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Full Name"
            className="border p-2 rounded"
            value={newEmployee.full_name}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, full_name: e.target.value })
            }
          />
          {formErrors.full_name && (
            <span className="text-red-500">{formErrors.full_name}</span>
          )}
          <input
            type="email"
            placeholder="Email"
            className="border p-2 rounded"
            value={newEmployee.email}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, email: e.target.value })
            }
          />
          {formErrors.email && (
            <span className="text-red-500">{formErrors.email}</span>
          )}
          <input
            type="text"
            placeholder="Phone"
            className="border p-2 rounded"
            value={newEmployee.phone}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, phone: e.target.value })
            }
          />
          {formErrors.phone && (
            <span className="text-red-500">{formErrors.phone}</span>
          )}
          <select
            className="border p-2 rounded"
            value={newEmployee.role}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, role: e.target.value })
            }
          >
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role.key} value={role.key}>
                {role.value}
              </option>
            ))}
          </select>
          {formErrors.role && (
            <span className="text-red-500">{formErrors.role}</span>
          )}
          <button
            className="bg-blue-500 text-white p-2 rounded"
            onClick={handleAddEmployee}
          >
            Add Employee
          </button>
        </div>
        <Table
          text="Клиенты"
          columns={clientsColumns}
          data={clientsData}
          width="full"
        />
      </div>
    </>
  );
}
