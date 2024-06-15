"use client";
import React from "react";
import moment from "moment";
import { LuTimer } from "react-icons/lu";
import Text from "../Text";
import Button from "../Button";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface MedicalRecordCardProps {
  className?: string;
  createdAt: Date;
  href: string;
  others?: React.Attributes;
  symptoms: string;
  diagnosis: string;
}

const MedicalRecordCard = ({
  className,
  createdAt,
  href,
  others,
  symptoms,
  diagnosis,
}: MedicalRecordCardProps) => {
  const router = useRouter();
  const handleMedicalRecordClick = () => {
    router.push(href);
  };
  return (
    <section
      className={`appointment-one bg-gray-100  rounded p-3 w-full md:w-96 cursor-pointer my-2 ${className}`}
      onClick={handleMedicalRecordClick}
      {...others}
    >
      <h3 className="text-[18px] capitalize font-bold my-2 flex items-center justify-between">
        {symptoms.length > 20 ? `${symptoms.substring(0, 20)} ...` : symptoms}
        <div className="text-[13px] capitalize flex items-center  gap-x-1">
          <LuTimer className="w-5 h-5" />
          {moment(new Date(createdAt)).startOf("seconds").fromNow()}
        </div>
      </h3>

      <Text className="text-sm my-3 md:my-2">
        {diagnosis.length > 400
          ? `${diagnosis.substring(0, 400)} ...`
          : diagnosis}
      </Text>

      <section className="button-container my-2 mt-3">
        <Link href={href}>
          <Button>View details</Button>
        </Link>
      </section>
    </section>
  );
};

export default MedicalRecordCard;
