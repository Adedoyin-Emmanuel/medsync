"use client";
import React from "react";
import SidebarLayout from "@/app/components/SidebarLayout";
import Seo from "@/app/components/Seo/Seo";
import Text from "@/app/components/Text";
import MedicalRecordCard from "@/app/components/MedicalRecordCard/MedicalRecordCard";
import { useGetCurrentUserMedicalRecordsQuery } from "@/app/store/slices/user.slice";
import Loader from "@/app/components/Loader";
import { medicalRecordsProps } from "@/app/store/slices/user.slice";
import { useAppSelector } from "@/app/store/store";

const MedicalRecords = () => {
  const [totalMedicalRecords, setTotalMedicalRecords] =
    React.useState<number>(0);
  const [medicalRecords, setMedicalRecords] =
    React.useState<medicalRecordsProps[]>();

  const { data, isLoading, isError, refetch } =
    useGetCurrentUserMedicalRecordsQuery({});
  const { userDashboardInfo } = useAppSelector((state) => state.user);

  React.useEffect(() => {
    if (data) {
      refetch();
      console.log(data);
      setMedicalRecords(data?.data);
      setTotalMedicalRecords(data?.data.length);
    }
  }, [data]);

  return (
    <>
      <Seo
        title="Medical records"
        description="Your medical records"
        keywords="medical records, records, health records"
      />

      <SidebarLayout>
        {isLoading ? (
          <Loader />
        ) : (
          <section className="w-full">
            {" "}
            <h3 className="font-bold text-2xl capitalize text-accent">
              Medical records
            </h3>
            <Text className="text-sm flex items-center gap-x-2">
              Your medical records
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
                      href={`/user/medical-records/${medicalRecord?._id}`}
                    />
                  );
                })
              )}
            </section>
          </section>
        )}
      </SidebarLayout>
    </>
  );
};

export default MedicalRecords;
