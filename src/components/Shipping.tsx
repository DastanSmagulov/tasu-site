"use client";
import React, { FC, useState, useEffect, useRef } from "react";
import { ActDataProps } from "@/helper/types";
import { axiosInstance } from "@/helper/utils";

// Define the option type (assumed structure)
interface CustomerOption {
  id: string;
  full_name: string;
}

const Shipping: FC<ActDataProps> = ({ data, setData }) => {
  // Fetch options from API.
  const [options, setOptions] = useState<CustomerOption[]>([]);

  // Initialize local state from parent's data if available.
  const initialSender =
    data?.transportation?.sender && data?.transportation.sender !== ""
      ? {
          id: data?.transportation.sender,
          full_name: data?.transportation.sender,
        }
      : null;
  const initialReceiver =
    data?.transportation?.receiver && data?.transportation.receiver !== ""
      ? {
          id: data?.transportation.receiver,
          full_name: data?.transportation.receiver,
        }
      : null;
  const initialPayer = data?.transportation?.sender_is_payer
    ? "sender"
    : "recipient";

  const [selectedSender, setSelectedSender] = useState<CustomerOption | null>(
    initialSender
  );
  const [selectedRecipient, setSelectedRecipient] =
    useState<CustomerOption | null>(initialReceiver);
  const [selectedPayer, setSelectedPayer] = useState<"sender" | "recipient">(
    initialPayer
  );

  // Ref to ensure we only pre-select once from parent's data if options are available.
  const preSelectRef = useRef(false);

  // Fetch options once on mount.
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axiosInstance.get("/admin/users/search/");
        const users: CustomerOption[] = response.data.results || [];
        setOptions(users);
      } catch (error) {
        console.error("Error fetching shipping options", error);
      }
    };
    fetchOptions();
  }, []);

  // Once options are available, try to update our local state with matching objects.
  useEffect(() => {
    if (!preSelectRef.current && options.length > 0 && data?.transportation) {
      const { sender, receiver, sender_is_payer } = data?.transportation;
      // Try to find matching option objects.
      const matchedSender =
        options.find((u) => u.full_name === sender) ||
        (sender ? { id: sender, full_name: sender } : null);
      const matchedReceiver =
        options.find((u) => u.full_name === receiver) ||
        (receiver ? { id: receiver, full_name: receiver } : null);
      setSelectedSender(matchedSender);
      setSelectedRecipient(matchedReceiver);
      setSelectedPayer(sender_is_payer ? "sender" : "recipient");
      preSelectRef.current = true;
    }
  }, [options, data?.transportation]);

  useEffect(() => {
    const newTransportation = {
      sender: selectedSender ? selectedSender.full_name : "",
      receiver: selectedRecipient ? selectedRecipient.full_name : "",
      sender_is_payer: selectedPayer === "sender",
    };

    // Use JSON.stringify to compare the new object with the previous one.
    setData((prev: any) => {
      const prevTransportation = prev.transportation || {};
      if (
        JSON.stringify(prevTransportation) === JSON.stringify(newTransportation)
      ) {
        return prev; // no changes, so do nothing
      }
      return {
        ...prev,
        transportation: newTransportation,
      };
    });
  }, [selectedSender, selectedRecipient, selectedPayer, setData]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md relative">
      <h2 className="text-lg font-semibold mb-4 text-[#1D1B23]">Перевозка</h2>
      <div className="grid grid-cols-3 gap-4 items-center">
        {/* Sender Dropdown */}
        <div className="col-span-1">
          <select
            value={selectedSender?.id || ""}
            onChange={(e) => {
              const selected = options.find((o) => o.id === e.target.value);
              setSelectedSender(
                selected ||
                  (e.target.value
                    ? { id: e.target.value, full_name: e.target.value }
                    : null)
              );
            }}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#09BD3C]"
          >
            <option value="">Выберите отправителя</option>
            {options.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.full_name}
              </option>
            ))}
          </select>
        </div>

        {/* Label for Sender */}
        <div className="col-span-1">
          <span>Отправитель</span>
        </div>

        {/* Sender as Payer Radio */}
        <div className="col-span-1 flex items-center justify-end">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="radio"
              name="payer"
              value="sender"
              checked={selectedPayer === "sender"}
              onChange={() => setSelectedPayer("sender")}
              className="hidden"
            />
            <span
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedPayer === "sender"
                  ? "border-customYellow"
                  : "border-gray-400"
              }`}
            >
              {selectedPayer === "sender" && (
                <span className="w-2.5 h-2.5 rounded-full bg-customYellow" />
              )}
            </span>
          </label>
        </div>

        {/* Recipient Dropdown */}
        <div className="col-span-1">
          <select
            value={selectedRecipient?.id || ""}
            onChange={(e) => {
              const selected = options.find((o) => o.id === e.target.value);
              setSelectedRecipient(
                selected ||
                  (e.target.value
                    ? { id: e.target.value, full_name: e.target.value }
                    : null)
              );
            }}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#09BD3C]"
          >
            <option value="">Выберите получателя</option>
            {options.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.full_name}
              </option>
            ))}
          </select>
        </div>

        {/* Label for Recipient */}
        <div className="col-span-1">
          <span>Получатель</span>
        </div>

        {/* Recipient as Payer Radio */}
        <div className="col-span-1 flex items-center justify-end">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="radio"
              name="payer"
              value="recipient"
              checked={selectedPayer === "recipient"}
              onChange={() => setSelectedPayer("recipient")}
              className="hidden"
            />
            <span
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedPayer === "recipient"
                  ? "border-customYellow"
                  : "border-gray-400"
              }`}
            >
              {selectedPayer === "recipient" && (
                <span className="w-2.5 h-2.5 rounded-full bg-customYellow" />
              )}
            </span>
          </label>
        </div>
      </div>

      <div className="absolute top-0 right-0 mt-4 mr-6 text-sm text-gray-500">
        Выберите плательщика
      </div>
    </div>
  );
};

export default Shipping;
