"use client";

import Customer from "../../../components/Customer";
import CustomerContacts from "../../../components/CustomerContacts";
import DeliveryCity from "../../../components/DeliveryCity";
import Reciever from "../../../components/Reciever";
import TransportInfo from "../../../components/TransportInfo";
import RecieverCity from "../../../components/RecieverCity";
import PackageCharacteristics from "../../../components/PackageCharacteristics";
import CargoPhoto from "../../../components/CargoPhoto";
import Insurance from "../../../components/Insurance";
import Signature from "@/components/Signature";

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
      <div className="flex flex-col w-1/2 space-y-4">
        <Customer />
        <Reciever />
        <DeliveryCity />
        <RecieverCity />
        <PackageCharacteristics />
      </div>
      <div className="flex flex-col w-1/2 space-y-4">
        <h2 className="ml-auto my-10 font-semibold text-lg">
          Номер акта № 754857345
        </h2>
        <CargoPhoto />
        <Insurance />
        <Signature
          onSubmit={handleSignatureSubmit}
          onUpload={handlePhotoUpload}
        />
      </div>
    </div>
  );
}
