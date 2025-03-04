"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useRef, useMemo } from "react";
import Customer from "@/components/Customer";
import PackageCharacteristics from "@/components/PackageCharacteristics";
import CargoPhoto from "@/components/CargoPhoto";
import InformationPackage from "@/components/PackageInformation";
import Shipping from "@/components/Shipping";
import CreateSuccessAct from "@/components/modals/CreateSuccessAct";
import { useParams } from "next/navigation";
import { axiosInstance, getStatusBadge } from "@/helper/utils";
import { Act, Status } from "@/helper/types";
import QrAct from "@/components/QrAct";
import DeliveryQRCard from "@/components/DeliveryQrCode";

export default function ActPage() {
  const params = useParams();
  return <DeliveryQRCard id={params.id} />;
}
