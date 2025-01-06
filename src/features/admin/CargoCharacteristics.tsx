import React, { useState } from "react";
import Table from "../../components/Table";

type CargoItem = {
  checked: boolean;
  name: string;
  text1: string;
  text2?: string;
};

const CargoCharacteristics = () => {
  const columns = [
    { label: "Характер груза", key: "type" },
    { label: "???", key: "info1" },
    { label: "???", key: "info2" },
  ];

  const data = [
    { type: "Стекло", info1: "", info2: "Text" },
    { type: "Запчасть", info1: "", info2: "Text" },
    { type: "Вата", info1: "", info2: "Text" },
    { type: "Металл", info1: "", info2: "Text" },
    { type: "Картон", info1: "", info2: "Text" },
  ];

  const handleRowSelect = (selectedRows: any[]) => {
    console.log("Selected Rows:", selectedRows);
  };

  return (
    <div className="bg-gray-50 min-h-screen w-full">
      <Table
        text="Характер груза"
        columns={columns}
        data={data}
        onRowSelect={handleRowSelect}
        width="1/2"
      />
    </div>
  );
};

export default CargoCharacteristics;
