"use client";

import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import Logo from "@/components/ui/Logo";
import InformationPackage from "./PackageInformation";
import { axiosInstance } from "@/helper/utils";
import CreateSuccessAct from "@/components/modals/CreateSuccessAct"; // adjust the import path as needed

interface CarrierPageProps {
  id: string | string[];
}

// Helper functions
function normalizeValue(val: any): any {
  if (typeof val === "number" && isNaN(val)) return "";
  if (val === null || val === undefined) return "";
  return val;
}

function isEqualNormalized(val1: any, val2: any): boolean {
  if (
    typeof val1 === "number" &&
    isNaN(val1) &&
    typeof val2 === "number" &&
    isNaN(val2)
  ) {
    return true;
  }
  if (
    typeof val1 === "object" &&
    val1 !== null &&
    typeof val2 === "object" &&
    val2 !== null
  ) {
    if (Array.isArray(val1) && Array.isArray(val2)) {
      return (
        JSON.stringify(val1.map(normalizeValue)) ===
        JSON.stringify(val2.map(normalizeValue))
      );
    }
    return (
      JSON.stringify(normalizeValue(val1)) ===
      JSON.stringify(normalizeValue(val2))
    );
  }
  return normalizeValue(val1) === normalizeValue(val2);
}

function getChangedFields<T>(initial: T, current: T): Partial<T> {
  const diff: Partial<T> = {};
  const keys = new Set([
    ...Object.keys(initial as any),
    ...Object.keys(current as any),
  ]);
  keys.forEach((key) => {
    const typedKey = key as keyof T;
    const initVal = initial[typedKey];
    const currVal = current[typedKey];
    if (!isEqualNormalized(initVal, currVal)) {
      if (
        typeof initVal === "object" &&
        initVal !== null &&
        typeof currVal === "object" &&
        currVal !== null &&
        !Array.isArray(initVal) &&
        !Array.isArray(currVal)
      ) {
        const nestedDiff = getChangedFields(initVal, currVal);
        if (Object.keys(nestedDiff).length > 0) {
          diff[typedKey] = nestedDiff as any;
        }
      } else {
        diff[typedKey] = currVal;
      }
    }
  });
  return diff;
}

function buildFormData(diff: Partial<any>): FormData {
  const formData = new FormData();
  (Object.keys(diff) as (keyof any)[]).forEach((key) => {
    const value = diff[key as any];
    if (value === null || value === undefined) return;

    // Special handling for transportation_services:
    if (
      key === "transportation_services" ||
      key === "transportation_service_ids"
    ) {
      const services = Array.isArray(value) ? value : [];
      services.forEach((service: any) =>
        formData.append("transportation_service_ids", service.toString())
      );
      return;
    }

    // Special handling for file arrays (e.g. accountant_photo)
    if (key === "accountant_photo") {
      if (Array.isArray(value)) {
        value.forEach((file: any) => {
          if (file instanceof File) {
            formData.append("accountant_photo", file);
          }
        });
      }
      return;
    }

    // Special handling for cargo and cargo_images: send as JSON
    if (key === "cargo" || key === "cargo_images") {
      formData.append(key, JSON.stringify(value));
      return;
    }

    if (value instanceof File) {
      formData.append(key as any, value);
    } else if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item instanceof File) {
          formData.append(`${key as any}`, item);
        } else {
          formData.append(`${key as any}`, item + "");
        }
      });
    } else if (typeof value === "object") {
      formData.append(key as any, JSON.stringify(value));
    } else {
      formData.append(key as any, value + "");
    }
  });
  return formData;
}

const DeliveryQRCard = ({ id }: CarrierPageProps) => {
  const [actData, setActData] = useState<any>(null);
  const [originalActData, setOriginalActData] = useState<any>(null);
  const [clientName, setClientName] = useState("");
  const [qrValue, setQrValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch act data on mount (and refresh after 500ms)
  useEffect(() => {
    if (id) {
      const fetchActData = async () => {
        try {
          const response = await axiosInstance.get(`/acts/${id}/`);
          console.log("Fetched act data:", response.data);
          setActData(response.data);
          setOriginalActData(response.data);
        } catch (error) {
          console.error("Error fetching act data:", error);
        }
      };

      fetchActData();
      const timer = setTimeout(() => {
        fetchActData();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [id]);

  // Generate QR code using act number and client name.
  const generateQR = () => {
    if (!actData) return;
    const actNumber = actData.number || "12345";
    setQrValue(`Act № ${actNumber} - Клиент: ${clientName}`);
  };

  // PATCH API call to update act data.
  const handleSendAct = async () => {
    // Optionally update the QR value (if you want to include updated client name, etc.)
    generateQR();

    try {
      const changedData = getChangedFields(originalActData, actData);
      const formData = buildFormData(changedData);
      await axiosInstance.patch(`/acts/${id}/`, formData);
      console.log("Act data patched successfully");
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error sending act data:", error);
      alert("Ошибка при отправке акта");
    }
  };

  // Download QR code as PNG.
  const handleDownloadQR = () => {
    const svg = document.getElementById("qr-code");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = pngFile;
      link.download = "QR_Code.png";
      link.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  // Show a loading indicator if act data is not fetched yet.
  if (!actData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 py-8">
        <p className="text-lg text-gray-700">Загрузка данных акта...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 px-4 py-8">
      {/* Logo at the top */}
      <div className="mb-8">
        <Logo width={172} height={56} />
      </div>

      {/* Card Container */}
      <div className="w-full max-w-md bg-white p-6 shadow-lg rounded-lg text-center">
        {/* Information Package Section */}
        <div className="mb-6">
          <InformationPackage
            title={"О выдаче"}
            data={actData}
            setData={setActData}
          />
        </div>

        {/* "Товар передан Клиенту" Button triggers PATCH API */}
        <button
          onClick={handleSendAct}
          className="w-full font-semibold py-3 rounded-lg transition bg-yellow-400 hover:bg-yellow-500 text-black"
        >
          Товар передан Клиенту
        </button>
      </div>

      {/* QR Code Section */}
      {qrValue && (
        <div className="mt-8 flex flex-col items-center justify-center">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            QR-код Акта № {actData?.number || "12345"}
          </h2>
          <div className="inline-block p-4 bg-white rounded-lg shadow-md mb-10">
            <QRCode id="qr-code" value={qrValue} size={200} />
          </div>
          <button
            onClick={handleDownloadQR}
            className="w-full font-semibold py-3 rounded-lg transition bg-green-400 hover:bg-green-500 text-white mb-8"
          >
            Скачать QR-код
          </button>
        </div>
      )}

      {/* Modal Display */}
      {isModalOpen && (
        <CreateSuccessAct
          title="Акт успешно обновлен!"
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </div>
  );
};

export default DeliveryQRCard;
