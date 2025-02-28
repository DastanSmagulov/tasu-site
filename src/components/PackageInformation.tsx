import React, { useState, useEffect, FC } from "react";
import { axiosInstance } from "@/helper/utils";
import { ActDataProps } from "@/helper/types";
import Signature from "./Signature";

interface CustomerOption {
  id: string;
  full_name: string;
  phone?: string;
}

interface PackageOption {
  id: number;
  name_ru: string;
}

const InformationPackage: React.FC<ActDataProps & { title: string }> = ({
  title,
  data,
  setData,
}) => {
  // Local states for "Выдал" and "Принял"
  const [issuedBy, setIssuedBy] = useState<CustomerOption | null>(null);
  const [receivedBy, setReceivedBy] = useState<CustomerOption | null>(null);

  // Initialize dateTime state:
  // If parent's data exists, use it; otherwise, default to current date/time.
  const [dateTime, setDateTime] = useState(() => {
    const initial = title.toLowerCase().includes("выдаче")
      ? data?.delivery_cargo_info?.date
      : data?.receiving_cargo_info?.date;
    // If no date provided, default to current datetime in "YYYY-MM-DDTHH:mm" format
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

  // Dropdown states for "Выдал" and "Принял"
  const [customers, setCustomers] = useState<CustomerOption[]>([]);
  const [issuedDropdownOpen, setIssuedDropdownOpen] = useState(false);
  const [receivedDropdownOpen, setReceivedDropdownOpen] = useState(false);

  // Fetch customers for dropdown options
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axiosInstance.get("/admin/users/search/");
        setCustomers(response.data.results);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };
    fetchCustomers();
  }, []);

  // Initialize local state from parent's data (run only when data or title change)
  useEffect(() => {
    if (data) {
      if (
        title.toLowerCase().includes("получении") &&
        data.receiving_cargo_info
      ) {
        const info = data.receiving_cargo_info;
        if (!issuedBy && info.issued) {
          setIssuedBy({ id: info.issued + "", full_name: info.issued + "" });
        }
        if (!receivedBy && info.accepted) {
          setReceivedBy({
            id: info.accepted + "",
            full_name: info.accepted + "",
          });
        }
      } else if (
        title.toLowerCase().includes("выдаче") &&
        data.delivery_cargo_info
      ) {
        const info = data.delivery_cargo_info;
        if (!issuedBy && info.issued) {
          setIssuedBy({ id: info.issued + "", full_name: info.issued + "" });
        }
        if (!receivedBy && info.accepted) {
          setReceivedBy({
            id: info.accepted + "",
            full_name: info.accepted + "",
          });
        }
      }
    }
  }, [data, title, issuedBy, receivedBy]);

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

    let newData;
    if (title.toLowerCase().includes("получении")) {
      newData = {
        ...data,
        receiving_cargo_info: {
          issued: issuedBy ? issuedBy.id : null,
          accepted: receivedBy ? receivedBy.id : null,
          date: formattedDate,
        },
        receiver_data: {
          ...data?.receiver_data,
          signature: receiverSignatureDataUrl,
        },
      };
    } else if (title.toLowerCase().includes("выдаче")) {
      newData = {
        ...data,
        delivery_cargo_info: {
          issued: issuedBy ? issuedBy.id : null,
          accepted: receivedBy ? receivedBy.id : null,
          date: formattedDate,
        },
        customer_data: {
          ...data?.customer_data,
          signature: signatureDataUrl,
        },
      };
    }

    if (JSON.stringify(newData) !== JSON.stringify(data)) {
      setData(newData);
    }
  }, [
    issuedBy,
    receivedBy,
    dateTime,
    title,
    setData,
    signatureDataUrl,
    receiverSignatureDataUrl,
    data,
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

  // Handlers for dropdown toggling.
  const toggleIssuedDropdown = () => {
    setIssuedDropdownOpen((prev) => !prev);
  };

  const toggleReceivedDropdown = () => {
    setReceivedDropdownOpen((prev) => !prev);
  };

  const selectIssuedCustomer = (customer: CustomerOption) => {
    setIssuedBy(customer);
    setIssuedDropdownOpen(false);
  };

  const selectReceivedCustomer = (customer: CustomerOption) => {
    setReceivedBy(customer);
    setReceivedDropdownOpen(false);
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
          <div className="mt-2 relative">
            <input
              type="text"
              value={issuedBy ? issuedBy.full_name : ""}
              readOnly
              onClick={toggleIssuedDropdown}
              className="w-full px-4 py-2 border rounded-md focus:outline-none cursor-pointer"
              placeholder="Выберите из списка"
            />
            {issuedDropdownOpen && (
              <ul className="absolute top-full left-0 z-10 w-full max-h-40 overflow-auto border border-gray-300 bg-white">
                {customers.map((customer) => (
                  <li
                    key={customer.id}
                    onClick={() => selectIssuedCustomer(customer)}
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  >
                    {customer.full_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Received By Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Принял
          </label>
          <div className="mt-2 relative">
            <input
              type="text"
              value={receivedBy ? receivedBy.full_name : ""}
              readOnly
              onClick={toggleReceivedDropdown}
              className="w-full px-4 py-2 border rounded-md focus:outline-none cursor-pointer"
              placeholder="Выберите из списка"
            />
            {receivedDropdownOpen && (
              <ul className="absolute top-full left-0 z-10 w-full max-h-40 overflow-auto border border-gray-300 bg-white">
                {customers.map((customer) => (
                  <li
                    key={customer.id}
                    onClick={() => selectReceivedCustomer(customer)}
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  >
                    {customer.full_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
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
              value={dateTime}
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
                initialDataUrl={data?.customer_data?.signature}
              />
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold mb-4">Подпись Получателя</h2>
              <Signature
                onSubmit={setReceiverSignatureDataUrl}
                onUpload={handleReceiverSignatureUpload}
                initialDataUrl={data?.receiver_data?.signature}
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
