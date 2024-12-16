import React, { useState } from "react";
import { FaCloudUploadAlt, FaSlidersH } from "react-icons/fa";

const TabsNavigation = () => {
  const [activeTab, setActiveTab] = useState("Акт приема"); // default active tab

  const tabs = ["TTN", "CMP", "QR", "Заявка", "Excell", "Акт приема передачи"];

  return (
    <div className="flex gap-2 py-4 items-center rounded-lg my-4">
      <div className="bg-white flex items-center shadow-md rounded-lg">
        {tabs.map((tab, index) => (
          <React.Fragment key={index}>
            <button
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === tab
                  ? "bg-[#09BD3C] text-white font-bold py-3"
                  : "text-[#1D1B23] hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
            {index < tabs.length - 1 &&
              activeTab !== tab &&
              activeTab !== tabs[index + 1] && (
                <div className="w-[1px] h-[24px] bg-gray-300 mx-2" />
              )}
          </React.Fragment>
        ))}
      </div>
      <button className="flex items-center justify-center bg-white text-[#09BD3C] px-4 py-3 rounded-md text-sm font-semibold hover:bg-green-50 w-64 shadow-md">
        <FaCloudUploadAlt className="mr-2" size={22} />
        <span className="text-[#1D1B23] font-semibold">
          Отправить на хранение
        </span>
      </button>
      <button className="bg-[#09BD3C] text-white p-3 rounded-md flex items-center ml-auto">
        <FaSlidersH />
      </button>
      <select className="bg-white text-[#1D1B23] px-4 py-2 rounded-md border text-sm font-semibold ml-2 hover:bg-gray-100 h-11 appearance-none">
        <option value="new">Новые</option>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
      </select>
    </div>
  );
};

export default TabsNavigation;
