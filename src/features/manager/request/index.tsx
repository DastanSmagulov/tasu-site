"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import Customer from "@/components/Customer";
import CreateSuccessAct from "@/components/modals/CreateSuccessAct";
import Forwarder from "../Forwarder";
import CargoData from "../CargoData";
import RouteConditions from "../RouteConditions";
import ServiceCosts from "../ServiceCosts";
import Signature from "@/components/Signature";
import ForwarderSignature from "../ForwarderSignature";
import TermsAndConditions from "../TermsAndConditions";

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

export default function RequestPage() {
  const { data: session, status } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const actStatus: string = "готов к отправке";
  const role: string = "manager";

  if (status === "loading") {
    return <div>Loading...</div>;
  }

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

  const handleSignatureSubmit = (signatureDataUrl: string) => {
    console.log("Signature");
  };

  const handleSignatureUpload = (file: File) => {
    console.log("Signature");
  };

  return (
    <>
      <div className="flex gap-4 mt-4 w-full">
        <div className="flex flex-col w-1/2 space-y-4">
          <Customer />
          <CargoData />
          <RouteConditions />
          <ServiceCosts />
        </div>
        <div className="flex flex-col w-1/2 space-y-4">
          <Forwarder />
          {/* Buttons */}
        </div>
      </div>
      <TermsAndConditions />
      <div className="flex mt-4 justify-between">
        <Signature
          onSubmit={handleSignatureSubmit}
          onUpload={handleSignatureUpload}
        />
        <ForwarderSignature
          onSubmit={handleSignatureSubmit}
          onUpload={handleSignatureUpload}
        />
      </div>
      {isModalOpen && <CreateSuccessAct />}
    </>
  );
}
