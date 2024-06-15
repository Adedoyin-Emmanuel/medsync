"use client";

import React from "react";
import { useRouter } from "next/navigation";
import SidebarLayout from "@/app/components/SidebarLayout";
import Loader from "@/app/components/Loader";
import Seo from "@/app/components/Seo/Seo";
import Text from "@/app/components/Text";

import MedicalRecordLabel from "@/app/components/MedicalRecordLabel/MedicalRecordLabel";
import { LuTimer } from "react-icons/lu";
import { MdOutlineTitle, MdUpdate } from "react-icons/md";
import { TbMessage2Bolt } from "react-icons/tb";
import toast from "react-hot-toast";

import { BsPen } from "react-icons/bs";
import { AiOutlineDelete } from "react-icons/ai";
import moment from "moment";
import Modal from "@/app/components/Modal";
import AppointmentButton from "@/app/components/AppointmentButton";

import {
  useDeleteUserMedicalRecordsMutation,
  useGetMedicalRecordByIdQuery,
} from "@/app/store/slices/user.slice";
import { medicalRecordsProps } from "@/app/store/slices/user.slice";

const MedicalRecordId = ({
  params,
}: {
  params: { medicalRecordId: string };
}) => {
  const router = useRouter();

  const deleteRecordRef = React.useRef<HTMLDialogElement | any>(null);
  const [medicalRecordDetails, setMedicalRecordDetails] =
    React.useState<medicalRecordsProps>();
  const [
    deleteUserMedicalRecords,
    {
      isLoading: deleteMedicalRecordLoading,
      isError: deleteMedicalRecordError,
    },
  ] = useDeleteUserMedicalRecordsMutation();

  const {
    data: medicalRecordData,
    isLoading: medicalRecordDataLoading,
    isError: medicalDataError,
    isSuccess: medicalRecordSuccess,
    refetch,
  } = useGetMedicalRecordByIdQuery({
    id: params.medicalRecordId,
    hospitalId: "",
  });

  React.useEffect(() => {
    if (medicalRecordSuccess && medicalRecordData) {

      const refetchData = async () => {
        const response = await refetch();
        return response;
      };

      refetchData().then((data) => {});

      setMedicalRecordDetails(medicalRecordData?.data);
    }
  }, [medicalRecordData]);
  const handleDeleteDropdownClick = () => {
    if (deleteRecordRef && deleteRecordRef.current) {
      deleteRecordRef?.current.showModal();
    }
  };

  const handleDeleteRecordClick = async () => {
    try {
      const response: any = await deleteUserMedicalRecords({
        id: params.medicalRecordId,
      });

      if (response?.data) {
        console.log(response);
        toast.success(response.data.message);
        router.push("/user/medical-records");
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error?.data?.message || error.error || error?.data);
    }
  };

  return (
    <>
      <Seo title={`Medical record`} description="View your medical record" />
      <SidebarLayout>
        {medicalRecordDataLoading ? (
          <Loader />
        ) : (
          <section className="w-full">
            <section className="w-full">
              <h3 className="font-bold text-2xl capitalize text-accent">
                Medical record
              </h3>
              <Text className="text-sm flex items-center gap-x-2">
                Viewing{" "}
                <span className="text-secondary">
                  {medicalRecordDetails?.symptoms.length! > 30
                    ? `${medicalRecordDetails?.symptoms.substring(0, 30)} ...`
                    : medicalRecordData?.symptoms}
                </span>
              </Text>

              <section className="medical-record xl:w-2/4">
                <MedicalRecordLabel
                  createdAt={medicalRecordDetails?.createdAt!}
                  symptoms={medicalRecordDetails?.symptoms!}
                  href={`/user/medical-records/${medicalRecordDetails?._id}`}
                />
              </section>

              <section className="dropdown-container md:w-1/2 xl:w-2/4 flex items-end justify-end p-3">
                <div className="dropdown dropdown-left transform -translate-y-10 -translate-x-3">
                  <BsPen
                    tabIndex={0}
                    className="text-accent w-6 h-6 cursor-pointer"
                  />
                  <ul
                    tabIndex={0}
                    className="dropdown-content z-[1] menu p-2 bg-gray-100 rounded w-40"
                  >
                    <section
                      className="flex items-center gap-x-3 p-2 cursor-pointer hover:bg-red-400 hover:text-white rounded-md transition-colors duration-100 ease-linear"
                      onClick={handleDeleteDropdownClick}
                    >
                      <AiOutlineDelete className="w-4 h-4" />
                      <div>
                        <Text className="block">delete</Text>
                      </div>
                    </section>
                  </ul>
                </div>
              </section>
            </section>
            <Modal ref={deleteRecordRef}>
              <section className="cancel">
                <h3 className="font-bold text-2xl capitalize text-accent">
                  delete record
                </h3>
                <p className="my-3">
                  Are you sure you want to delete this record, this an
                  irreversible process?
                </p>

                <section className="mt-8 w-full flex items-end justify-end">
                  <button
                    className="bg-red-400 capitalize p-2 rounded-md text-white text-sm"
                    onClick={handleDeleteRecordClick}
                  >
                    delete record
                  </button>
                </section>
              </section>
            </Modal>
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
            <AppointmentButton />
          </section>
        )}
      </SidebarLayout>
    </>
  );
};

export default MedicalRecordId;
