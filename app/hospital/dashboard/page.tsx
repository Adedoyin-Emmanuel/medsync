"use client";

import { AppointmentLabel } from "@/app/components/AppointmentCard";
import Button from "@/app/components/Button";
import Loader, { LoaderSmall } from "@/app/components/Loader";
import { HospitalSidebarNav } from "@/app/components/SidebarLayout";
import Text from "@/app/components/Text";
import {
  saveAppointmentInfo,
  saveDashboardInfo,
  saveRecentAppointmentInfo,
  useGetHospitalQuery,
  useGetLatestAppointmentsQuery,
  userAppointmentInfoProps,
} from "@/app/store/slices/user.slice";
import { AppDispatch, useAppSelector } from "@/app/store/store";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { BsCameraVideo } from "react-icons/bs";
import { HiOutlineShieldCheck } from "react-icons/hi";
import { SlBadge } from "react-icons/sl";
import { useDispatch } from "react-redux";
import DashboardCard from "@/app/components/DashboardCard/DashboardCard";
import { HospitalDashboardQuickActions } from "@/app/components/DashboardQuickActions/DashboardQuickActions";
import Seo from "@/app/components/Seo/Seo";

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: hospitalData, isLoading } = useGetHospitalQuery({});
  const { userInfo } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const healthCareHistoryRef = useRef<HTMLDivElement | any>(null);

  let dataToPass = {
    id: userInfo?._id,
    limit: 5,
    userType: "hospital",
  };

  useEffect(() => {
    if (hospitalData) {
      dispatch(saveDashboardInfo(hospitalData?.data));
    }
  }, [hospitalData]);

  const { userDashboardInfo, recentAppointmentInfo } = useAppSelector(
    (state) => state.user
  );

  const { data: latestAppointmentData, isLoading: latestAppointmentLoading } =
    useGetLatestAppointmentsQuery(dataToPass);

  useEffect(() => {
    if (latestAppointmentData) {
      dispatch(saveAppointmentInfo(latestAppointmentData?.data));
      dispatch(saveRecentAppointmentInfo(latestAppointmentData?.data));
    }
  }, [latestAppointmentData]);

  const handleViewAppointmentClick = () => {
    router.push("/hospital/appointments/");
  };

  return (
    <>
      <Seo
        title="Hospital Dashboard"
        description="Hospital dashboard"
        keywords="hospital dashboard, dashboard"
      />
      <div className="w-screen h-screen bg-zinc-50">
        {isLoading ? (
          <Loader />
        ) : (
          <HospitalSidebarNav showWelcomeMesage={true}>
            <section className="general-container w-full items-start flex flex-col xl:flex-row gap-x-5">
              <section className="w-full p-1 flex md:hidden items-center justify-center">
                <DashboardCard
                  appointments={userDashboardInfo?.appointments?.length!}
                  className="mt-5"
                  healthcareHistoryRef={healthCareHistoryRef}
                  userType="hospital"
                />
              </section>

              <section className="w-full p-1 flex md:hidden items-center justify-center">
                <HospitalDashboardQuickActions />
              </section>

              <section className="first-section w-full xl:w-8/12 hidden md:flex flex-col items-center justify-center ">
                <section className="stats-container grid p-1 lg:grid-cols-3 gap-10 w-full">
                  <section className="bg-gray-100 h-28 w-52 rounded my-5 flex items-center flex-col justify-around cursor-pointer hover:bg-accent hover:text-white transition-colors duration-100 ease-in">
                    <BsCameraVideo className="w-8 h-8" />
                    <Text>
                      {userDashboardInfo?.appointments?.length}{" "}
                      {userDashboardInfo?.appointments?.length! > 1
                        ? "Appointments"
                        : "Appointment"}
                    </Text>
                  </section>

                  <section className="bg-gray-100 h-28 w-52 rounded my-5 flex items-center flex-col justify-around cursor-pointer hover:bg-accent hover:text-white transition-colors duration-100 ease-in">
                    <HiOutlineShieldCheck className="w-8 h-8" />
                    <Text>
                      {userDashboardInfo?.allTotalAppointments} total{" "}
                      {userDashboardInfo?.allTotalAppointments! > 1
                        ? "Checkups"
                        : "Checkup"}
                    </Text>
                  </section>
                  <section className="bg-gray-100 h-28 w-52 rounded my-5 flex items-center flex-col justify-around cursor-pointer hover:bg-accent hover:text-white transition-colors duration-100 ease-in">
                    <SlBadge className="w-8 h-8" />
                    <Text>
                      {userDashboardInfo?.reviews?.length} total{" "}
                      {userDashboardInfo?.reviews?.length! > 1
                        ? "Reviews"
                        : "Review"}
                    </Text>
                  </section>
                </section>

                <section className="health-care-history w-full my-5 p-2">
                  <h3 className="font-bold capitalize text-[18px] md:text-[20px]">
                    healthcare history
                  </h3>

                  {userDashboardInfo?.healthCareHistory?.length === 0 ? (
                    <Text className="text-center my-5">
                      No healthcare history
                    </Text>
                  ) : (
                    <Text>History dey</Text>
                  )}
                </section>
              </section>

              <section className="second-section w-full xl:w-4/12 mt-16 md:mt-0 grid grid-cols-1 items-center justify-center p-1 md:p-2 ">
                <section className="user-appointments">
                  <h3 className="font-bold capitalize text-[18px] md:text-[20px]">
                    recent appointments
                  </h3>

                  <section className="appointments mt-4">
                    {latestAppointmentLoading ? (
                      <LoaderSmall className="my-2" />
                    ) : recentAppointmentInfo?.length == 0 ? (
                      <Text className="text-center my-3">
                        No recent appointments
                      </Text>
                    ) : (
                      recentAppointmentInfo?.map(
                        (appointment: userAppointmentInfoProps) => {
                          return (
                            <AppointmentLabel
                              key={appointment._id}
                              userType="user"
                              status={appointment.status}
                              attender={appointment.userId!}
                              _id={appointment._id}
                              href={`/hospital/appointments/${appointment._id}`}
                              createdAt={appointment.createdAt}
                            />
                          );
                        }
                      )
                    )}
                    <section className="new-appointment w-full flex items-end justify-end my-5">
                      <Button
                        className="bg-accent"
                        onClick={handleViewAppointmentClick}
                      >
                        View appointments
                      </Button>
                    </section>
                  </section>
                </section>
              </section>

              <section className="health-care-history w-full md:hidden my-5 p-1">
                <h3 className="font-bold capitalize text-[18px] md:text-[20px]">
                  healthcare history
                </h3>

                {userDashboardInfo?.healthCareHistory?.length === 0 ? (
                  <Text className="text-center my-5 text-sm">
                    No healthcare history
                  </Text>
                ) : (
                  <Text>History dey</Text>
                )}
              </section>
            </section>
          </HospitalSidebarNav>
        )}
      </div>
    </>
  );
};

export default Home;
