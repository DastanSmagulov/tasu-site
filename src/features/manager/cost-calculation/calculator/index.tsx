"use client";

import DeliveryCity from "@/components/DeliveryCity";
import Insurance from "@/components/Insurance";
import PackagingService from "@/components/PackagingService";
import WarehouseServices from "@/components/WarehouseServices";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import CalculationDescription from "@/components/CalculationDescription";
import ServicesTable from "@/components/ServicesTable";
import AdditionalServiceTable from "@/components/AdditionalServiceTable";
import TableTotal from "@/components/TableTotal";

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

export default function CalculatorPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // useEffect(() => {
  //   if (status === "unauthenticated") {
  //     router.push("/login");
  //   }
  // }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  // if (!session) {
  //   return null;
  // }
  const handleSignatureSubmit = (signatureDataUrl: string) => {
    console.log("Signature submitted:", signatureDataUrl);
  };

  const handlePhotoUpload = (file: File) => {
    console.log("Photo uploaded:", file);
  };
  return (
    <>
      <div className="flex gap-4 mt-4 w-full">
        <div className="flex flex-col w-1/2 space-y-4">
          <CalculationDescription />
          <DeliveryCity />
          <Insurance />
          <TableTotal
            title="Услуги Перевозки"
            columns={[
              { label: "Стоимость перевозки", key: "service" },
              { label: "Доставка в другом городе", key: "quantity" },
              { label: "Забор груза с города нахождения", key: "cost" },
              { label: "Разг-погр работы", key: "work" },
            ]}
            initialData={[
              {
                service: "2342342",
                quantity: "21343241",
                cost: "1000",
                work: "4000",
              },
              {
                service: "2342342",
                quantity: "21343241",
                cost: "1000",
                work: "4000",
              },
              {
                service: "2342342",
                quantity: "21343241",
                cost: "1000",
                work: "4000",
              },
            ]}
          />{" "}
          <TableTotal
            title="Услуги Упаковки"
            columns={[
              { label: "Наименование", key: "service" },
              { label: "Кол-во", key: "quantity" },
              { label: "Тариф", key: "cost" },
              { label: "Стоимость", key: "work" },
            ]}
            initialData={[
              {
                service: "Скотч",
                quantity: "1",
                cost: "Большой",
                work: "4000",
              },
              {
                service: "Скотч",
                quantity: "1",
                cost: "Большой",
                work: "4000",
              },
              {
                service: "Скотч",
                quantity: "1",
                cost: "Большой",
                work: "4000",
              },
              {
                service: "Скотч",
                quantity: "1",
                cost: "Большой",
                work: "4000",
              },
              {
                service: "Скотч",
                quantity: "1",
                cost: "Большой",
                work: "4000",
              },
            ]}
          />{" "}
        </div>
        <div className="flex flex-col w-1/2 space-y-4">
          <WarehouseServices />
          <TableTotal
            title="Доп услуги"
            columns={[
              { label: "Наименование", key: "service" },
              { label: "Цена", key: "cost" },
            ]}
            initialData={[
              {
                service: "Скотч",
                cost: "500",
              },
              {
                service: "Скотч",
                cost: "500",
              },
              {
                service: "Скотч",
                cost: "500",
              },
              {
                service: "Скотч",
                cost: "500",
              },
              {
                service: "Скотч",
                cost: "500",
              },
            ]}
          />{" "}
        </div>
      </div>
    </>
  );
}
