import { formatDateTime } from "@/app/helpers";
import {
  useGetHospitalByIdQuery,
  useGetUserByIdQuery,
} from "@/app/store/slices/user.slice";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BsCameraVideo } from "react-icons/bs";
import { LuTimer } from "react-icons/lu";
import Button from "../Button";
import Text from "../Text";

export interface AppointmentCardProps {
  className?: string;
  title: string;
  startDate: Date;
  endDate: Date;
  description: string;
  _id: string;
  createdAt: Date;
  userType: "user" | "hospital";
}

interface AppointmentLabelProps {
  className?: string;
  attender: string;
  createdAt: Date;
  status: "pending" | "failed" | "success";
  _id: string;
  href: string;
  userType: "user" | "hospital";
}

const ApppointmentCard = ({
  className,
  title,
  startDate,
  description,
  endDate,
  _id,
  createdAt,
  userType,
}: AppointmentCardProps) => {
  const startFormattedTime = formatDateTime(startDate);
  const endFormattedTime = formatDateTime(endDate);

  const router = useRouter();

  const appointmentLink = `/${userType}/appointments/${_id}`;

  const handleAppointmentClick = () => {
    router.push(appointmentLink);
  };

  return (
    <section
      className="appointment-one bg-gray-100  rounded p-3 w-full md:w-96 cursor-pointer my-2"
      onClick={handleAppointmentClick}
    >
      <h3 className="text-[18px] capitalize font-bold my-2 flex items-center justify-between">
        {title}{" "}
        <div className="text-[13px] capitalize flex items-center  gap-x-1">
          <LuTimer className="w-5 h-5" />
          {moment(new Date(createdAt)).startOf("seconds").fromNow()}
        </div>
      </h3>
      <Text className="text-sm text-slate-700">
        {startFormattedTime.dateMonthYear} ({startFormattedTime.hoursAndMinutes}
        {" - "} {endFormattedTime.hoursAndMinutes})
      </Text>

      <Text className="text-sm my-3 md:my-2">{description}</Text>

      <section className="button-container my-2 mt-3">
        <Link href={appointmentLink}>
          {" "}
          <Button>appointment details</Button>
        </Link>
      </section>
    </section>
  );
};

const AppointmentLabel = ({
  className,
  status,
  createdAt,
  attender,
  href,
  userType,
}: AppointmentLabelProps) => {
  let defaultStatus = (
    <section className="status-badge text-black rounded bg-purple-300 flex items-center justify-center h-5 w-20">
      <Text className="text-[12px] font-bold">loading</Text>
    </section>
  );

  const formattedDate = formatDateTime(createdAt); 

  switch (status) {
    case "pending":
      defaultStatus = (
        <section className="status-badge text-black rounded bg-yellow-300 flex items-center justify-center h-5 w-20">
          <Text className="text-[12px] font-bold">pending</Text>
        </section>
      );
      break;
    case "success":
      defaultStatus = (
        <section className="status-badge text-black rounded bg-green-300 flex items-center justify-center h-5 w-20">
          <Text className="text-[12px] font-bold">success</Text>
        </section>
      );
      break;
    case "failed":
      defaultStatus = (
        <section className="status-badge  text-black rounded bg-red-400 flex items-center justify-center h-5 w-20">
          <Text className="text-[12px] font-bold">failed</Text>
        </section>
      );
      break;
    default:
      defaultStatus = defaultStatus;
  }

  const dataRequest =
    userType == "user"
      ? useGetUserByIdQuery(attender)
      : useGetHospitalByIdQuery(attender);
  const { data } = dataRequest;
  const [attenderName, setAttenderName] = useState<string>("");

  useEffect(() => {
    setAttenderName(data?.data.username!);
  }, [dataRequest]);

  return (
    <Link href={href}>
      <section
        className={`appointment bg-gray-100 transition-colors ease-in hover:bg-purple-100 flex items-center justify-between p-4 rounded cursor-pointer my-4 ${className}`}
      >
        <section className="icon bg-accent text-white p-3 flex items-center justify-center rounded">
          <BsCameraVideo className="w-6 h-6" />
        </section>

        <section className="other-content w-11/12 flex items-center justify-around">
          <Text className="text-sm">{formattedDate.formattedDate}</Text>
          <Text className="text-sm font-bold" noCapitalize={true}>
            @{attenderName?.length > 12 ? attenderName?.substring(0, 12) + "..." : attenderName }
          </Text>
          <section className="status-badge text-black rounded bg-green-300 flex items-center justify-center h-5 w-20">
            {defaultStatus}
          </section>
        </section>
      </section>
    </Link>
  );
};

export { AppointmentLabel, ApppointmentCard };
