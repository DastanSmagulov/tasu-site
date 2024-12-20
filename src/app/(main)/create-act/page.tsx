"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Customer from "../../../components/Customer";
import DeliveryCity from "./components/DeliveryCity";
import Reciever from "../../../components/Reciever";
import RecieverCity from "../../../components/RecieverCity";
import PackageCharacteristics from "./components/PackageCharacteristics";
import CargoPhoto from "./components/CargoPhoto";
import Insurance from "./components/Insurance";
import Signature from "@/app/(main)/create-act/components/Signature";
import Shipping from "./components/Shipping";
import ServicesTable from "./components/ServicesTable";
import PackingServicesTable from "./components/PackageServicesTable";
import TransportationTypes from "./components/TransportationType";
import { useEffect, useState } from "react";
import AdditionalServiceTable from "./components/AdditionalServiceTable";
import Expenses from "./components/Expenses";
import CargoDeliveryInfo from "./components/CargoDeliveryInfo";
import CargoForm from "./components/CargoFrom";
import { getToken } from "next-auth/jwt";

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

export default function Home() {
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

  const handleFormSubmit = () => {
    alert("Форма отправлена");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    alert("Данные сохранены");
  };

  return (
    <div className="flex gap-10 mt-4 w-full">
      <div className="flex flex-col w-1/2 space-y-4">
        <Customer />
        <DeliveryCity />
        <RecieverCity />
        <PackageCharacteristics />
        <CargoPhoto />
      </div>
      <div className="flex flex-col w-1/2 space-y-8">
        <Signature
          onSubmit={handleSignatureSubmit}
          onUpload={handlePhotoUpload}
        />
      </div>
    </div>
  );
}
