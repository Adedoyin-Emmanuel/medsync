"use client";

import React from "react";
import { HospitalSidebarNav } from "@/app/components/SidebarLayout";
import Seo from "@/app/components/Seo/Seo";
import Loader from "@/app/components/Loader";
import { useGetMedicalRecordByIdQuery } from "@/app/store/slices/user.slice";
import { medicalRecordsProps } from "@/app/store/slices/user.slice";
import Text from "@/app/components/Text";
import { useAppSelector } from "@/app/store/store";
import {
  useGetUserByIdQuery,
  userDashboardInfoProps,
} from "@/app/store/slices/user.slice";
import MedicalRecordLabel from "@/app/components/MedicalRecordLabel/MedicalRecordLabel";
import { LuTimer } from "react-icons/lu";
import { MdOutlineTitle, MdUpdate } from "react-icons/md";
import { TbMessage2Bolt } from "react-icons/tb";
import moment from "moment";
import Link from "next/link";
import Button from "@/app/components/Button";
import toast from "react-hot-toast";

const MedicalRecordId = ({
  params,
}: {
  params: { medicalRecordId: string };
}) => {
  const { userSpecificAppointmentInfo } = useAppSelector((state) => state.user);
  const { data, isLoading, isError, error, isSuccess, refetch } =
    useGetMedicalRecordByIdQuery({
      id: params.medicalRecordId,
      hospitalId: userSpecificAppointmentInfo?.hospitalId,
    });
  const [medicalRecordDetails, setMedicalRecordDetails] =
    React.useState<medicalRecordsProps>();
  const [userDetails, setUserDetails] =
    React.useState<userDashboardInfoProps>();

  const {
    data: userData,
    isLoading: isUserDataLoading,
    isError: isUserDataError,
    isSuccess: isUserDetailsSuccess,
    refetch: refetchUserData,
    error: userDataError,
  } = useGetUserByIdQuery(userSpecificAppointmentInfo?.userId);
  React.useEffect(() => {
    if (data && isSuccess && userData && isUserDetailsSuccess) {
      refetch();

      setMedicalRecordDetails(data?.data);
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
        {isUserDataLoading || isLoading ? (
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
                <Button>Go back</Button>
              </Link>
            </section>
          </section>
        ) : (
          <section className="w-full">
            <h3 className="font-bold text-2xl capitalize text-accent">
              Medical records
            </h3>
            <Text className="text-sm flex items-center gap-x-2">
              Viewing{" "}
              <span className="font-bold text-secondary">
                {userDetails?.name}'<span className="lowercase">s</span>
              </span>
              medical record
            </Text>

            <section className="medical-record xl:w-2/4">
              <MedicalRecordLabel
                createdAt={medicalRecordDetails?.createdAt!}
                symptoms={medicalRecordDetails?.symptoms!}
                href={`/hospital/appointments/${userSpecificAppointmentInfo?._id}/medical-records/${medicalRecordDetails?._id}`}
              />
            </section>

            <br />
            <section className="flex flex-col items-start my-5 md:w-1/2 xl:w-2/4">
              <h3 className="font-bold text-[17px]  capitalize">details</h3>

              <section className="flex items-center justify-center gap-x-2 my-1">
                <MdOutlineTitle className="w-5 h-5" />
                <Text className="text-sm">
                  {medicalRecordDetails?.symptoms}
                </Text>
              </section>

              <section className="flex items-center justify-center gap-x-2 my-1">
                <LuTimer className="w-5 h-5" />

                <Text className="text-sm">
                  created{" "}
                  {moment(new Date(medicalRecordDetails?.createdAt!))
                    .startOf("seconds")
                    .fromNow()}
                </Text>
              </section>

              <section className="flex items-center justify-center gap-x-2 my-1">
                <MdUpdate className="w-5 h-5" />

                <Text className="text-sm">
                  updated{" "}
                  {moment(new Date(medicalRecordDetails?.updatedAt!))
                    .startOf("seconds")
                    .fromNow()}
                </Text>
              </section>

              <section className="flex flex-col  gap-x-2 my-1">
                <Text className="flex items-center gap-x-2 text-sm">
                  <TbMessage2Bolt className="w-5 h-5" />
                  Diagnosis
                </Text>
                <Text className="text-sm my-2">
                  {medicalRecordDetails?.diagnosis}
                </Text>
              </section>
            </section>
          </section>
        )}
      </HospitalSidebarNav>
    </>
  );
};

export default MedicalRecordId;
