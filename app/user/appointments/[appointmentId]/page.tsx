"use client";
import { AppointmentStartButton } from "@/app/components/AppointmentButton";
import { AppointmentLabel } from "@/app/components/AppointmentCard";
import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import Loader, { LoaderSmall } from "@/app/components/Loader";
import Modal from "@/app/components/Modal";
import SidebarLayout from "@/app/components/SidebarLayout";
import Text from "@/app/components/Text";
import Verified from "@/app/components/Verified";
import {
  formatDateTime,
  formatDateToInputValue,
  getCurrentDateTime,
} from "@/app/helpers";
import {
  hospitalProps,
  saveUserSpecificAppointmentInfo,
  useCancelAppointmentMutation,
  useDeleteAppointmentMutation,
  useGetAppointmentByIdQuery,
  useGetHospitalByIdQuery,
  useUpdateAppointmentMutation,
} from "@/app/store/slices/user.slice";
import { AppDispatch, useAppSelector } from "@/app/store/store";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineClose, AiOutlineDelete } from "react-icons/ai";
import { BiCalendarWeek } from "react-icons/bi";
import { BsPen } from "react-icons/bs";
import { GrLocation } from "react-icons/gr";
import { HiOutlineShieldCheck } from "react-icons/hi";
import { LuTimer } from "react-icons/lu";
import { MdOutlineTitle, MdUpdate } from "react-icons/md";
import { SlBadge } from "react-icons/sl";
import { TbMessage2Bolt } from "react-icons/tb";
import { useDispatch } from "react-redux";
import Seo from "@/app/components/Seo/Seo";

