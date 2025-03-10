"use client";

import { useParams } from "next/navigation";
import DeliveryQRCard from "@/components/DeliveryQrCode";

export default function ActPage() {
  const params = useParams();
  return <DeliveryQRCard id={params.id} />;
}
