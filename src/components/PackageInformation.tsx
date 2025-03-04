import React, { useState, useEffect } from "react";
import { axiosInstance } from "@/helper/utils";
import { ActDataProps } from "@/helper/types";
import Signature from "./Signature";

const InformationPackage: React.FC<ActDataProps & { title: string }> = ({
  title,
  data,
  setData,
}) => {
  // Initialize dateTime state.
  const [dateTime, setDateTime] = useState(() => {
    const initial = title.toLowerCase().includes("выдаче")
      ? data?.delivery_cargo_info?.date
      : data?.receiving_cargo_info?.date;
    return initial || new Date().toISOString().slice(0, 16);
  });

  // Signature states.
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(
    title.toLowerCase().includes("выдаче")
      ? data?.customer_data?.signature || null
      : null
  );
  const [receiverSignatureDataUrl, setReceiverSignatureDataUrl] = useState<
    string | null
  >(
    title.toLowerCase().includes("получении")
      ? data?.receiver_data?.signature || null
      : null
  );

  // Instead of dropdowns, we now use plain text input fields.
  const [issued, setIssued] = useState<string | number>(() => {
    return title.toLowerCase().includes("получении")
      ? data?.receiving_cargo_info?.issued || ""
      : data?.delivery_cargo_info?.issued || "";
  });
  const [accepted, setAccepted] = useState<string | number>(() => {
    return title.toLowerCase().includes("получении")
      ? data?.receiving_cargo_info?.accepted || ""
      : data?.delivery_cargo_info?.accepted || "";
  });
  const [issuedPhone, setIssuedPhone] = useState<string>(() => {
    return title.toLowerCase().includes("получении")
      ? data?.receiving_cargo_info?.issued_phone || ""
      : data?.delivery_cargo_info?.issued_phone || "";
  });
  const [acceptedPhone, setAcceptedPhone] = useState<string>(() => {
    return title.toLowerCase().includes("получении")
      ? data?.receiving_cargo_info?.accepted_phone || ""
      : data?.delivery_cargo_info?.accepted_phone || "";
  });

  // Update local state if parent's data changes.
  useEffect(() => {
    if (data) {
      if (
        title.toLowerCase().includes("получении") &&
        data.receiving_cargo_info
      ) {
        const info = data.receiving_cargo_info;
        setIssued(info.issued + "" || "");
        setAccepted(info.accepted + "" || "");
        setIssuedPhone(info.issued_phone + "" || "");
        setAcceptedPhone(info.accepted_phone + "" || "");
      } else if (
        title.toLowerCase().includes("выдаче") &&
        data.delivery_cargo_info
      ) {
        const info = data.delivery_cargo_info;
        setIssued(info.issued + "" || "");
        setAccepted(info.accepted + "" || "");
        setIssuedPhone(info.issued_phone || "");
        setAcceptedPhone(info.accepted_phone || "");
      }
    }
  }, [data, title]);

  // Update parent's data when local state changes.
  useEffect(() => {
    const formatDateToBackend = (date: string) => {
      if (!date) return null;
      const parsedDate = new Date(date);
      return `${parsedDate.getFullYear()}-${String(
        parsedDate.getMonth() + 1
      ).padStart(2, "0")}-${String(parsedDate.getDate()).padStart(
        2,
        "0"
      )} ${String(parsedDate.getHours()).padStart(2, "0")}:${String(
        parsedDate.getMinutes()
      ).padStart(2, "0")}:${String(parsedDate.getSeconds()).padStart(2, "0")}`;
    };

    const formattedDate = dateTime ? formatDateToBackend(dateTime) : null;

    if (title.toLowerCase().includes("получении")) {
      setData((prevData: any) => {
        const newData = {
          ...prevData,
          receiving_cargo_info: {
            issued,
            accepted,
            issued_phone: issuedPhone,
            accepted_phone: acceptedPhone,
            date: formattedDate,
          },
          receiver_data: {
            ...prevData?.receiver_data,
            signature: receiverSignatureDataUrl,
          },
        };
        // Only update if there is a change (using JSON.stringify for a deep compare)
        return JSON.stringify(newData) === JSON.stringify(prevData)
          ? prevData
          : newData;
      });
    } else if (title.toLowerCase().includes("выдаче")) {
      setData((prevData: any) => {
        const newData = {
          ...prevData,
          delivery_cargo_info: {
            issued,
            accepted,
            issued_phone: issuedPhone,
            accepted_phone: acceptedPhone,
            date: formattedDate,
          },
          customer_data: {
            ...prevData?.customer_data,
            signature: signatureDataUrl,
          },
        };
        return JSON.stringify(newData) === JSON.stringify(prevData)
          ? prevData
          : newData;
      });
    }
  }, [
    issued,
    accepted,
    issuedPhone,
    acceptedPhone,
    dateTime,
    title,
    signatureDataUrl,
    receiverSignatureDataUrl,
    setData,
  ]);

  // Update dateTime state on input change.
  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateTime(e.target.value);
  };

  // Format datetime for display.
  const formatDateTime = (dateTime: string) => {
    if (!dateTime) return "";
    const date = new Date(dateTime);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}.${month}.${year} • ${hours}:${minutes}`;
  };

  // Signature file upload handlers.
  const handleCustomerSignatureUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setSignatureDataUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleReceiverSignatureUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setReceiverSignatureDataUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Additional submission logic if needed.
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Информация {title} груза</h1>
      <form onSubmit={handleSubmit}>
        {/* Issued By Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Выдал
          </label>
          <input
            type="text"
            value={issued || ""}
            onChange={(e) => setIssued(e.target.value)}
            placeholder="Введите имя выдавшего"
            className="w-full px-4 py-2 border rounded-md focus:outline-none"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Телефон выдавшего
          </label>
          <input
            type="text"
            value={issuedPhone || ""}
            onChange={(e) => setIssuedPhone(e.target.value)}
            placeholder="Введите телефон выдавшего"
            className="w-full px-4 py-2 border rounded-md focus:outline-none"
          />
        </div>

        {/* Accepted By Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Принял
          </label>
          <input
            type="text"
            value={accepted || ""}
            onChange={(e) => setAccepted(e.target.value)}
            placeholder="Введите имя принявшего"
            className="w-full px-4 py-2 border rounded-md focus:outline-none"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Телефон принявшего
          </label>
          <input
            type="text"
            value={acceptedPhone || ""}
            onChange={(e) => setAcceptedPhone(e.target.value)}
            placeholder="Введите телефон принявшего"
            className="w-full px-4 py-2 border rounded-md focus:outline-none"
          />
        </div>

        {/* Date and Time Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Дата и время{" "}
            {title.toLowerCase().includes("получении") ? "получения" : "выдачи"}
            :
          </label>
          <div className="mt-2 flex items-center gap-4">
            <input
              type="datetime-local"
              value={dateTime || ""}
              onChange={handleDateTimeChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-700">{formatDateTime(dateTime)}</span>
          </div>
        </div>

        {/* Signature Section */}
        <div className="mb-6">
          {title.toLowerCase().includes("выдаче") ? (
            <>
              <h2 className="text-xl font-bold mb-4">Подпись Заказчика</h2>
              <Signature
                onSubmit={setSignatureDataUrl}
                onUpload={handleCustomerSignatureUpload}
                initialDataUrl={signatureDataUrl}
              />
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold mb-4">Подпись Получателя</h2>
              <Signature
                onSubmit={setReceiverSignatureDataUrl}
                onUpload={handleReceiverSignatureUpload}
                initialDataUrl={receiverSignatureDataUrl}
              />
            </>
          )}
          <div className="mt-4">
            <img
              src={
                title.toLowerCase().includes("выдаче")
                  ? data?.customer_data?.signature || ""
                  : data?.receiver_data?.signature || ""
              }
              alt="Подпись"
              className="max-w-full"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default InformationPackage;
