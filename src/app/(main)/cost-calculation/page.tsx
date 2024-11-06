"use client";

import Customer from "../../../components/Customer";
import DeliveryCity from "../create-act/components/DeliveryCity";
import Reciever from "../../../components/Reciever";
import Insurance from "./components/Insurance";
import TransportationServices from "./components/TransportationServices";
import PackagingService from "./components/PackagingService";
import WarehouseServices from "./components/WarehouseServices";

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
  const handleSignatureSubmit = (signatureDataUrl: string) => {
    console.log("Signature submitted:", signatureDataUrl);
  };

  const handlePhotoUpload = (file: File) => {
    console.log("Photo uploaded:", file);
  };
  return (
    <div className="flex gap-10 mt-4 w-full">
      <div className="space-y-4">
        <Customer />
        <Reciever />
        <DeliveryCity />
        <Insurance />
        <TransportationServices />
        <PackagingService />
        <WarehouseServices />
      </div>
    </div>
  );
}
