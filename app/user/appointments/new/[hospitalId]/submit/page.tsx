"use client";
import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import Loader from "@/app/components/Loader";
import SidebarLayout from "@/app/components/SidebarLayout";
import Text from "@/app/components/Text";
import { getCurrentDateTime } from "@/app/helpers";
import { useCreateAppointmentMutation } from "@/app/store/slices/user.slice";
import { AppDispatch, useAppSelector } from "@/app/store/store";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import Seo from "@/app/components/Seo/Seo";

const SubmitAppointment = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    medicalRecordAccess: false,
  });

  const handleInputChange = (e: React.FormEvent<HTMLFormElement> | any) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [createAppointment, { isLoading, data }] =
    useCreateAppointmentMutation();
  const { userInfo } = useAppSelector((state) => state.auth);

  const { hospitalSearchProfileInfo } = useAppSelector((state) => state.user);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const startDate = new Date(formData.startDate!);
      const endDate = new Date(formData.startDate!);
      const endTime = new Date(formData.endDate!);

      // Update the end date with the selected end time
      endDate.setHours(endTime.getHours());
      endDate.setMinutes(endTime.getMinutes());

      if (
        startDate > endDate ||
        (startDate.getTime() === endDate.getTime() && startDate > endTime)
      ) {
        toast.error(
          "End date or time cannot be earlier than the start date or time"
        );
        return;
      }

      const dataToSubmit = {
        ...formData,
        userId: userInfo?._id,
        hospitalId: hospitalSearchProfileInfo?._id,
        endDate: endDate.toISOString(),
      };

      const response: any = await createAppointment(dataToSubmit).unwrap();
      if (response?.data) {
        toast.success(response.message);
        router.push("/user/appointments");
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error?.data?.message || error.error || error?.data);
    }
  };

  return (
    <>
      <Seo
        title={`Submit Appointment`}
        description="Submit appointment to hospital"
      />
      <div className="w-screen h-screen bg-zinc-50">
        <SidebarLayout>
          {isLoading ? (
            <Loader />
          ) : (
            <section className="new-appointment w-full">
              <section className="w-11/12 md:w-3/4 xl:w-2/4 mx-auto my-8">
                <form
                  className="w-full"
                  onSubmit={(e) => {
                    handleFormSubmit(e);
                  }}
                >
                  <section className="form-header my-5">
                    <h3 className="font-bold text-2xl capitalize text-accent">
                      Create appointment
                    </h3>
                    <Text className="text-sm">
                      submitting appointment request to{" "}
                      <span className="text-accent font-bold">
                        {hospitalSearchProfileInfo?.clinicName}
                      </span>
                    </Text>
                  </section>
                  <section className="my-4 mb-5">
                    <label htmlFor="name" className="text-md block my-2">
                      Appointment title
                    </label>
                    <Input
                      type="text"
                      name="title"
                      placeholder="Enter appointment title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="text-sm"
                    />
                  </section>

                  <section className="my-4 mb-5">
                    <label htmlFor="description" className="text-md block my-2">
                      Appointment description
                    </label>
                    <textarea
                      className="textarea border-2 border-gray-300 focus:outline-none rounded-md w-full textarea-md"
                      name="description"
                      placeholder="Enter appointment description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      required
                    ></textarea>
                  </section>

                  <section className="my-4 mb-5">
                    <label htmlFor="startDate" className="text-md block my-2">
                      Start date and time
                    </label>
                    <Input
                      type="datetime-local"
                      name="startDate"
                      value={formData.startDate}
                      min={getCurrentDateTime()}
                      onChange={handleInputChange}
                      required
                    />
                  </section>

                  <section className="my-4 mb-5">
                    <label htmlFor="email" className="text-md block my-2">
                      End date and time
                    </label>
                    <Input
                      type="datetime-local"
                      name="endDate"
                      value={formData.endDate}
                      min={getCurrentDateTime()}
                      onChange={handleInputChange}
                      required
                    />
                  </section>

                  <section className="my-4 mb-5">
                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="text-md">
                          Submit my medical records
                        </span>
                        <input
                          type="checkbox"
                          className="toggle toggle-secondary"
                          name="medicalRecordAccess"
                          onChange={handleInputChange}
                          checked={formData.medicalRecordAccess}
                        />
                      </label>
                    </div>
                  </section>
                  <section className="my-4 mb-5 w-full">
                    <Button disabled={isLoading}>create appointment</Button>
                  </section>
                </form>
              </section>
            </section>
          )}
        </SidebarLayout>
      </div>
    </>
  );
};

export default SubmitAppointment;
