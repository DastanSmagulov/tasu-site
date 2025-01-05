import React, { useState } from "react";
import Table from "./Table";

type PartnerCargoItem = {
  checked: boolean;
  partnerName: string;
  bin: string;
  productOrService: string;
};

const PartnerCargoCharacteristics = () => {
  const columns = [
    { label: "Партнеры", key: "type" },
    { label: "БИН", key: "info1" },
    { label: "Товар / Услуга", key: "info2" },
  ];

  const data = [
    { type: "Name", info1: "", info2: "Text" },
    { type: "Name", info1: "", info2: "Text" },
    { type: "Name", info1: "", info2: "Text" },
    { type: "Name", info1: "", info2: "Text" },
    { type: "Name", info1: "", info2: "Text" },
  ];

  const handleRowSelect = (selectedRows: any[]) => {
    console.log("Selected Rows:", selectedRows);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Table
        text="Характер груза"
        columns={columns}
        data={data}
        onRowSelect={handleRowSelect}
        width="1/2"
      />{" "}
    </div>
  );
};

export default PartnerCargoCharacteristics;
