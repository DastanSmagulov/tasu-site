"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Signature from "@/app/(main)/create-act/components/Signature";
import { useEffect, useState } from "react";
import { getToken } from "next-auth/jwt";
import Customer from "@/components/Customer";
import DeliveryCity from "@/components/RecieverCity";
import PackageCharacteristics from "../../create-act/components/PackageCharacteristics";
import CargoPhoto from "../../create-act/components/CargoPhoto";

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

export default function ActPage() {
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
        {/* <RecieverCity /> */}
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
