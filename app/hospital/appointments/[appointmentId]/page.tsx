"use client";
import { AppointmentStartButton } from "@/app/components/AppointmentButton";
import { AppointmentLabel } from "@/app/components/AppointmentCard";
import Button from "@/app/components/Button";
import Loader from "@/app/components/Loader";
import Modal from "@/app/components/Modal";
import { HospitalSidebarNav } from "@/app/components/SidebarLayout";
import Text from "@/app/components/Text";
import Verified from "@/app/components/Verified";
import { formatDateTime } from "@/app/helpers";
import {
  saveUserSpecificAppointmentInfo,
  useApproveAppointmentMutation,
  useCancelAppointmentMutation,
  useDeleteAppointmentMutation,
  useGetAppointmentByIdQuery,
  useGetUserByIdQuery,
  userDashboardInfoProps,
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
import { ImCheckmark } from "react-icons/im";
import { LuTimer } from "react-icons/lu";
import { MdOutlineTitle, MdUpdate } from "react-icons/md";
import { SlBadge } from "react-icons/sl";
import { TbMessage2Bolt } from "react-icons/tb";
import { useDispatch } from "react-redux";
import Seo from "@/app/components/Seo/Seo";

const Appointment = ({ params }: { params: { appointmentId: string } }) => {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useGetAppointmentByIdQuery(
    params.appointmentId
  );
  const dispatch = useDispatch<AppDispatch>();
  const [userDetails, setUserDetails] = useState<userDashboardInfoProps>();
  const { userSpecificAppointmentInfo } = useAppSelector((state) => state.user);
  const [
    cancelAppointment,
    { isLoading: cancelAppointmentLoading, isError: cancelAppointmentError },
  ] = useCancelAppointmentMutation();
  const [
    deleteAppointment,
    { isLoading: deleteAppointmentLoading, isError: deleteAppointmentError },
  ] = useDeleteAppointmentMutation();

  const [
    approveAppointment,
    { isLoading: approveAppointmentLoading, isError: approveAppointmentError },
  ] = useApproveAppointmentMutation();

  const { data: clientData } = useGetUserByIdQuery(
    userSpecificAppointmentInfo?.userId
  );

  const viewUserModalRef = useRef<HTMLDialogElement | any>(null);
  const deleteAppointmentModalRef = useRef<HTMLDialogElement | any>();
  const cancelAppointmentModalRef = useRef<HTMLDialogElement | any>();
  const approveAppointmentModalRef = useRef<HTMLDialogElement | any>();

  useEffect(() => {
    if (data) {
      const refetchData = async () => {
        const response = await refetch();
        return response;
      };

      refetchData().then((data) => {});
      dispatch(saveUserSpecificAppointmentInfo(data.data));
      setUserDetails(clientData?.data);
    }
  }, [data, clientData]);

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

  const handleApproveAppointmentClick = () => {
    if (approveAppointmentModalRef && approveAppointmentModalRef.current) {
      approveAppointmentModalRef?.current.showModal();
    }
  };

  const handleApproveAppointment = async () => {
    try {
      const response: any = await approveAppointment({
        id: params.appointmentId,
      });

      if (response?.data) {
        toast.success(response.data.message);
        approveAppointmentModalRef?.current.closeModal();
        router.push("/hospital/appointments");

        /* we could decide to route the hospital to the meeting page
        I guess that makes more sense, I would figure that later*/
      } else {
        toast.error(response.error.data.message);
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
        router.push("/hospital/appointments");
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
        toast.success(response.data.message);
        router.push("/hospital/appointments");
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error?.data?.message || error.error || error?.data);
    }
  };

  const handleViewMedicalRecord = () => {
    router.push(
      `/hospital/appointments/${params.appointmentId}/medical-records`
    );
  };

  return (
    <>
      <Seo
        title={`Appointment with ${
          userDetails?.name ? userDetails?.name : "user"
        }`}
        description={`Your appointment with ${userDetails?.name}`}
        keywords="Appointment with user, user appointment"
      />
      <div className="w-screen h-screen bg-zinc-50">
        <HospitalSidebarNav>
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
                  <span className="text-accent">{userDetails?.name} </span>
                </h3>
              </section>
              <section className="appointment-details xl:w-2/4">
                <AppointmentLabel
                  key={userSpecificAppointmentInfo?.id}
                  userType="user"
                  status={userSpecificAppointmentInfo?.status!}
                  attender={userSpecificAppointmentInfo?.userId!}
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
                      onClick={handleApproveAppointmentClick}
                    >
                      <ImCheckmark className="w-4 h-4" />
                      <div>
                        <Text className="block">approve</Text>
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
                onClick={() => viewUserModalRef?.current.showModal()}
              >
                user profile
              </button>
              <dialog
                id="profile_modal"
                className="modal"
                ref={viewUserModalRef}
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
                            src={userDetails?.profilePicture}
                            alt="user profile image"
                          />
                        </div>
                      </div>

                      <section className="profile w-full p-1 md:p-0">
                        <section className="hospital-name w-full flex items-center justify-between mt-5">
                          <h3 className="font-bold text-[20px] capitalize flex items-center gap-x-1">
                            {userDetails?.name}
                            <span>
                              {" "}
                              {userDetails?.isVerified && (
                                <Verified big={true} />
                              )}
                            </span>
                          </h3>
                        </section>

                        <Text noCapitalize className="text-sm">
                          @{userDetails?.username}
                        </Text>

                        <Text className="text-sm mt-2">{userDetails?.bio}</Text>

                        <section className="other-details w-full flex flex-col items-start my-5">
                          <section className="location flex items-center justify-center gap-x-2 my-1">
                            <GrLocation className="w-5 h-5" />
                            <Text className="text-sm">
                              {userDetails?.location || "lagos nigeria"}
                            </Text>
                          </section>

                          <section className="checkups flex items-center justify-center gap-x-2 my-1">
                            <HiOutlineShieldCheck className="w-5 h-5" />
                            <Text className="text-sm">
                              {userDetails?.allTotalAppointments} total checkups
                            </Text>
                          </section>

                          <section className="review flex items-center justify-center gap-x-2 my-1">
                            <SlBadge className="w-5 h-5" />
                            <Text className="text-sm">
                              {userDetails?.reviews.length} reviews
                            </Text>
                          </section>
                        </section>
                      </section>
                    </section>
                  </section>

                  <Button className="" onClick={handleViewMedicalRecord}>
                    view medical records
                  </Button>
                </div>
              </dialog>
              <Modal ref={approveAppointmentModalRef}>
                <section className="cancel">
                  <h3 className="font-bold text-2xl capitalize text-accent">
                    approve appointment
                  </h3>
                  <p className="my-3">
                    Are you sure you want to approve this appointment?
                  </p>

                  <section className="mt-8 w-full flex items-end justify-end">
                    <button
                      className="bg-green-400 capitalize p-2 rounded-md text-white text-sm"
                      onClick={handleApproveAppointment}
                    >
                      approve appointment
                    </button>
                  </section>
                </section>
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
                href={`/hospital/appointments/${params.appointmentId}/start`}
              />
              <br /> <br /> <br />
            </section>
          )}
        </HospitalSidebarNav>
      </div>
    </>
  );
};

export default Appointment;
