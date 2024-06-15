import {
  healthCareHistoryProps,
  useGetHospitalByIdQuery,
  useGetUserByIdQuery,
} from "@/app/store/slices/user.slice";
import moment from "moment";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HiOutlineShieldCheck } from "react-icons/hi";
import { LuTimer } from "react-icons/lu";
import Text from "../Text";

interface HealthCareHistoryCardProps extends healthCareHistoryProps {
  className?: string;
  userType: "user" | "hospital";
}

const HealthCareHistoryCard = ({
  className,
  attender,
  createdAt,
  href,
  userType,
}: HealthCareHistoryCardProps) => {
  const [attenderName, setAttenderName] = useState<string | undefined>(undefined);

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    const fetchData = async () => {
      try {
        if (userType === "user") {
          const { data } = await useGetUserByIdQuery(attender);
          setAttenderName(data.data.username);
        } else if (userType === "hospital") {
          const { data } = await useGetHospitalByIdQuery(attender);
          setAttenderName(data.data.username)
        }
      } catch (error: any) {
        if (error.name === "AbortError") {
          console.log("Request was aborted due to unmounting.");
        } else {
          console.error("Error:", error);
        }
      }
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, [attender, userType]);

  return (
    <Link href={href}>
      <section className={`appointment bg-gray-100 transition-colors ease-in hover:bg-purple-100 flex items-center justify-between p-4 rounded cursor-pointer my-4 ${className}`}>
        <section className="icon bg-accent text-white p-3 flex items-center justify-center rounded">
          <HiOutlineShieldCheck className="w-6 h-6" />
        </section>
        <section className="other-content w-11/12 flex items-center justify-around">
          <Text className="text-sm font-bold" noCapitalize={true}>
            @{attenderName}
          </Text>
          <div className="text-[13px] lowercase flex items-center gap-x-1">
            <LuTimer className="w-5 h-5" />
            {moment(new Date(createdAt)).startOf("seconds").fromNow()}
          </div>
        </section>
      </section>
    </Link>
  );
};

export { HealthCareHistoryCard };
