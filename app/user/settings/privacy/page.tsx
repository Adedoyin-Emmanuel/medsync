"use client";
import React from "react";
import { useRouter } from "next/navigation";
import SidebarLayout from "@/app/components/SidebarLayout";
import Seo from "@/app/components/Seo/Seo";
import Text from "@/app/components/Text";
import { GrLocation } from "react-icons/gr";
import { HiOutlineShieldCheck } from "react-icons/hi";
import Verified from "@/app/components/Verified";
import Modal from "@/app/components/Modal";
import { SlBadge } from "react-icons/sl";
import Button from "@/app/components/Button";
import Axios from "@/app/api/axios";
import toast from "react-hot-toast";
import Loader from "@/app/components/Loader";

import {
  useGetAllHospitalsWithUserMedicalRecordAccessQuery,
  useRemoveHospitalFromUserMedicalRecordAccessMutation,
  hospitalProps,
} from "@/app/store/slices/user.slice";
import { useAppSelector } from "@/app/store/store";
import Link from "next/link";

const Privacy = () => {
  const modalRef = React.useRef<HTMLDialogElement | any>();
  const [modalContent, setModalContent] = React.useState<React.ReactNode>();
  const { userDashboardInfo } = useAppSelector((state) => state.user);
  const router = useRouter();

  const { data, isLoading, isError, error, isSuccess, refetch } =
    useGetAllHospitalsWithUserMedicalRecordAccessQuery(userDashboardInfo?._id);

  const [hospitals, setHospitals] = React.useState<hospitalProps[]>([]);

  const [
    removeHospitalFromUserMedicalRecordAccess,
    {
      isLoading: isRemoveHospitalUserRecordAccessLoading,
      isError: isRemoveHospitalRecordAccessError,
      error: removeHospitalFromUserMedicalRecordAccessError,
    },
  ] = useRemoveHospitalFromUserMedicalRecordAccessMutation();

  React.useEffect(() => {
    if (data && isSuccess) {
      refetch();
      setHospitals(data?.data);
    }
  }, [data]);

  const handleHospitalClick = async (id: string) => {
    const response = await Axios.get(`/hospital/${id}`);
    const { data } = response.data;

    const handleDeleteAccess = async () => {
      const response = await removeHospitalFromUserMedicalRecordAccess({
        userId: userDashboardInfo?._id,

        hospitalId: id,
      }).unwrap();

      try {
        if (response) {
          toast.success(response.message);
          router.push("/user/settings/privacy");
        }
      } catch (error: any) {
        console.log(error);
        toast.error(error?.data?.message || error.error || error?.data);
      }
    };

    setModalContent(
      <section className="hospital-profile w-full my-5">
        <section className="profile-header w-full flex flex-col items-center">
          <div className="avatar cursor-pointer">
            <div className="w-24 rounded-full">
              <img src={data?.profilePicture} alt="hospital profile image" />
            </div>
          </div>

          <section className="profile w-full p-1 md:p-0">
            <section className="hospital-name w-full flex items-center justify-between mt-5">
              <h3 className="font-bold text-[20px] capitalize flex items-center gap-x-1">
                {data?.clinicName}
                <span> {data?.isVerified && <Verified big={true} />}</span>
              </h3>
            </section>

            <Text noCapitalize className="text-sm">
              @{data?.username}
            </Text>

            <Text className="text-sm mt-2">{data?.bio}</Text>

            <section className="other-details w-full flex flex-col items-start my-5">
              <section className="location flex items-center justify-center gap-x-2 my-1">
                <GrLocation className="w-5 h-5" />
                <Text className="text-sm">
                  {data?.location || "lagos nigeria"}
                </Text>
              </section>

              <section className="checkups flex items-center justify-center gap-x-2 my-1">
                <HiOutlineShieldCheck className="w-5 h-5" />
                <Text className="text-sm">
                  {data?.healthCareHistory.length} total checkups
                </Text>
              </section>

              <section className="review flex items-center justify-center gap-x-2 my-1">
                <SlBadge className="w-5 h-5" />
                <Text className="text-sm">{data?.reviews.length} reviews</Text>
              </section>
            </section>
          </section>
        </section>
        <br />
        <Button
          className="bg-red-400 hover:bg-red-500"
          onClick={handleDeleteAccess}
        >
          Delete Access
        </Button>
      </section>
    );

    if (modalRef && modalRef.current && response?.data) {
      modalRef.current.showModal();
    }
  };

  React.useEffect(() => {
    if (
      isRemoveHospitalRecordAccessError ||
      isError ||
      isRemoveHospitalRecordAccessError
    ) {
      // @ts-ignore
      const message = error?.data?.message;

      const message2 =
        // @ts-ignore
        removeHospitalFromUserMedicalRecordAccessError?.data?.message;
      isError && toast.error(message);
      isRemoveHospitalRecordAccessError && toast.error(message2);
    }
  }, [isError, isRemoveHospitalRecordAccessError]);

  return (
    <>
      <Seo
        title="Privacy"
        description="Manage hospitals that have access to your medical records"
      />
      <SidebarLayout>
        {isLoading || isRemoveHospitalUserRecordAccessLoading ? (
          <Loader />
        ) : isError || isRemoveHospitalRecordAccessError ? (
          <section className="w-full flex items-center flex-col ">
            <Text className="my-5">
              {isError
                ? // @ts-ignore
                  (error?.data?.message as string)
                : isRemoveHospitalRecordAccessError
                ? // @ts-ignore
                  (removeHospitalFromUserMedicalRecordAccessError?.data
                    ?.message as string)
                : "An error occured"}
            </Text>
            <section className="my-5">
              <Link href={`/user/settings`}>
                {" "}
                <Button>Go back</Button>
              </Link>
            </section>
          </section>
        ) : (
          <section>
            <h3 className="font-bold text-2xl capitalize text-accent">
              Privacy settings
            </h3>
            <Text className="text-sm flex items-center gap-x-2">
              Manage hospitals that've access to your medical records
              <span
                className="bg-accent  text-center flex items-center justify-center font-bold h-6 w-6
             text-white rounded-full text-[12px]"
              >
                <span className="text-[12px]">
                  {hospitals.length > 100 ? "99+" : hospitals.length}
                </span>
              </span>
            </Text>

            <section className="all-hospitals xl:w-2/4">
              <br />

              {hospitals.length == 0 ? (
                <Text className="text-center">No hospital found</Text>
              ) : (
                hospitals.map((hospital, index) => {
                  return (
                    <section
                      key={index}
                      className="bg-gray-100 transition-colors ease-in hover:bg-purple-100 flex items-center justify-between p-4 rounded cursor-pointer my-4 "
                      onClick={() => {
                        handleHospitalClick(hospital?._id);
                      }}
                    >
                      <img
                        src={hospital.profilePicture}
                        className="w-12 h-12 rounded-full"
                      />

                      <Text noCapitalize>@{hospital.username}</Text>

                      <Text>{hospital.clinicName}</Text>
                    </section>
                  );
                })
              )}

              <Modal ref={modalRef}>{modalContent}</Modal>
            </section>
          </section>
        )}
      </SidebarLayout>
    </>
  );
};

export default Privacy;
