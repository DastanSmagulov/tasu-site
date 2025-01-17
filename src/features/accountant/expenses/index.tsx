// src/App.tsx
"use client";
import React from "react";
import Table from "@/components/Table";
import Checkbox from "@/components/ui/CheckBox";

interface Item {
  name: string;
  quantity: number;
  price: number;
  selected: boolean;
}

const ExpensesPage: React.FC = () => {
  const columnsPartner = [
    { label: "Наименование", key: "type" },
    { label: "Шт.", key: "info1" },
    { label: "Цена", key: "info2" },
    { label: "Стоимость", key: "info3" },
  ];

  const dataPartners = [
    { type: "Перевозка", info1: "2", info2: "2500", info3: "5000" },
    { type: "Перевозка", info1: "2", info2: "2500", info3: "5000" },
    { type: "Перевозка", info1: "2", info2: "2500", info3: "5000" },
  ];

  const columnsCarrier = [
    { label: "Наименование", key: "type" },
    { label: "Шт.", key: "info1" },
    { label: "Цена", key: "info2" },
    { label: "Стоимость", key: "info3" },
  ];

  const dataCarrier = [
    { type: "Перевозка", info1: "2", info2: "2500", info3: "5000" },
    { type: "Перевозка", info1: "2", info2: "2500", info3: "5000" },
    { type: "Перевозка", info1: "2", info2: "2500", info3: "5000" },
  ];

  const columnsCustomer = [
    { label: "Наименование", key: "type" },
    { label: "Шт.", key: "info1" },
    { label: "Цена", key: "info2" },
    { label: "Стоимость", key: "info3" },
  ];

  const dataCustomer = [
    { type: "Перевозка", info1: "2", info2: "2500", info3: "5000" },
    { type: "Перевозка", info1: "2", info2: "2500", info3: "5000" },
    { type: "Перевозка", info1: "2", info2: "2500", info3: "5000" },
  ];

  const handleRowSelect = (selectedRows: any[]) => {
    console.log("Selected Rows:", selectedRows);
  };

  return (
    <div className="flex flex-col bg-gray-50 pb-10">
      <h1>Наименование</h1>
      <div className="flex gap-2 my-4">
        <Checkbox id="2" />
        <p>Есть расходы?</p>
      </div>
      <div className="flex flex-col gap-10">
        <Table
          width="1/2"
          text="Расход Партнерами"
          columns={columnsPartner}
          data={dataPartners}
          onRowSelect={handleRowSelect}
        />
        <Table
          width="1/2"
          text="Расход Перевозчика"
          columns={columnsCarrier}
          data={dataCarrier}
          onRowSelect={handleRowSelect}
        />
        <Table
          width="1/2"
          text="Расход Заказчика"
          columns={columnsCustomer}
          data={dataCustomer}
          onRowSelect={handleRowSelect}
        />
      </div>
      <div className="flex flex-wrap justify-end gap-4 mt-8 text-[#000000]">
        {/* Create Card Button */}
        <button className="font-semibold border border-gray-500 px-4 py-2 bg-white hover:bg-gray-100 text-black rounded-lg">
          Создать карточку
        </button>

        {/* Send Button */}
        <button
          className="font-semibold px-4 py-2 rounded-lg"
        >
          Выслать
        </button>
      </div>
    </div>
  );
};

export default ExpensesPage;
