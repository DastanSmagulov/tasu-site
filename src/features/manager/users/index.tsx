"use client";

import { useSession } from "next-auth/react";
import Table from "@/components/Table";

("./globals.css");

// Define the data type
type DocumentData = {
  id: string;
  date: string;
  status: string;
  customer: string;
  place: string;
  weight: string;
  volume: string;
  statusColor: string;
  view: string;
  amount: string;
};

export default function UsersPage() {
  const employeesColumns = [
    { label: "ФИО", key: "type" },
    { label: "Почта", key: "info1" },
    { label: "Номер телефона", key: "info2" },
    { label: "Роль", key: "info3" },
    { label: "", key: "info4" },
  ];

  const employeesData = [
    {
      type: "Смагулов Дастан Болатович",
      info1: "smagulovdastan07@gmail.com",
      info2: "+87029134650",
      info3: "Менеджер",
      info4: "...",
    },
    {
      type: "Смагулов Дастан Болатович",
      info1: "smagulovdastan07@gmail.com",
      info2: "+87029134650",
      info3: "Менеджер",
      info4: "...",
    },
    {
      type: "Смагулов Дастан Болатович",
      info1: "smagulovdastan07@gmail.com",
      info2: "+87029134650",
      info3: "Менеджер",
      info4: "...",
    },
    {
      type: "Смагулов Дастан Болатович",
      info1: "smagulovdastan07@gmail.com",
      info2: "+87029134650",
      info3: "Менеджер",
      info4: "...",
    },
    {
      type: "Смагулов Дастан Болатович",
      info1: "smagulovdastan07@gmail.com",
      info2: "+87029134650",
      info3: "Менеджер",
      info4: "...",
    },
  ];

  const clientsColumns = [
    { label: "ФИО", key: "type" },
    { label: "Отправитель  Получатель", key: "info1" },
    { label: "Номер телефона", key: "info2" },
    { label: "Адресс", key: "info3" },
    { label: "Реквизиты", key: "info4" },
    { label: "", key: "info5" },
  ];

  const clientsData = [
    {
      type: "Смагулов Дастан Болатович",
      info1: "Отправитель",
      info2: "+87029134650",
      info3: "Г Алматы ул Абая, д 123",
      info4: "Number_123",
      info5: "...",
    },
    {
      type: "Смагулов Дастан Болатович",
      info1: "Отправитель",
      info2: "+87029134650",
      info3: "Г Алматы ул Абая, д 123",
      info4: "Number_123",
      info5: "...",
    },
    {
      type: "Смагулов Дастан Болатович",
      info1: "Отправитель",
      info2: "+87029134650",
      info3: "Г Алматы ул Абая, д 123",
      info4: "Number_123",
      info5: "...",
    },
    {
      type: "Смагулов Дастан Болатович",
      info1: "Отправитель",
      info2: "+87029134650",
      info3: "Г Алматы ул Абая, д 123",
      info4: "Number_123",
      info5: "...",
    },
    {
      type: "Смагулов Дастан Болатович",
      info1: "Отправитель",
      info2: "+87029134650",
      info3: "Г Алматы ул Абая, д 123",
      info4: "Number_123",
      info5: "...",
    },
  ];

  const customersColumns = [
    { label: "ФИО", key: "type" },
    { label: "Отправитель  Получатель", key: "info1" },
    { label: "Номер телефона", key: "info2" },
    { label: "Реквизиты", key: "info4" },
    { label: "", key: "info5" },
  ];

  const customersData = [
    {
      type: "Смагулов Дастан Болатович",
      info1: "Отправитель",
      info2: "+87029134650",
      info4: "Number_123",
      info5: "...",
    },
    {
      type: "Смагулов Дастан Болатович",
      info1: "Отправитель",
      info2: "+87029134650",
      info4: "Number_123",
      info5: "...",
    },
    {
      type: "Смагулов Дастан Болатович",
      info1: "Отправитель",
      info2: "+87029134650",
      info4: "Number_123",
      info5: "...",
    },
    {
      type: "Смагулов Дастан Болатович",
      info1: "Отправитель",
      info2: "+87029134650",
      info4: "Number_123",
      info5: "...",
    },
  ];

  const handleRowSelect = (selectedRows: any[]) => {
    console.log("Selected Rows:", selectedRows);
  };

  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }
  return (
    <>
      <div className="flex flex-col gap-10 mt-4 w-full">
        <Table
          width="1/2"
          text="Сотрудники"
          columns={employeesColumns}
          data={employeesData}
          onRowSelect={handleRowSelect}
        />
        <Table
          width="1/2"
          text="База клиентов"
          columns={clientsColumns}
          data={clientsData}
          onRowSelect={handleRowSelect}
        />
        <Table
          width="1/2"
          text="Заказчики"
          columns={customersColumns}
          data={customersData}
          onRowSelect={handleRowSelect}
        />
      </div>
    </>
  );
}