const Appointment = ({ params }: { params: { appointmentId: string } }) => {
  const router = useRouter();
  const { data, isLoading, isError, isSuccess, refetch } =
    useGetAppointmentByIdQuery(params.appointmentId);
  const dispatch = useDispatch<AppDispatch>();
  const [hospitalDetails, setHospitalDetails] = useState<hospitalProps>();
  const { userSpecificAppointmentInfo } = useAppSelector((state) => state.user);

  const { userDashboardInfo } = useAppSelector((state) => state.user);
  const [
    cancelAppointment,
    { isLoading: cancelAppointmentLoading, isError: cancelAppointmentError },
  ] = useCancelAppointmentMutation();
  const [
    deleteAppointment,
    { isLoading: deleteAppointmentLoading, isError: deleteAppointmentError },
  ] = useDeleteAppointmentMutation();

  const { data: hospitalData } = useGetHospitalByIdQuery(
    userSpecificAppointmentInfo?.hospitalId
  );

  const [updateAppointment, { isLoading: updateAppointmentLoading }] =
    useUpdateAppointmentMutation();

  const viewHospitalModalRef = useRef<HTMLDialogElement | any>(null);
  const deleteAppointmentModalRef = useRef<HTMLDialogElement | any>();
  const cancelAppointmentModalRef = useRef<HTMLDialogElement | any>();
  const updateAppointmentModalRef = useRef<HTMLDialogElement | any>();

  useEffect(() => {
    if (isSuccess && data) {
      const refetchData = async () => {
        const response = await refetch();
        return response;
      };

      refetchData().then((data) => {});
      dispatch(saveUserSpecificAppointmentInfo(data.data));

      const dataToStore = {
        title: data.data.title,
        description: data.data.description,
        status: data.data.status,
        startDate: formatDateToInputValue(data.data.startDate),
        endDate: formatDateToInputValue(data.data.endDate),
      };

      setFormData(dataToStore);
      setHospitalDetails(hospitalData?.data);
    }
  }, [data, hospitalData]);

  const [formData, setFormData]: any = useState({
    title: userSpecificAppointmentInfo?.title,
    description: userSpecificAppointmentInfo?.description,
    status: userSpecificAppointmentInfo?.status,
    startDate: formatDateToInputValue(userSpecificAppointmentInfo?.startDate!),
    endDate: formatDateToInputValue(userSpecificAppointmentInfo?.endDate!),
    medicalRecordAccess: userDashboardInfo?.medicalRecordsAccess.includes(
      // @ts-ignore
      userSpecificAppointmentInfo?.hospitalId
    ),
  });
  

  const viewAllAppointments = () => {
    router.back();
  };

  const handleDeleteAppointmentClick = () => {
    if (deleteAppointmentModalRef && deleteAppointmentModalRef.current) {
      deleteAppointmentModalRef?.current.showModal();
    }
  };

  const handleCancelAppointmentClick = () => {
    if (cancelAppointmentModalRef && cancelAppointmentModalRef.current) {
      cancelAppointmentModalRef.current.showModal();
    }
  };

  const handleUpdateAppointmentClick = () => {
    if (updateAppointmentModalRef && updateAppointmentModalRef.current) {
      updateAppointmentModalRef?.current.showModal();
    }
  };

  const handleInputChange = (e: React.FormEvent<HTMLFormElement> | any) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  const handleSubmitUpdatedAppointment = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    try {
      e.preventDefault();

      const startDate = new Date(formData.startDate!);
      const endDate = new Date(formData.startDate!);
      const endTime = new Date(formData.endDate!);

      // Update the end date with the selected end time
      endDate.setHours(endTime.getHours());
      endDate.setMinutes(endTime.getMinutes());

      const dataToSubmit = {
        ...formData,
        endDate: endDate.toISOString(),
      };

      /* check if the start date or start time is not less than the end date or time 
      For example, I should not be able to set my start time to be 9:40Pm and then set my endTime to 8:30Pm 
      that same day 🤣
    */

      if (
        startDate > endDate ||
        (startDate.getTime() === endDate.getTime() && startDate > endTime)
      ) {
        toast.error(
          "End date or time cannot be earlier than the start date or time"
        );
        return;
      }

      const legitDataToSubmit = {
        ...dataToSubmit,
        id: userSpecificAppointmentInfo?._id,
      };

      const response = await updateAppointment(legitDataToSubmit).unwrap();

      if (response?.data) {
        toast.success(response.message);
        router.push("/user/appointments");
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error?.data?.message || error.error || error?.data);
    }
  };

  const handleCancelAppointment = async () => {
    try {
      const response: any = await cancelAppointment({
        id: params.appointmentId,
      });

      if (response?.data) {
        toast.success(response.data.message);
        router.push("/user/appointments");
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error?.data?.message || error.error || error?.data);
    }
  };

  const handleDeleteAppointment = async () => {
    try {
      const response: any = await deleteAppointment({
        id: params.appointmentId,
      });

      if (response?.data) {
        console.log(response);
        toast.success(response.data.message);
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
        title={`Appointment with ${hospitalDetails?.clinicName}`}
        description="Appointment with hospital"
      />
      <div className="w-screen h-screen bg-zinc-50">
        <SidebarLayout>
          {isLoading || cancelAppointmentLoading || deleteAppointmentLoading ? (
            <Loader />
          ) : isError || cancelAppointmentError || deleteAppointmentError ? (
            <section className="w-full flex items-center flex-col ">
              <Text className="my-5">Couldn't get appointment details 😥</Text>
              <section className="my-5">
                <Button onClick={viewAllAppointments}>All appointments</Button>
              </section>
            </section>
          ) : (
            <section className="appointment-details w-full">
              <section className="appointment-header my-5">
                <h3 className="font-bold text-[18px]  capitalize">
                  appointment with{" "}
                  <span className="text-accent">
                    {hospitalDetails?.clinicName}{" "}
                  </span>
                </h3>
              </section>
              <section className="appointment-details xl:w-2/4">
                <AppointmentLabel
                  key={userSpecificAppointmentInfo?.id}
                  userType="hospital"
                  status={userSpecificAppointmentInfo?.status!}
                  attender={userSpecificAppointmentInfo?.hospitalId!}
                  _id={userSpecificAppointmentInfo?._id!}
                  href={``}
                  createdAt={userSpecificAppointmentInfo?.createdAt!}
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
                      className="flex items-center gap-x-3 p-2 cursor-pointer hover:bg-accent hover:text-white rounded-md transition-colors duration-100 ease-linear"
                      onClick={handleUpdateAppointmentClick}
                    >
                      <BsPen className="w-4 h-4" />
                      <div>
                        <Text className="block">update</Text>
                      </div>
                    </section>
                    <section
                      className="flex items-center gap-x-3 p-2 cursor-pointer hover:bg-yellow-300 hover:text-white rounded-md transition-colors duration-100 ease-linear"
                      onClick={handleCancelAppointmentClick}
                    >
                      <AiOutlineClose className="w-4 h-4" />
                      <div>
                        <Text className="block">cancel</Text>
                      </div>
                    </section>
                    <section
                      className="flex items-center gap-x-3 p-2 cursor-pointer hover:bg-red-400 hover:text-white rounded-md transition-colors duration-100 ease-linear"
                      onClick={handleDeleteAppointmentClick}
                    >
                      <AiOutlineDelete className="w-4 h-4" />
                      <div>
                        <Text className="block">delete</Text>
                      </div>
                    </section>
                  </ul>
                </div>
              </section>
              <section className="appointment-details  flex flex-col items-start my-5 md:w-1/2 xl:w-2/4">
                <h3 className="font-bold text-[17px]  capitalize">details</h3>

                <section className="flex items-center justify-center gap-x-2 my-1">
                  <MdOutlineTitle className="w-5 h-5" />
                  <Text className="text-sm">
                    {userSpecificAppointmentInfo?.title}
                  </Text>
                </section>

                <section className="flex items-center justify-center gap-x-2 my-1">
                  <LuTimer className="w-5 h-5" />

                  <Text className="text-sm">
                    created{" "}
                    {moment(new Date(userSpecificAppointmentInfo?.createdAt!))
                      .startOf("seconds")
                      .fromNow()}
                  </Text>
                </section>

                <section className="flex items-center justify-center gap-x-2 my-1">
                  <MdUpdate className="w-5 h-5" />

                  <Text className="text-sm">
                    updated{" "}
                    {moment(new Date(userSpecificAppointmentInfo?.updatedAt!))
                      .startOf("seconds")
                      .fromNow()}
                  </Text>
                </section>

                <section className="flex items-center justify-center gap-x-2 my-1">
                  <TbMessage2Bolt className="w-5 h-5" />

                  <Text className="text-sm">
                    {" "}
                    {userSpecificAppointmentInfo?.description}
                  </Text>
                </section>

                <section className="flex items-center justify-center gap-x-2 my-1">
                  <BiCalendarWeek className="w-5 h-5" />

                  <Text className="text-sm">
                    {" "}
                    {
                      formatDateTime(userSpecificAppointmentInfo?.startDate!)
                        .dateMonthYear
                    }{" "}
                    (
                    {
                      formatDateTime(userSpecificAppointmentInfo?.startDate!)
                        .hoursAndMinutes
                    }
                    {" - "}
                    {
                      formatDateTime(userSpecificAppointmentInfo?.endDate!)
                        .hoursAndMinutes
                    }
                    )
                  </Text>
                </section>
              </section>
              <button
                className="w-36 bg-accent p-2 capitalize  text-white rounded text-sm"
                onClick={() => viewHospitalModalRef?.current.showModal()}
              >
                hospital profile
              </button>
              <dialog
                id="profile_modal"
                className="modal"
                ref={viewHospitalModalRef}
              >
                <div className="modal-box">
                  <form method="dialog" className="modal-backdrop">
                    <button className="btn btn-sm btn-circle shadow-none border-none outline-none bg-gray-100 hover:bg-red-400 hover:text-white duration-100 transition-colors ease-linear absolute right-2 top-2">
                      ✕
                    </button>
                  </form>

                  <section className="hospital-profile w-full my-5">
                    <section className="profile-header w-full flex flex-col items-center">
                      <div className="avatar cursor-pointer">
                        <div className="w-24 rounded-full">
                          <img
                            src={hospitalDetails?.profilePicture}
                            alt="hospital profile image"
                          />
                        </div>
                      </div>

                      <section className="profile w-full p-1 md:p-0">
                        <section className="hospital-name w-full flex items-center justify-between mt-5">
                          <h3 className="font-bold text-[20px] capitalize flex items-center gap-x-1">
                            {hospitalDetails?.clinicName}
                            <span>
                              {" "}
                              {hospitalDetails?.isVerified && (
                                <Verified big={true} />
                              )}
                            </span>
                          </h3>
                        </section>

                        <Text noCapitalize className="text-sm">
                          @{hospitalDetails?.username}
                        </Text>

                        <Text className="text-sm mt-2">
                          {hospitalDetails?.bio}
                        </Text>

                        <section className="other-details w-full flex flex-col items-start my-5">
                          <section className="location flex items-center justify-center gap-x-2 my-1">
                            <GrLocation className="w-5 h-5" />
                            <Text className="text-sm">
                              {hospitalDetails?.location || "lagos nigeria"}
                            </Text>
                          </section>

                          <section className="checkups flex items-center justify-center gap-x-2 my-1">
                            <HiOutlineShieldCheck className="w-5 h-5" />
                            <Text className="text-sm">
                              {hospitalDetails?.allTotalAppointments} total
                              checkups
                            </Text>
                          </section>

                          <section className="review flex items-center justify-center gap-x-2 my-1">
                            <SlBadge className="w-5 h-5" />
                            <Text className="text-sm">
                              {hospitalDetails?.reviews.length} reviews
                            </Text>
                          </section>
                        </section>
                      </section>
                    </section>
                  </section>
                </div>
              </dialog>
              <Modal ref={updateAppointmentModalRef}>
                {updateAppointmentLoading ? (
                  <LoaderSmall />
                ) : (
                  <form
                    className="w-full"
                    onSubmit={(e) => {
                      handleSubmitUpdatedAppointment(e);
                    }}
                  >
                    <section className="form-header my-5">
                      <h3 className="font-bold text-2xl capitalize text-accent">
                        Update appointment
                      </h3>
                      <Text className="text-sm">
                        updating appointment request to{" "}
                        <span className="text-accent font-bold">
                          {hospitalDetails?.clinicName}{" "}
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
                      <label
                        htmlFor="description"
                        className="text-md block my-2"
                      >
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
                      <Button disabled={updateAppointmentLoading}>
                        update appointment
                      </Button>
                    </section>
                  </form>
                )}
              </Modal>
              <Modal ref={deleteAppointmentModalRef}>
                <section className="cancel">
                  <h3 className="font-bold text-2xl capitalize text-accent">
                    delete appointment
                  </h3>
                  <p className="my-3">
                    Are you sure you want to delete this appointment, this an
                    irreversible process?
                  </p>

                  <section className="mt-8 w-full flex items-end justify-end">
                    <button
                      className="bg-red-400 capitalize p-2 rounded-md text-white text-sm"
                      onClick={handleDeleteAppointment}
                    >
                      delete appointment
                    </button>
                  </section>
                </section>
              </Modal>
              <Modal ref={cancelAppointmentModalRef}>
                <section className="cancel">
                  <h3 className="font-bold text-2xl capitalize text-accent">
                    cancel appointment
                  </h3>
                  <p className="my-3">
                    Are you sure you want to cancel this appointment?
                  </p>

                  <section className="mt-8 w-full flex items-end justify-end">
                    <button
                      className="bg-yellow-400 capitalize p-2 rounded-md text-black text-sm"
                      onClick={handleCancelAppointment}
                    >
                      cancel appointment
                    </button>
                  </section>
                </section>
              </Modal>
              <AppointmentStartButton
                href={`/user/appointments/${params.appointmentId}/start`}
              />
              <br /> <br /> <br />
            </section>
          )}
        </SidebarLayout>
      </div>
    </>
  );
};

export default Appointment;
