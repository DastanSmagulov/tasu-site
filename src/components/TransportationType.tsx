import { ActDataProps } from "@/helper/types";
import { axiosInstance } from "@/helper/utils";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface TransportType {
  key: string;
  value: string;
  imageUrl: string;
}

const TRANSPORT_IMAGES: Record<string, string> = {
  AUTO_CONSOL: "/images/transportAuto.png",
  AUTO_SINGLE: "/images/transportAuto.png",
  AVIATION: "/images/transportPlane.png",
  RAILWAY: "/images/transportTrain.png",
};

const TransportationTypes: React.FC<ActDataProps> = ({ data, setData }) => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [transportOptions, setTransportOptions] = useState<TransportType[]>([]);

  useEffect(() => {
    const fetchTransportTypes = async () => {
      try {
        const response = await axiosInstance.get<
          { key: string; value: string }[]
        >("/constants/transport_types/");
        const options = response.data.map((type) => ({
          ...type,
          imageUrl:
            TRANSPORT_IMAGES[type.key] || "/images/defaultTransport.png",
        }));
        setTransportOptions(options);
      } catch (error) {
        console.error("Error fetching transport types:", error);
      }
    };

    // If parent's data already has a transportation_type, use it.
    if (data?.transportation_type) {
      setSelectedOption(data?.transportation_type);
    }

    fetchTransportTypes();
  }, []);

  const handleSelect = (key: string) => {
    setSelectedOption(key);
    setData((prevData: any) => ({
      ...prevData,
      transportation_type: key,
    }));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Вид перевозки</h2>
      <div className="flex gap-4 max-2xl:flex-col">
        {transportOptions.map((option) => (
          <div
            key={option.key}
            onClick={() => handleSelect(option.key)}
            className={`cursor-pointer border rounded-lg p-4 flex flex-col items-center transition-all ${
              data?.transportation_type === option.key
                ? "border-blue-500 shadow-lg"
                : "border-gray-300"
            }`}
          >
            <Image
              src={option.imageUrl}
              alt={option.value}
              className="mb-2"
              width={80}
              height={80}
            />
            <h3 className="text-lg font-semibold text-gray-700">
              {option.value}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransportationTypes;
