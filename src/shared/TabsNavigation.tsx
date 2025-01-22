import React, { useState } from "react";
import { FaDownload, FaQrcode } from "react-icons/fa";

interface TabsNavigationProps {
  role: string;
}

const TabsNavigation: React.FC<TabsNavigationProps> = ({ role }) => {
  const [activeTab, setActiveTab] = useState("Акт приема передачи");

  let tabs = [
    { name: "CMP", icon: <FaDownload /> },
    { name: "QR", icon: <FaQrcode /> },
    { name: "Заявка", icon: <FaDownload /> },
    { name: "Excell", icon: <FaQrcode /> },
    { name: "Акт приема передачи" },
  ];

  if (role === "transceiver" || role === "accountant") {
    tabs = [{ name: "Акт приема передачи" }];
  }

  return (
    <div className="flex flex-wrap gap-4 py-4 items-center">
      {tabs.map((tab, index) => (
        <button
          key={index}
          onClick={() => setActiveTab(tab.name)}
          className={`flex items-center gap-2 text-sm font-medium px-2 ${
            activeTab === tab.name
              ? "text-black font-semibold rounded-lg px-4 py-2 shadow"
              : "text-[#1D1B23] hover:text-gray-700 bg-transparent hover:bg-gray-100 p-2 rounded-md"
          }`}
        >
          {tab.icon && <span>{tab.icon}</span>}
          {tab.name}
        </button>
      ))}
    </div>
  );
};

export default TabsNavigation;
