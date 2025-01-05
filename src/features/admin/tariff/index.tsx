"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import InformationPackage from "@/components/PackageInformation";
import CityTariffsTable from "@/components/CityTariff";
import Table from "@/components/Table";
import Insurance from "@/components/Insurance";
import InterCity from "@/components/InterCity";

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

export default function TariffPage() {
  const { data: session, status } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  const handleSignatureSubmit = (signatureDataUrl: string) => {
    console.log("Signature submitted:", signatureDataUrl);
  };

  const handlePhotoUpload = (file: File) => {
    console.log("Photo uploaded:", file);
  };

  const handleFormSubmit = () => {
    alert("Форма отправлена");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSend = () => {
    setIsModalOpen(true);
  };

  const cityColumns = [
    { label: "Город отправление", key: "type" },
    { label: "Город получение", key: "info1" },
    { label: "Тариф", key: "info2" },
  ];

  const cityData = [
    { type: "Астана", info1: "Алматы", info2: "5000" },
    { type: "Астана", info1: "Оскемен", info2: "8000" },
    { type: "Астана", info1: "Шымкент", info2: "3000" },
  ];

  const handleRowSelect = (selectedRows: any[]) => {
    console.log("Selected Rows:", selectedRows);
  };

  return (
    <>
      <div className="flex mt-4 w-full">
        <div className="flex flex-col gap-10 mb-10">
          <InterCity />
          <Table
            text=""
            columns={cityColumns}
            data={cityData}
            onRowSelect={handleRowSelect}
            width="full"
          />
          <Insurance />
          <Table
            text="Услуги перевозки"
            columns={[
              { label: "Наименование", key: "service" },
              { label: "Шт.", key: "quantity" },
              { label: "Вес", key: "weight" },
              { label: "Цена", key: "price" },
            ]}
            data={[
              {
                service: "Разг-погр работы",
                quantity: "1",
                weight: "",
                price: "5000",
              },
              {
                service: "Забор с места",
                quantity: "2",
                weight: "",
                price: "5000",
              },
              {
                service: "Перевозка пленка",
                quantity: "1",
                weight: "",
                price: "5000",
              },
            ]}
            onRowSelect={handleRowSelect}
            width="full"
          />
          <Table
            text="Услуги перевозки"
            columns={[
              { label: "Наименование", key: "service" },
              { label: "Вес", key: "weight" },
              { label: "Цена", key: "price" },
            ]}
            data={[
              {
                service: "Разг-погр работы",
                weight: "",
                price: "5000",
              },
              {
                service: "Забор с места",
                weight: "",
                price: "5000",
              },
              {
                service: "Перевозка пленка",
                weight: "",
                price: "5000",
              },
            ]}
            onRowSelect={handleRowSelect}
            width="full"
          />
          <Table
            text="Складские услуги"
            columns={[
              { label: "Наименование", key: "service" },
              { label: "Тип", key: "type" },
              { label: "Цена", key: "price" },
            ]}
            data={[
              {
                service: "Хранение",
                type: "по месту",
                price: "5000",
              },
              {
                service: "Р/П",
                type: "россыль",
                price: "8000",
              },
              {
                service: "Хранение",
                type: "по месту",
                price: "5000",
              },
            ]}
            onRowSelect={handleRowSelect}
            width="full"
          />
          <Table
            text="Услуга упаковки"
            columns={[
              { label: "Наименование", key: "service" },
              { label: "Тариф Маленький", key: "tarif_small" },
              { label: "Тариф Средний", key: "tarif_medium" },
              { label: "Цена", key: "price" },
            ]}
            data={[
              {
                service: "Разг-погр работы",
                tarif_small: "",
                tarif_medium: "",
                price: "5000",
              },
              {
                service: "Забор с места",
                tarif_small: "2",
                tarif_medium: "",
                price: "5000",
              },
              {
                service: "Перевозка с пленка",
                tarif_small: "1",
                tarif_medium: "",
                price: "5000",
              },
              {
                service: "Разг-погр работы",
                tarif_small: "",
                tarif_medium: "",
                price: "5000",
              },
            ]}
            onRowSelect={handleRowSelect}
            width="full"
          />
        </div>
      </div>
    </>
  );
}
