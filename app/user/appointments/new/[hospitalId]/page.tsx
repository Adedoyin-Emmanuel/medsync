"use client";
import Button from "@/app/components/Button";
import Loader from "@/app/components/Loader";
import SidebarLayout from "@/app/components/SidebarLayout";
import Text from "@/app/components/Text";
import Verified from "@/app/components/Verified";
import {
  saveHospitalSearchProfileInfo,
  useGetHospitalByIdQuery,
} from "@/app/store/slices/user.slice";
import { AppDispatch, useAppSelector } from "@/app/store/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { GrLocation } from "react-icons/gr";
import { HiOutlineShieldCheck } from "react-icons/hi";
import { SlBadge } from "react-icons/sl";
import { useDispatch } from "react-redux";
import Seo from "@/app/components/Seo/Seo";

const ViewHospitalProfile = ({
  params,
}: {
  params: { hospitalId: string };
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { hospitalSearchProfileInfo } = useAppSelector((state) => state.user);
  const { data, isLoading, isError } = useGetHospitalByIdQuery(
    params.hospitalId
  );
  const router = useRouter();
  useEffect(() => {
    if (data) {
      dispatch(saveHospitalSearchProfileInfo(data.data));
    }
  }, [data]);

  const handleSearchHospital = () => {
    router.back();
  };

  return (
    <>
      <Seo title={`Appointment details`} description="Appointment details" />
      <div className="w-screen h-screen bg-zinc-50">
        <SidebarLayout>
          {isLoading ? (
            <Loader />
          ) : isError ? (
            <section className="w-full flex items-center flex-col ">
              <Text className="my-5">Couldn't get hospital details 😥</Text>
              <section className="my-5">
                <Button onClick={handleSearchHospital}>Search hospitals</Button>
              </section>
            </section>
          ) : (
            <section className="new-appointment w-full">
              <h3 className="font-bold text-2xl capitalize text-accent">
                View Profile
              </h3>
              <Text className="text-sm">
                viewing{" "}
                <span className="text-accent">
                  {hospitalSearchProfileInfo?.clinicName}'s
                </span>{" "}
                profile
              </Text>

              <section className="hospital-profile w-full my-5">
                <section className="profile-header w-full flex flex-col items-center">
                  <div className="avatar cursor-pointer">
                    <div className="w-24 rounded-full">
                      <img
                        className=""
                        src={hospitalSearchProfileInfo?.profilePicture}
                        alt="hospital profile image"
                      />
                    </div>
                  </div>

                  <section className="profile w-full p-1 md:p-0 md:w-1/2 xl:w-2/6">
                    <section className="hospital-name w-full flex items-center justify-between mt-5">
                      <h3 className="font-bold text-[20px] capitalize flex items-center gap-x-1">
                        {hospitalSearchProfileInfo?.clinicName}
                        <span>
                          {" "}
                          {hospitalSearchProfileInfo?.isVerified && (
                            <Verified big={true} />
                          )}
                        </span>
                      </h3>

                      <Link
                        href={`/user/appointments/new/${params.hospitalId}/submit`}
                      >
                        <section className="submit-appointment bg-accent rounded-[20px] text-sm py-1 px-3 text-white text-center capitalize cursor-pointer hover:bg-secondary transition-colors duration-100 ease-in">
                          create appointment
                        </section>
                      </Link>
                    </section>

                    <Text noCapitalize className="text-sm">
                      @{hospitalSearchProfileInfo?.username}
                    </Text>

                    <Text className="text-sm mt-2">
                      {hospitalSearchProfileInfo?.bio}
                    </Text>

                    <section className="other-details w-full flex flex-col items-start my-5">
                      <section className="location flex items-center justify-center gap-x-2 my-1">
                        <GrLocation className="w-5 h-5" />
                        <Text className="text-sm">lagos nigeria</Text>
                      </section>

                      <section className="checkups flex items-center justify-center gap-x-2 my-1">
                        <HiOutlineShieldCheck className="w-5 h-5" />
                        <Text className="text-sm">
                          {hospitalSearchProfileInfo?.allTotalAppointments}{" "}
                          total checkups
                        </Text>
                      </section>

                      <section className="review flex items-center justify-center gap-x-2 my-1">
                        <SlBadge className="w-5 h-5" />
                        <Text className="text-sm">
                          {hospitalSearchProfileInfo?.reviews.length} reviews
                        </Text>
                      </section>
                    </section>
                  </section>
                </section>
              </section>
            </section>
          )}
        </SidebarLayout>
      </div>
    </>
  );
};

export default ViewHospitalProfile;
