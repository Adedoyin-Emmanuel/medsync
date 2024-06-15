"use client";
import React, { useEffect, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useRouter } from "next/navigation";
import { IconType } from "react-icons/lib";

interface DashboardCardProps {
  className?: string;
  appointments: number | string;
  healthcareHistoryRef?: React.RefObject<HTMLDivElement>;
  userType?: "user" | "hospital";
}

const DashboardCard = ({
  className,
  appointments,
  healthcareHistoryRef,
  userType,
}: DashboardCardProps) => {
  const [currentIcon, setCurrentIcon] = useState<IconType | any>(AiOutlineEye);
  const [toggler, setToggler] = useState(true);
  const [totalAppointment, setTotalAppointment] = useState(appointments);
  const router = useRouter();

  const handleIconClick = () => {
    setToggler(!toggler);
  };

  const appointmentLink =
    userType === "user" ? "/user/appointments/" : "/hospital/appointments/";

  useEffect(() => {
    setCurrentIcon(toggler ? AiOutlineEye : AiOutlineEyeInvisible);
    setTotalAppointment(toggler ? appointments : "****");
  }, [toggler]);

  const handleHealthcareHistoryClick = () => {
    if (healthcareHistoryRef) {
      healthcareHistoryRef?.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const appointmentButtonClick = () => {
    router.push(appointmentLink);
  };

  return (
    <section
      className={`rounded-lg md:hidden bg-purple-200 gap-y-2 p-4 w-full ${className}`}
    >
      <section className="header flex items-center justify-between">
        <section className="first flex items-center gap-x-1">
          <p className="capitalize text-[12px]">total appoinments</p>
          <section className="icon-container" onClick={handleIconClick}>
            {currentIcon}
          </section>
        </section>
        <section
          className="end flex items-center gap-x-1"
          onClick={handleHealthcareHistoryClick}
        >
          <p className="capitalize text-[12px]">healthcare history</p>

          <MdOutlineKeyboardArrowRight />
        </section>
      </section>
      <h3 className="text-[18px] font-bold my-2">{totalAppointment || 0}</h3>
      <section
        className="w-full flex items-end justify-end"
        onClick={appointmentButtonClick}
      >
        <section className="new-appointment bg-accent rounded-[30px] capitalize w-28 text-[12px] text-center p-1  text-white">
          appointment
        </section>
      </section>
    </section>
  );
};

export default DashboardCard;
