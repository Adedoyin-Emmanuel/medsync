import React from "react";
import Link from "next/link";
import Text from "../Text";
import { FaHospitalUser } from "react-icons/fa";
import { formatDateTime } from "@/app/helpers";

interface MedicalRecordProps {
  className?: string;
  createdAt: Date;
  symptoms: string;
  href: string;
}

const MedicalRecordLabel = ({
  className,
  createdAt,
  symptoms,
  href,
}: MedicalRecordProps) => {
  const formattedDate = formatDateTime(createdAt);
  return (
    <Link href={href}>
      <section
        className={`bg-gray-100 transition-colors ease-in hover:bg-purple-100 flex items-center justify-between p-4 rounded cursor-pointer my-4 ${className}`}
      >
        <section className="icon bg-accent text-white p-3 flex items-center justify-center rounded">
          <FaHospitalUser className="w-6 h-6" />
        </section>

        <section className="other-content w-11/12 flex items-center justify-around">
          <Text className="text-sm">{formattedDate.formattedDate}</Text>
          <Text className="text-sm font-bold" noCapitalize={true}>
            {symptoms?.length > 12
              ? symptoms?.substring(0, 12) + "..."
              : symptoms}
          </Text>
        </section>
      </section>
    </Link>
  );
};

export default MedicalRecordLabel;
