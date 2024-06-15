"use client";

import { logoutUser } from "@/app/store/slices/auth.slice";
import { resetUser, useLogoutMutation } from "@/app/store/slices/user.slice";
import { AppDispatch } from "@/app/store/store";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import { BiMessageRoundedDots } from "react-icons/bi";
import { BsCameraVideo } from "react-icons/bs";
import { FiLogOut, FiSearch } from "react-icons/fi";
import { IoAnalytics, IoSettingsOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import AppHeader, { HospitalAppHeader } from "../AppHeader";
import MobileNav, { HospitalMobileNav } from "../MobileNav";
import Text from "../Text";
import Verified from "../Verified";

interface SidebarLayoutProps {
  className?: string;
  children?: React.ReactNode;
  showWelcomeMesage?: boolean;
}

const SidebarLayout = ({
  className,
  children,
  showWelcomeMesage,
}: SidebarLayoutProps) => {
  const currentPath = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const [logout] = useLogoutMutation();
  const router = useRouter();

  const handleLogoutClick = async () => {
    try {
      const response = await logout({}).unwrap();
      if (response) {
        toast.success(response.message);
        dispatch(logoutUser());
        dispatch(resetUser());
        router.push("/auth/login");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || error.error || error?.data);
    }
  };
  return (
    <section className="parent h-screen w-screen flex justify-between">
      <div
        className={`bg-zinc-100 h-screen hidden md:flex md:w-3/12  lg:w-2/12 items-center justify-start flex-col  p-0  fixed ${className} `}
      >
        <section className="w-11/12 p-2">
          <Link
            href={"/user/dashboard"}
            className={`dashboard cursor-pointer  ${
              currentPath.includes("dashboard") ||
              currentPath.includes("medical-records")
                ? "text-white bg-accent"
                : "bg-gray-200"
            }  transition-colors flex items-center gap-x-4  p-5 rounded my-4 hover:bg-accent duration-100 ease-in hover:text-white`}
          >
            <IoAnalytics className="w-6 h-6" />
            <Text>Dashboard</Text>
          </Link>

          <Link
            href="/user/appointments"
            className={`dashboard cursor-pointer  ${
              currentPath.includes("appointments")
                ? "text-white bg-accent"
                : "bg-gray-200"
            }  hover:bg-accent duration-100 ease-in hover:text-white transition-colors flex items-center gap-x-4 p-5 rounded my-4`}
          >
            <BsCameraVideo className="w-6 h-6" />
            <Text>Appointments</Text>
          </Link>

          <Link
            href="/user/search"
            className={`dashboard cursor-pointer  ${
              currentPath.includes("search")
                ? "text-white bg-accent"
                : "bg-gray-200"
            } hover:bg-accent duration-100 ease-in hover:text-white transition-colors flex items-center gap-x-4 p-5 rounded my-4`}
          >
            <FiSearch className="w-6 h-6" />
            <Text>Find Hospitals</Text>
          </Link>

          <Link
            href="/user/messages"
            className={`dashboard cursor-pointer  ${
              currentPath.includes("messages")
                ? "text-white bg-accent"
                : "bg-gray-200"
            } hover:bg-accent duration-100 ease-in hover:text-white transition-colors flex items-center gap-x-4 p-5 rounded my-4`}
          >
            <BiMessageRoundedDots className="w-6 h-6" />
            <Text>Messages</Text>
          </Link>

          <Link
            href="/user/settings"
            className={`dashboard cursor-pointer ${
              currentPath.includes("settings") ||
              currentPath.includes("profile") ||
              currentPath.includes("profile/me")
                ? "text-white bg-accent"
                : "bg-gray-200"
            }  hover:bg-accent duration-100 ease-in hover:text-white transition-colors flex items-center gap-x-4 p-5 rounded my-4`}
          >
            <IoSettingsOutline className="w-6 h-6" />
            <Text>Settings</Text>
          </Link>

          <Link
            href=""
            onClick={handleLogoutClick}
            className={`dashboard cursor-pointer  ${
              currentPath.includes("logout")
                ? "text-white bg-accent"
                : "bg-gray-200"
            }  hover:bg-accent duration-100 ease-in hover:text-white transition-colors flex items-center gap-x-4 p-5 rounded my-4`}
          >
            <FiLogOut className="w-6 h-6" />
            <Text>Logout</Text>
          </Link>
        </section>
      </div>
      <section className="w-full md:w-3/4 lg:w-5/6 md:p-8 p-2 pl-1/4 overflow-y-auto ml-auto">
        <AppHeader showWelcomeMessage={showWelcomeMesage} />
        {children}

        <section className="spacer md:hidden my-10">
          <br /> <br /> <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
        </section>
      </section>

      <MobileNav />
    </section>
  );
};

export const HospitalSidebarNav = ({
  className,
  children,
  showWelcomeMesage,
}: SidebarLayoutProps) => {
  const currentPath = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const [logout] = useLogoutMutation();
  const router = useRouter();

  const handleLogoutClick = async () => {
    try {
      const response = await logout({}).unwrap();
      if (response) {
        toast.success(response.message);
        dispatch(logoutUser());
        dispatch(resetUser());
        router.push("/auth/login");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || error.error || error?.data);
    }
  };

  return (
    <section className="parent h-screen w-screen flex justify-between">
      <div
        className={`bg-zinc-100 h-screen hidden md:flex md:w-3/12  lg:w-2/12 items-center justify-start flex-col  p-0  fixed ${className} `}
      >
        <section className="w-11/12 p-2">
          <Link
            href={"/hospital/dashboard"}
            className={`dashboard cursor-pointer  ${
              currentPath.includes("dashboard")
                ? "text-white bg-accent"
                : "bg-gray-200"
            }  transition-colors flex items-center gap-x-4  p-5 rounded my-4 hover:bg-accent duration-100 ease-in hover:text-white`}
          >
            <IoAnalytics className="w-6 h-6" />
            <Text>Dashboard</Text>
          </Link>

          <Link
            href="/hospital/appointments"
            className={`dashboard cursor-pointer  ${
              currentPath.includes("appointments")
                ? "text-white bg-accent"
                : "bg-gray-200"
            }  hover:bg-accent duration-100 ease-in hover:text-white transition-colors flex items-center gap-x-4 p-5 rounded my-4`}
          >
            <BsCameraVideo className="w-6 h-6" />
            <Text>Appointments</Text>
          </Link>

          <Link
            href="/hospital/search"
            className={`dashboard cursor-pointer  ${
              currentPath.includes("search")
                ? "text-white bg-accent"
                : "bg-gray-200"
            } hover:bg-accent duration-100 ease-in hover:text-white transition-colors flex items-center gap-x-4 p-5 rounded my-4`}
          >
            <FiSearch className="w-6 h-6" />
            <Text>Find Users</Text>
          </Link>

          <Link
            href="/hospital/messages"
            className={`dashboard cursor-pointer  ${
              currentPath.includes("messages")
                ? "text-white bg-accent"
                : "bg-gray-200"
            } hover:bg-accent duration-100 ease-in hover:text-white transition-colors flex items-center gap-x-4 p-5 rounded my-4`}
          >
            <BiMessageRoundedDots className="w-6 h-6" />
            <Text>Messages</Text>
          </Link>

          <Link
            href="/hospital/settings"
            className={`dashboard cursor-pointer ${
              currentPath.includes("settings") ||
              currentPath.includes("profile") ||
              currentPath.includes("profile/me")
                ? "text-white bg-accent"
                : "bg-gray-200"
            }  hover:bg-accent duration-100 ease-in hover:text-white transition-colors flex items-center gap-x-4 p-5 rounded my-4`}
          >
            <IoSettingsOutline className="w-6 h-6" />
            <Text>Settings</Text>
          </Link>

          <Link
            href=""
            onClick={handleLogoutClick}
            className={`dashboard cursor-pointer  ${
              currentPath.includes("logout")
                ? "text-white bg-accent"
                : "bg-gray-200"
            }  hover:bg-accent duration-100 ease-in hover:text-white transition-colors flex items-center gap-x-4 p-5 rounded my-4`}
          >
            <FiLogOut className="w-6 h-6" />
            <Text>Logout</Text>
          </Link>
        </section>
      </div>
      <section className="w-full md:w-3/4 lg:w-5/6 md:p-8 p-2 pl-1/4 overflow-y-auto ml-auto">
        <HospitalAppHeader showWelcomeMessage={showWelcomeMesage} />
        {children}

        <section className="spacer md:hidden my-10">
          <br /> <br /> <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
        </section>
      </section>

      <HospitalMobileNav />
    </section>
  );
};

export default SidebarLayout;
