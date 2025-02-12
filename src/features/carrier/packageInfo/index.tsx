"use client";
import React, { useState } from "react";
import "../../../styles/globals.css";
import Logo from "@/components/ui/Logo";
import InformationPackage from "@/components/PackageInformation";

const PackageInfo: React.FC = () => {
  const [brushColor, setBrushColor] = useState<string>("#000000");
  const [brushSize, setBrushSize] = useState<number>(2);
  const [data, setData] = useState(null);

  return (
    <div className="p-8 bg-gray-50 flex flex-col items-center">
      {/* Container */}
      <Logo width={125} height={125} />

      {/* <InformationPackage title="О Получении" data={data} setData={setData} /> */}

      {/* Final Submit Button */}
      <button className="py-3 px-6 rounded-lg w-full max-w-lg mt-6">
        Товар передан Клиенту
      </button>
    </div>
  );
};

export default PackageInfo;
