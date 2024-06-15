"use client";
import React, { useState } from "react";
import SidebarLayout from "@/app/components/SidebarLayout";
import Seo from "@/app/components/Seo/Seo";
import Text from "@/app/components/Text";
import Input from "@/app/components/Input";
import Button from "@/app/components/Button";
import { LoaderSmall } from "@/app/components/Loader";
import toast from "react-hot-toast";
import Axios from "@/app/api/axios";
import Link from "next/link";
import MedicalRecord from "@/app/components/MedicalRecord/MedicalRecord";
import { useCreateMedicalRecordMutation } from "@/app/store/slices/user.slice";
import { useAppSelector } from "@/app/store/store";

const SymptomsChecker = () => {
  const [formData, setFormData] = useState({
    symptoms: "",
    gender: "male",
    birthYear: "",
  });

  const [claudeAIResponse, setClaudeAIResponse] = useState<string>("");
  const [isAIFetchingData, setIsAIFetchingData] = useState<boolean>(false);
  const [dataDonCome, setDataDonCome] = useState<boolean>(false); // This will control when to show the book appointment button
  const [createMedicalRecord, { isLoading, isError, isSuccess }] =
    useCreateMedicalRecordMutation();

  const { userDashboardInfo } = useAppSelector((state) => state.user);

  const handleInputChange = (e: React.FormEvent<HTMLFormElement> | any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmitButtonClick = async () => {
    console.log(formData);
    setIsAIFetchingData(true);
    setDataDonCome(false);

    const { birthYear, gender, symptoms } = formData;

    if (!symptoms || !birthYear || !gender)
      return toast.error("Please fill the necessary fields");

    try {
      const response = await Axios.post("/symptoms-checker", formData);

      setIsAIFetchingData(false);
      console.log(response);
      setClaudeAIResponse(response.data.data.completion);
      setDataDonCome(true);
    } catch (error: any) {
      setIsAIFetchingData(false);
      console.log(error);
      toast.error("Oh sugar! Something went wrong.");
    }
  };

  React.useEffect(() => {
    if (dataDonCome) {
      const saveMedicalRecord = async () => {
        const dataToSend = {
          userId: userDashboardInfo?._id,
          symptoms: formData?.symptoms,
          diagnosis: claudeAIResponse,
        };

        const response = await createMedicalRecord(dataToSend).unwrap();

        if (response) {
          toast.success(response.message);
        } else {
          toast.error("An error occured while saving medical record");
        }
      };

      saveMedicalRecord();
    }
  }, [dataDonCome]); // runs everytime the user checks their symptoms

  return (
    <>
      <Seo
        title="Symptoms Checker"
        description="Symptoms checker to help you identify potential health
                    conditions based on your symptoms"
        keywords="symptoms, symptoms checker,  health diagnosis"
      />
      <SidebarLayout>
        <section className="my-5 w-full">
          <h3 className="font-bold text-2xl capitalize text-accent">
            Symptoms checker
          </h3>
          <Text className="text-sm flex items-center gap-x-2">
            Identify potential health conditions based on your symptoms
          </Text>

          <section className="my-5 grid md:grid-cols-2 grid-cols-1 w-full">
            <section className="p-3 w-full border">
              <Text noCapitalize className="flex items-center gap-x-2">
                Enter symptoms
                <span
                  className="bg-accent  text-center flex items-center justify-center font-bold h-6 w-6
             text-white rounded-full text-[12px]"
                >
                  <span className="text-[12px]">1</span>
                </span>
              </Text>
              <br />
              <Input
                type="text"
                placeholder="Type your symptoms here"
                className=""
                name="symptoms"
                value={formData.symptoms}
                onChange={handleInputChange}
              />

              <select
                className="select border-2 border-gray-300 focus:outline-none rounded-md w-full my-5 h-16"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="child">Child</option>
              </select>

              <Input
                type="number"
                placeholder="Enter your birth year"
                name="birthYear"
                value={formData.birthYear}
                onChange={handleInputChange}
              />

              <section className="mt-4 w-full ">
                <Button
                  onClick={handleSubmitButtonClick}
                  disabled={isAIFetchingData}
                >
                  Submit
                </Button>
              </section>
            </section>

            <section className="w-full p-3 border">
              <Text noCapitalize className="flex items-center gap-x-2">
                Diagnosis
                <span
                  className="bg-accent  text-center flex items-center justify-center font-bold h-6 w-6
             text-white rounded-full text-[12px]"
                >
                  <span className="text-[12px]">2</span>
                </span>
              </Text>
              <br />

              <section
                className={`w-full ${
                  isAIFetchingData && "flex items-center justify-center"
                }`}
              >
                {isAIFetchingData ? <LoaderSmall /> : claudeAIResponse}
              </section>

              {dataDonCome && (
                <Link href={"/user/appointments/new"}>
                  <Button className={`my-4`}>Book an appointment</Button>
                </Link>
              )}
            </section>
          </section>
        </section>
        <MedicalRecord href="/user/medical-records" />
      </SidebarLayout>
    </>
  );
};

export default SymptomsChecker;
