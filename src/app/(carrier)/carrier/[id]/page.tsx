"use client";
import CarrierPage from "@/features/carrier";
import { useParams } from "next/navigation";

const Page = () => {
  const params = useParams();
  return (
    <>
      <CarrierPage id={params.id} />
    </>
  );
};

export default Page;
