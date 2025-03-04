"use client";

import DeliveryQRCard from "@/components/DeliveryQrCode";

interface CarrierPageProps {
  id: string | string[];
}

export default function CarrierPage({ id }: CarrierPageProps) {
  return (
    <>
      <DeliveryQRCard id={id} />
    </>
  );
}
