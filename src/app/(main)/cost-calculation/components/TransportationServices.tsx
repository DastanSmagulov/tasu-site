import Image from "next/image";
import React, { useState } from "react";
import transportationServicesImage from "../../../../../public/images/transportationServices.png";

const TransportationServices: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-[#1D1B23]">
        Услуги перевозки
      </h2>
      <Image
        src={transportationServicesImage}
        alt="transportationServices"
        width={650}
        height={180}
      />
    </div>
  );
};

export default TransportationServices;
