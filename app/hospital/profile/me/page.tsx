"use client";
import Loader from "@/app/components/Loader";
import { HospitalSidebarNav } from "@/app/components/SidebarLayout";
import Text from "@/app/components/Text";
import Verified from "@/app/components/Verified";
import { useGetHospitalByIdQuery } from "@/app/store/slices/user.slice";
import { useAppSelector } from "@/app/store/store";

import moment from "moment";
import Link from "next/link";
import { GrLocation } from "react-icons/gr";
import { HiOutlineShieldCheck } from "react-icons/hi";
import { MdDateRange } from "react-icons/md";
import { SlBadge } from "react-icons/sl";
import ReviewButton from "@/app/components/ReviewButton/ReviewButton";

import Seo from "@/app/components/Seo/Seo";

export default function Me() {
  const { userDashboardInfo } = useAppSelector((state) => state.user);
  const { userInfo } = useAppSelector((state) => state.auth);
  const { isLoading, isError } = useGetHospitalByIdQuery(userInfo?._id);

  const dateCreated: any = userDashboardInfo && userDashboardInfo?.createdAt;

  return (
    <>
      <Seo title="Your profile" description="Your hospital profile" />
      <div className="w-screen h-screen bg-zinc-50">
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <Text>An error occured</Text>
        ) : (
          <HospitalSidebarNav>
            <section className=" my-5">
              <section className="w-full">
                <section className="w-full my-5">
                  <section className="w-full flex flex-col items-center">
                    <div className="avatar cursor-pointer">
                      <div className="w-24 rounded-full">
                        <img
                          className=""
                          src={userDashboardInfo?.profilePicture}
                          alt="hospital profile image"
                        />
                      </div>
                    </div>

                    <section className="profile w-full p-1 md:p-0 md:w-1/2 xl:w-2/6">
                      <section className="w-full flex items-center justify-between mt-5">
                        <h3 className="font-bold text-[20px] capitalize flex items-center gap-x-1">
                          {userDashboardInfo?.clinicName}
                          <span>
                            {" "}
                            {userDashboardInfo?.isVerified && (
                              <Verified big={true} />
                            )}
                          </span>
                        </h3>

                        <Link href={"/hospital/profile"}>
                          <section className="bg-accent rounded-[20px] text-sm py-1 px-3 text-white text-center capitalize cursor-pointer hover:bg-secondary transition-colors duration-100 ease-in">
                            update profile
                          </section>
                        </Link>
                      </section>

                      <Text noCapitalize className="text-sm">
                        @{userDashboardInfo?.username}
                      </Text>

                      <Text className="text-sm mt-2">
                        {userDashboardInfo?.bio}
                      </Text>

                      <section className="other-details w-full flex flex-col items-start my-5">
                        <section className="location flex items-center justify-center gap-x-2 my-1">
                          <GrLocation className="w-5 h-5" />
                          <Text className="text-sm">
                            {userDashboardInfo?.location || "Around the world"}
                          </Text>
                        </section>

                        <section className="location flex items-center justify-center gap-x-2 my-1">
                          <HiOutlineShieldCheck className="w-5 h-5" />
                          <Text className="text-sm">
                            {userDashboardInfo?.allTotalAppointments} total
                            checkups
                          </Text>
                        </section>

                        <section className="location flex items-center justify-center gap-x-2 my-1">
                          <SlBadge className="w-5 h-5" />
                          <Text className="text-sm">
                            {userDashboardInfo?.reviews.length} reviews
                          </Text>
                        </section>

                        <section className="date-joined flex items-center justify-center gap-x-2 my-1">
                          <MdDateRange className="w-5 h-5" />
                          <Text className="text-sm">
                            joined{" "}
                            {moment(new Date(dateCreated))
                              .startOf("days")
                              .fromNow()}{" "}
                          </Text>
                        </section>
                      </section>
                    </section>
                  </section>
                </section>
              </section>
            </section>
            <ReviewButton href="/hospital/profile/me/reviews" />
          </HospitalSidebarNav>
        )}
      </div>
    </>
  );
}
