"use client";
import Link from "next/link";
import { AiOutlineEye } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";
import { IoAdd } from "react-icons/io5";

interface DashboardQuickActionsProps {
  className?: string;
}

export const DashboardQuickActions = ({
  className,
}: DashboardQuickActionsProps) => {
  return (
    <section
      className={`rounded-lg bg-slate-50 w-full p-4  md:hidden flex flex-col justify-center gap-y-3  mt-10  ${className}`}
    >
      <h4 className="font-bold text-[16px] capitalize my-2">quick actions</h4>

      <section className="action-buttons flex w-full justify-around">
        <Link
          href={"/user/appointments/new"}
          className="action-1 flex items-center flex-col w-full gap-y-2"
        >
          <section className="image bg-purple-200 rounded-full p-2">
            <IoAdd />
          </section>
          <p className="text-[11px] capitalize">add appointment</p>
        </Link>

        <Link
          href={"/user/appointments/"}
          className="action-1 flex items-center flex-col w-full gap-y-2"
        >
          <section className="image bg-purple-200 rounded-full p-2">
            <AiOutlineEye />
          </section>
          <p className="text-[11px] capitalize">appointment</p>
        </Link>

        <Link
          href={"/user/search"}
          className="action-1 flex items-center flex-col w-full gap-y-2"
        >
          <section className="image bg-purple-200 rounded-full p-2">
            <FiSearch />
          </section>
          <p className="text-[11px] capitalize">explore</p>
        </Link>
      </section>
    </section>
  );
};

export const HospitalDashboardQuickActions = ({
  className,
}: DashboardQuickActionsProps) => {
  return (
    <section
      className={`rounded-lg bg-slate-50 w-full p-4  md:hidden flex flex-col justify-center gap-y-3  mt-10  ${className}`}
    >
      <h4 className="font-bold text-[16px] capitalize my-2">quick actions</h4>
      <section className="action-buttons flex w-full justify-around">
        <Link
          href={"/hospital/messages"}
          className="action-1 flex items-center flex-col w-full gap-y-2"
        >
          <section className="image bg-purple-200 rounded-full p-2">
            <IoAdd />
          </section>
          <p className="text-[11px] capitalize">messages</p>
        </Link>

        <Link
          href={"/hospital/appointments/"}
          className="action-1 flex items-center flex-col w-full gap-y-2"
        >
          <section className="image bg-purple-200 rounded-full p-2">
            <AiOutlineEye />
          </section>
          <p className="text-[11px] capitalize">appointments</p>
        </Link>

        <Link
          href={"/hospital/search"}
          className="action-1 flex items-center flex-col w-full gap-y-2"
        >
          <section className="image bg-purple-200 rounded-full p-2">
            <FiSearch />
          </section>
          <p className="text-[11px] capitalize">explore</p>
        </Link>
      </section>
    </section>
  );
};
