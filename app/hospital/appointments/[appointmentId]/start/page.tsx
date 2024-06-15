"use client";
import Button from "@/app/components/Button";
import Loader, { LoaderSmall } from "@/app/components/Loader";
import SidebarLayout from "@/app/components/SidebarLayout";
import Text from "@/app/components/Text";
import {
  saveUserSearchProfileInfo,
  saveUserSpecificAppointmentInfo,
  useGetAppointmentByIdQuery,
  useGetAppointmentTokenQuery,
  useGetUserByIdQuery,
} from "@/app/store/slices/user.slice";
import { AppDispatch, useAppSelector } from "@/app/store/store";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { isValidAppointment } from "@/app/helpers";
import Seo from "@/app/components/Seo/Seo";

const StartAppointment = () => {
  const pathName = usePathname();
  const router = useRouter();
  const serverUrl = "wss://caresync-y6vac96e.livekit.cloud";
  const urlParts = pathName.split("/");
  let appointmentId = urlParts[3];

  const dispatch = useDispatch<AppDispatch>();
  const [skip, setSkip] = useState<boolean>(true);

  const { data, isLoading, isError, refetch } =
    useGetAppointmentByIdQuery(appointmentId);
  const {
    userDashboardInfo,
    userSpecificAppointmentInfo,
    userSearchProfileInfo,
  } = useAppSelector((state) => state.user);
  const { data: userDetails } = useGetUserByIdQuery(
    userSpecificAppointmentInfo?.userId!
  );
  const [roomToken, setRoomToken] = useState();
  const [showButton, setShowButton] = useState(true);

  useEffect(() => {
    refetch();
    if (data && userDetails) {
      dispatch(saveUserSpecificAppointmentInfo(data.data));
      dispatch(saveUserSearchProfileInfo(userDetails.data));
    }
  }, [appointmentId, data, userDetails]);

  const dataToSend = {
    participantName: userDashboardInfo?.clinicName,
    roomName: userSpecificAppointmentInfo?._id,
  };

  const {
    data: tokenData,
    refetch: refetchToken,
    isLoading: tokenDataLoading,
    isError: tokenDataError,
  } = useGetAppointmentTokenQuery(dataToSend, {
    skip,
  });

  useEffect(() => {
    if (tokenData) {
      setRoomToken(tokenData.data);
    }
  }, [skip, tokenData]);

  const viewAllAppointments = () => {
    router.push("/hospital/appointments");
  };

  const handleJoinRoom = () => {
    if (userSpecificAppointmentInfo?.status === "success") {
      // check if appointment is valid
      if (
        isValidAppointment(
          userSpecificAppointmentInfo?.startDate!,
          userSpecificAppointmentInfo?.endDate!
        )
      ) {
        setSkip(false);
        setShowButton(false);
      } else {
        toast.error("Appointment is not valid!");
        viewAllAppointments();
      }
    } else if (userSpecificAppointmentInfo?.status === "failed") {
      toast.error("Cannot start a failed appointment!");
      viewAllAppointments();
    } else {
      toast.error("Cannot start a pending appointment");
      viewAllAppointments();
    }
  };

  return (
    <>
      <Seo
        title={`${userSpecificAppointmentInfo?.title}`}
        description={`${userSpecificAppointmentInfo?.description}`}
        keywords="Start appointment, meeting"
      />
      <div className="w-screen h-screen bg-zinc-50">
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <section className="w-full flex items-center flex-col ">
            <Text className="my-5">Couldn't get appointment details 😥</Text>
            <section className="my-5 w-full p-2 md:w-1/4 mx-auto">
              <Button onClick={viewAllAppointments}>All appointments</Button>
            </section>
          </section>
        ) : (
          <SidebarLayout>
            {tokenDataLoading ? (
              <LoaderSmall />
            ) : tokenDataError ? (
              <section className="w-full flex items-center flex-col ">
                <Text className="my-5">Couldn't join room 😥</Text>
                <section className="my-5 w-full p-2 md:w-1/4 mx-auto">
                  <Button onClick={viewAllAppointments}>
                    All appointments
                  </Button>
                </section>
              </section>
            ) : (
              <section className="create-room">
                <h3 className="font-bold text-2xl capitalize my-5">
                  appointment with{" "}
                  <span className="text-accent">
                    {userSearchProfileInfo?.name}
                  </span>
                </h3>

                <section
                  className={`button-container md:w-80 mx-auto my-5 ${
                    showButton ? "block" : "hidden"
                  }`}
                >
                  <Button onClick={handleJoinRoom} disabled={tokenDataLoading}>
                    join meeting room
                  </Button>
                </section>
              </section>
            )}
            <section className="meeting-area w-full h-full">
              {tokenData && (
                <LiveKitRoom
                  audio={true}
                  video={true}
                  token={roomToken}
                  serverUrl={serverUrl}
                  connectOptions={{ autoSubscribe: true }}
                  data-lk-theme="default"
                  style={{ height: "100vh" }}
                >
                  <VideoConference />
                </LiveKitRoom>
              )}
            </section>
          </SidebarLayout>
        )}
      </div>
    </>
  );
};

export default StartAppointment;
