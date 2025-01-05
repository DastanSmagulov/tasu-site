"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Customer from "@/components/Customer";
import PackageCharacteristics from "@/components/PackageCharacteristics";
import CargoPhoto from "@/components/CargoPhoto";
import { useState } from "react";
import InformationPackage from "@/components/PackageInformation";
import Shipping from "@/components/Shipping";
import CreateSuccessAct from "@/components/modals/CreateSuccessAct";

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

export default function CreateActPage() {
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

  return (
    <>
      <div className="flex gap-6 mt-4 w-full">
        <div className="flex flex-col w-1/2 space-y-4">
          <Customer />
          <PackageCharacteristics />
          <CargoPhoto />
        </div>
        <div className="flex flex-col w-1/2 space-y-4">
          <Shipping />
          <InformationPackage />
          {/* Buttons */}
          <div className="flex gap-4 text-[#000000]">
            <button
              onClick={handleSend}
              className="font-semibold border border-gray-500 px-4 py-2 bg-white hover:bg-gray-100 text-black rounded-lg"
            >
              Отправить
            </button>
          </div>
        </div>
      </div>
      {isModalOpen && <CreateSuccessAct />}
    </>
  );
}
