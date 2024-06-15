"use client";
import AppointmentButton from "@/app/components/AppointmentButton";
import {
  AppointmentCardProps,
  ApppointmentCard,
} from "@/app/components/AppointmentCard";
import Loader from "@/app/components/Loader";
import SidebarLayout from "@/app/components/SidebarLayout";
import Text from "@/app/components/Text";
import { useGetUserAppointmentsQuery } from "@/app/store/slices/user.slice";
import { useAppSelector } from "@/app/store/store";
import { useEffect, useState } from "react";
import Seo from "@/app/components/Seo/Seo";
import { userAppointmentInfoProps } from "@/app/store/slices/user.slice";

const Appointment = () => {
  const { userInfo } = useAppSelector((state) => state.auth);

  const { data, isLoading, isSuccess, refetch } = useGetUserAppointmentsQuery(
    userInfo?._id
  );
  const [userAppointments, setUserAppointments] =
    useState<userAppointmentInfoProps[]>();

  useEffect(() => {
    if (data && isSuccess) {
      refetch();
      setUserAppointments(data?.data);
    }
  }, [data]);

  return (
    <>
      <Seo
        title="Your appointments"
        description="Appointments made with hospitals"
        keywords="appointments, hospital appointments"
      />
      <div className="w-screen h-screen bg-zinc-50">
        {isLoading ? (
          <Loader />
        ) : (
          <SidebarLayout>
            <section className="appointments my-5 w-full">
              <h3 className="font-bold text-2xl capitalize text-accent">
                Scheduled appointments
              </h3>
              <Text className="text-sm flex items-center gap-x-2">
                Your appointment with hospitals{" "}
                <span
                  className="bg-accent  text-center flex items-center justify-center font-bold h-6 w-6
             text-white rounded-full text-[12px]"
                >
                  <span className="text-[12px]">
                    {userAppointments?.length! > 100
                      ? `${99}+`
                      : userAppointments?.length!}
                  </span>
                </span>
              </Text>

              <section
                className={`appointment-container items-center justify-center w-full gap-10 ${
                  userAppointments?.length !== 0 && "flex flex-col md:grid"
                } sm:grid-cols-2 xl:grid-cols-3 my-8`}
              >
                {userAppointments?.length == 0 ? (
                  <div className="w-full mx-auto  p-4">
                    <Text className="text-center">No appointment found!</Text>
                  </div>
                ) : (
                  userAppointments?.map(
                    (appointment: AppointmentCardProps | any) => {
                      return (
                        <ApppointmentCard
                          key={appointment._id}
                          title={appointment.title}
                          description={appointment.description}
                          createdAt={appointment.createdAt}
                          startDate={appointment.startDate}
                          endDate={appointment.endDate}
                          _id={appointment._id}
                          userType="user"
                        />
                      );
                    }
                  )
                )}
              </section>
              <AppointmentButton />
            </section>
          </SidebarLayout>
        )}
      </div>
    </>
  );
};

export default Appointment;
