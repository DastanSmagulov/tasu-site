import { ActDataProps } from "@/helper/types";
import React, { useState, useEffect } from "react";

const AccountingAvr: React.FC<ActDataProps> = ({ data, setData }) => {
  // Initialize local state from parent data (if available)
  const [file, setFile] = useState<File | string>(data?.accounting_avr || "");

  // Synchronize local state if parent's data changes
  useEffect(() => {
    if (data?.accounting_avr) {
      setFile(data.accounting_avr);
    }
  }, [data?.accounting_avr]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList && fileList[0]) {
      const newFile = fileList[0];
      setFile(newFile);
      // Update parent's data for AVR
      setData((prev: any) => ({
        ...prev,
        accounting_avr: newFile,
      }));
    }
  };

  const handleRemoveFile = () => {
    setFile("");
    // Update parent's data for AVR
    setData((prev: any) => ({
      ...prev,
      accounting_avr: "",
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-[#1D1B23]">
        Бухгалтерия AVR
      </h2>

      {/* Drag-and-Drop / Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-4 text-center">
        <p className="text-gray-500 mb-2">Перетащите сюда</p>
        <p className="text-gray-500 mb-4">или</p>
        <label className="bg-[#FDE107] hover:bg-[#efdc4b] px-4 py-2 rounded-md cursor-pointer">
          Загрузите AVR
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Display Uploaded File */}
      {file && (
        <div className="relative bg-gray-100 h-32 rounded-md flex items-center justify-center">
          {typeof file !== "string" && file.type.startsWith("image/") ? (
            <img
              src={URL.createObjectURL(file)}
              alt="AVR File"
              className="object-cover h-full w-full rounded-md"
            />
          ) : typeof file !== "string" && file.type === "application/pdf" ? (
            <div className="flex flex-col items-center justify-center p-2">
              <svg
                className="w-12 h-12 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 14l9-5-9-5-9 5 9 5z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 14l6.16-3.422a12.083 12.083 0 01.84 6.034L12 20l-6-3 6-3z"
                />
              </svg>
              <p className="text-xs text-gray-500 truncate w-full text-center">
                {file.name}
              </p>
            </div>
          ) : typeof file === "string" ? (
            file.endsWith(".pdf") ? (
              <div className="flex flex-col items-center justify-center p-2">
                <svg
                  className="w-12 h-12 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14l9-5-9-5-9 5 9 5z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14l6.16-3.422a12.083 12.083 0 01.84 6.034L12 20l-6-3 6-3z"
                  />
                </svg>
                <p className="text-xs text-gray-500 truncate w-full text-center">
                  {file.split("/").pop()}
                </p>
              </div>
            ) : (
              <img
                src={file}
                alt="AVR File"
                className="object-cover h-full w-full rounded-md"
              />
            )
          ) : (
            <p className="text-xs text-gray-500">Неподдерживаемый формат</p>
          )}

          <button
            onClick={handleRemoveFile}
            className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1"
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountingAvr;
