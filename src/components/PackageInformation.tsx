import React, { useState, useEffect, useRef } from "react";
import { ActDataProps } from "@/helper/types";
import { axiosInstance } from "@/helper/utils";
import Signature from "@/components/Signature";

interface CustomerOption {
  id: string;
  full_name: string;
  phone?: string;
}

// Helper: convert an ISO date string to the HTML datetime-local format (YYYY-MM-DDTHH:mm)
const convertISOToDateTimeLocal = (iso: string): string => {
  const date = new Date(iso);
  const pad = (n: number) => n.toString().padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const InformationPackage: React.FC<ActDataProps & { title: string }> = ({
  title,
  data,
  setData,
}) => {
  // Local states for issued and received info
  const [issuedBy, setIssuedBy] = useState<CustomerOption | null>(null);
  const [receivedBy, setReceivedBy] = useState<CustomerOption | null>(null);
  const [dateTime, setDateTime] = useState(""); // datetime-local string

  // Signature states:
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(
    data?.customer_data?.signature || null
  );
  const [receiverSignatureDataUrl, setReceiverSignatureDataUrl] = useState<
    string | null
  >(data?.receiver_data?.signature || null);
  const initializedRef = useRef(false);

  // Dropdown states for "Выдал" and "Принял"
  const [customers, setCustomers] = useState<CustomerOption[]>([]);
  const [issuedDropdownOpen, setIssuedDropdownOpen] = useState(false);
  const [receivedDropdownOpen, setReceivedDropdownOpen] = useState(false);

  // Fetch customers for dropdown options
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axiosInstance.get("/admin/users/search/");
        setCustomers(response.data.results); // Each item assumed to have id and full_name
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };
    fetchCustomers();
  }, []);

  // Initialize local state from parent's data only once on mount.
  // Initialize local state from parent's data only once when data becomes available.
  useEffect(() => {
    if (data && !initializedRef.current) {
      if (
        title.toLowerCase().includes("получении") &&
        data.delivery_cargo_info
      ) {
        const info = data.delivery_cargo_info;
        if (info.issued) {
          // If info.issued is only a name, use it for both id and full_name
          setIssuedBy({ id: info.issued, full_name: info.issued });
        }
        if (info.accepted) {
          setReceivedBy({ id: info.accepted, full_name: info.accepted });
        }
        if (info.date) {
          setDateTime(convertISOToDateTimeLocal(info.date));
        }
      } else if (
        title.toLowerCase().includes("выдаче") &&
        data.receiving_cargo_info
      ) {
        const info = data.receiving_cargo_info;
        if (info.issued) {
          setIssuedBy({ id: info.issued, full_name: info.issued });
        }
        if (info.accepted) {
          setReceivedBy({ id: info.accepted, full_name: info.accepted });
        }
        if (info.date) {
          setDateTime(convertISOToDateTimeLocal(info.date));
        }
      }
      // Mark as initialized so we don't run again.
      initializedRef.current = true;
    }
  }, [data, title]);

  // Update parent's state when local state changes.
  useEffect(() => {
    if (title.toLowerCase().includes("получении")) {
      // For cargo receiving info, update delivery_cargo_info and customer_data's signature.
      setData((prev: any) => ({
        ...prev,
        delivery_cargo_info: {
          // Now sending both the id and name of the customer.
          issued: issuedBy && issuedBy.id !== "" ? Number(issuedBy.id) : null,
          accepted:
            receivedBy && receivedBy.id !== "" ? Number(receivedBy.id) : null,
          date: dateTime,
        },
        customer_data: {
          ...prev.customer_data,
          signature: receiverSignatureDataUrl,
        },
      }));
    } else if (title.toLowerCase().includes("выдаче")) {
      // For cargo issuance info, update receiving_cargo_info and receiver_data's signature.
      setData((prev: any) => ({
        ...prev,
        receiving_cargo_info: {
          issued: issuedBy && issuedBy.id !== "" ? Number(issuedBy.id) : null,
          accepted:
            receivedBy && receivedBy.id !== "" ? Number(receivedBy.id) : null,
          date: dateTime,
        },
        receiver_data: {
          ...prev.receiver_data,
          signature: signatureDataUrl,
        },
      }));
    }
  }, [
    issuedBy,
    receivedBy,
    dateTime,
    title,
    setData,
    signatureDataUrl,
    receiverSignatureDataUrl,
  ]);

  // Update dateTime state on input change
  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateTime(e.target.value);
  };

  // Format datetime for display (for example purposes)
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

  // Handlers for dropdown toggling using the input field
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
    // Handle additional form submission logic if needed
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
          {(signatureDataUrl || receiverSignatureDataUrl) && (
            <div className="mt-4">
              <img
                src={
                  title.toLowerCase().includes("выдаче")
                    ? data?.customer_data?.signature!
                    : data?.receiver_data?.signature!
                }
                alt="Подпись"
                className="max-w-full"
              />
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default InformationPackage;
