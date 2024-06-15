import Link from "next/link";
import React from "react";
import { FaHospitalUser } from "react-icons/fa";

interface MedicalRecordProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  others?: React.Attributes;
  href: string;
}

const MedicalRecord = ({
  className,
  href,
  ...others
}: MedicalRecordProps): JSX.Element => {
  return (
    <Link href={href} title="View medical records">
      <section className="fixed bottom-20 right-10">
        <section
          className={`w-16 h-16 flex items-center justify-center  bg-accent rounded-full shadow cursor-pointer relative transform-gpu transition-transform duration-200 scale-100 hover:scale-110 ${className}`}
          {...others}
        >
          <FaHospitalUser className="h-10 w-10 text-white" />
        </section>
      </section>
    </Link>
  );
};

export default MedicalRecord;
