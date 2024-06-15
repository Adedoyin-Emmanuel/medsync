import Link from "next/link";
import React from "react";
import { BsCameraVideo } from "react-icons/bs";
import { MdPermCameraMic } from "react-icons/md";

interface AppointmentButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  others?: React.Attributes;
}

interface AppointmentStartButtonProps extends AppointmentButtonProps {
  href?: string;
}

const AppointmentButton = ({
  className,
  ...others
}: AppointmentButtonProps): JSX.Element => {
  return (
    <Link href={"/user/appointments/new"} title="New appointment">
      <section className="fixed bottom-20 right-10">
        <section
          className={`w-16 h-16 flex items-center justify-center  bg-accent rounded-full shadow cursor-pointer relative transform-gpu transition-transform duration-200 scale-100 hover:scale-110 ${className}`}
          {...others}
        >
          <BsCameraVideo className="h-10 w-10 text-white" />
        </section>
      </section>
    </Link>
  );
};

export const AppointmentStartButton = ({
  className,
  href,
  ...others
}: AppointmentStartButtonProps): JSX.Element => {
  return (
    <Link href={href!} title="Start appointment">
      <section className="fixed bottom-20 right-10">
        <section
          className={`w-16 h-16 flex items-center justify-center  bg-accent rounded-full shadow cursor-pointer relative transform-gpu transition-transform duration-200 scale-100 hover:scale-110 ${className}`}
          {...others}
        >
          <MdPermCameraMic className="h-10 w-10 text-white" />
        </section>
      </section>
    </Link>
  );
};

export default AppointmentButton;
