"use client";
import Table from "@/components/Table";

const Page = () => {
  const columnsCityFrom = [
    { label: "No", key: "type" },
    { label: "Наименование", key: "info1" },
  ];

  const columnsCityTo = [
    { label: "No", key: "type" },
    { label: "Наименование", key: "info1" },
  ];

  const columnsCars = [
    {
      label: "Госномер",
      key: "type",
    },
    { label: "Бренд", key: "info1" },
    { label: "Цвет", key: "info2" },
    { label: "Консоль  Отдельно", key: "info3" },
  ];

  const columnsPlanes = [
    {
      label: "Номер рейса",
      key: "type",
    },
    { label: "Авиа компания", key: "info1" },
  ];

  const columnsTrains = [
    {
      label: "Номер поезда",
      key: "type",
    },
    { label: "Маршрут поезда", key: "info1" },
    { label: "Жд компания", key: "info2" },
  ];

  const dataCars = [
    { type: "001aaa", info1: "", info2: "", info3: "", info4: "" },
    { type: "001aaa", info1: "", info2: "", info3: "", info4: "" },
    { type: "001aaa", info1: "", info2: "", info3: "", info4: "" },
    { type: "001aaa", info1: "", info2: "", info3: "", info4: "" },
    { type: "001aaa", info1: "", info2: "", info3: "", info4: "" },
  ];

  const dataCityFrom = [
    { type: "1.", info1: "Астана" },
    { type: "1.", info1: "Астана" },
    { type: "1.", info1: "Астана" },
    { type: "1.", info1: "Астана" },
  ];

  const dataCityTo = [
    { type: "1.", info1: "Астана" },
    { type: "1.", info1: "Астана" },
    { type: "1.", info1: "Астана" },
    { type: "1.", info1: "Астана" },
  ];

  const dataPlanes = [
    { type: "Number", info1: "Text" },
    { type: "Number", info1: "Text" },
    { type: "Number", info1: "Text" },
    { type: "Number", info1: "Text" },
  ];

  const dataTrains = [
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
    <div className="flex flex-col gap-10">
      <div className="flex gap-10">
        <Table
          text="Города отправление"
          columns={columnsCityFrom}
          data={dataCityFrom}
          onRowSelect={handleRowSelect}
          width="3/12"
        />
        <Table
          text="Города получения"
          columns={columnsCityTo}
          data={dataCityTo}
          onRowSelect={handleRowSelect}
          width="3/12"
        />
      </div>
      <Table
        text="Машина"
        columns={columnsCars}
        data={dataCars}
        onRowSelect={handleRowSelect}
        width="1/2"
      />
      <Table
        text="Самолет"
        columns={columnsPlanes}
        data={dataPlanes}
        onRowSelect={handleRowSelect}
        width="1/2"
      />
      <Table
        text="Поезд"
        columns={columnsTrains}
        data={dataTrains}
        onRowSelect={handleRowSelect}
        width="1/2"
      />
    </div>
  );
};

export default Page;
