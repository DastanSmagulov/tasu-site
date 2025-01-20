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
    console.log("Signature submitted:", signatureDataUrl);
  };

  const handleSignatureUpload = (file: File) => {
    console.log("Signature uploaded:", file);
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-4 mt-4 w-full">
        {/* Left Section */}
        <div className="flex flex-col lg:w-1/2 space-y-4">
          <Customer />
          <CargoData />
          <RouteConditions />
          <ServiceCosts />
        </div>

        {/* Right Section */}
        <div className="flex flex-col lg:w-1/2 space-y-4">
          <Forwarder />
        </div>
      </div>

      <TermsAndConditions />

      {/* Signature Section */}
      <div className="flex flex-col md:flex-row mt-4 justify-between gap-4">
        <Signature
          onSubmit={handleSignatureSubmit}
          onUpload={handleSignatureUpload}
        />
        <ForwarderSignature
          onSubmit={handleSignatureSubmit}
          onUpload={handleSignatureUpload}
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
        <button
          onClick={handlePrint}
          className="w-full sm:w-auto font-semibold border border-gray-500 px-4 py-2 bg-white hover:bg-gray-100 text-black text-sm rounded-lg"
        >
          Печать
        </button>
        <button
          onClick={handleFormSubmit}
          className="w-full sm:w-auto font-semibold px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black text-sm rounded-lg"
        >
          Отправить
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && <CreateSuccessAct />}
    </>
  );
}
