"use client";

import React from "react";
import { HospitalSidebarNav } from "@/app/components/SidebarLayout";
import Seo from "@/app/components/Seo/Seo";
import Link from "next/link";
import Text from "@/app/components/Text";
import { useGetMedicalRecordsByUserIdQuery } from "@/app/store/slices/user.slice";
import { useGetUserByIdQuery } from "@/app/store/slices/user.slice";

import { medicalRecordsProps } from "@/app/store/slices/user.slice";
import { userDashboardInfoProps } from "@/app/store/slices/user.slice";
import MedicalRecordCard from "@/app/components/MedicalRecordCard/MedicalRecordCard";
import { useAppSelector } from "@/app/store/store";
import Loader from "@/app/components/Loader";
import Button from "@/app/components/Button";

import toast from "react-hot-toast";

const MedicalRecords = () => {
  const { userSpecificAppointmentInfo } = useAppSelector((state) => state.user);

  const { data, isLoading, isError, error, refetch } =
    useGetMedicalRecordsByUserIdQuery({
      userId: userSpecificAppointmentInfo?.userId,
      hospitalId: userSpecificAppointmentInfo?.hospitalId,
    });

  const {
    data: userData,
    isLoading: isUserDataLoading,
    isError: isUserDataError,
    error: userDataError,
    refetch: userDataRefetch,
  } = useGetUserByIdQuery(userSpecificAppointmentInfo?.userId);

  const [medicalRecords, setMedicalRecords] =
    React.useState<medicalRecordsProps[]>();
  const [totalMedicalRecords, setTotalMedicalRecords] =
    React.useState<number>(0);

  const [userDetails, setUserDetails] =
    React.useState<userDashboardInfoProps>();

  React.useEffect(() => {
    if (data && userData) {
      refetch();
      userDataRefetch();
      setMedicalRecords(data?.data);
      setTotalMedicalRecords(data?.data.length);
      setUserDetails(userData?.data);
    }
  }, [data, userData]);

  React.useEffect(() => {
    if (isError || isUserDataError) {
      // @ts-ignore
      const message = error?.data?.message;

      // @ts-ignore
      const message2 = userDataError?.data?.message;
      isError && toast.error(message);
      isUserDataError && toast.error(message2);
    }
  }, [isError, isUserDataError]);

  return (
    <>
      <Seo
        title={`${
          userDetails?.name ? userDetails?.name : "User"
        }'s medical records`}
        description={`Viewing ${
          userDetails?.name ? userDetails?.name : "User"
        }'s medical records `}
        keywords="View medical records, user medical records"
      />
      <HospitalSidebarNav>
        {isLoading || isUserDataLoading ? (
          <Loader />
        ) : isError || isUserDataError ? (
          <section className="w-full flex items-center flex-col ">
            <Text className="my-5">
              {isUserDataError
                ? // @ts-ignore
                  (userDataError?.data?.message as string)
                : isError
                ? // @ts-ignore
                  (error?.data?.message as string)
                : "Could not get user medical details"}
            </Text>
            <section className="my-5">
              <Link
                href={`/hospital/appointments/${userSpecificAppointmentInfo?._id}`}
              >
                {" "}
                <Button>Go back</Button>
              </Link>
            </section>
          </section>
        ) : (
          <section>
            <h3 className="font-bold text-2xl capitalize text-accent">
              Medical records
            </h3>
            <Text className="text-sm flex items-center gap-x-2">
              Viewing{" "}
              <span className="font-bold text-secondary">
                {userDetails?.name}'<span className="lowercase">s</span>
              </span>
              medical records{" "}
              <span
                className="bg-accent  text-center flex items-center justify-center font-bold h-6 w-6
             text-white rounded-full text-[12px]"
              >
                <span className="text-[12px]">
                  {totalMedicalRecords > 100 ? `${99}+` : totalMedicalRecords}
                </span>
              </span>
            </Text>

            <section
              className={`items-center justify-center w-full gap-10 ${
                totalMedicalRecords !== 0 && "flex flex-col md:grid"
              } sm:grid-cols-2 xl:grid-cols-3 my-8`}
            >
              {totalMedicalRecords == 0 ? (
                <div className="w-full mx-auto  p-4">
                  <Text className="text-center">No medical records found!</Text>
                </div>
              ) : (
                medicalRecords?.map((medicalRecord) => {
                  return (
                    <MedicalRecordCard
                      key={medicalRecord?._id}
                      createdAt={medicalRecord?.createdAt}
                      symptoms={medicalRecord?.symptoms}
                      diagnosis={medicalRecord?.diagnosis}
                      href={`/hospital/appointments/${userSpecificAppointmentInfo?._id}/medical-records/${medicalRecord?._id}`}
                    />
                  );
                })
              )}
            </section>
          </section>
        )}
      </HospitalSidebarNav>
    </>
  );
};

export default MedicalRecords;
