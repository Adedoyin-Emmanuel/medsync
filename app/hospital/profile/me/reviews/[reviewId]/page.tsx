"use client";

import React, { useEffect, useRef, useState } from "react";
import { HospitalSidebarNav } from "@/app/components/SidebarLayout";
import { SlBadge } from "react-icons/sl";
import Text from "@/app/components/Text";
import { LuTimer } from "react-icons/lu";
import { MdUpdate } from "react-icons/md";
import { TbMessage2Bolt } from "react-icons/tb";
import Modal from "@/app/components/Modal";
import Button from "@/app/components/Button";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/store/store";
import { useAppSelector } from "@/app/store/store";
import { useRouter } from "next/navigation";
import Loader from "@/app/components/Loader";
import {
  useGetReviewByIdQuery,
  saveSpecificReviewInfo,
  useGetUserByIdQuery,
  userDashboardInfoProps,
} from "@/app/store/slices/user.slice";
import { formatDateTime } from "@/app/helpers";
import moment from "moment";
import { GrLocation } from "react-icons/gr";
import { HiOutlineShieldCheck } from "react-icons/hi";
import Verified from "@/app/components/Verified";

import Seo from "@/app/components/Seo/Seo";

const page = ({ params }: { params: { reviewId: string } }) => {
  const viewUserModalRef = useRef<HTMLDialogElement | any>(null);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { userSpecificReviewInfo } = useAppSelector((state) => state.user);
  const [userDetails, setUserDetails] = useState<userDashboardInfoProps>();

  const {
    data: reviewData,
    isLoading: isReviewDataLoading,
    isError: isReviewDataError,
    isSuccess,
  } = useGetReviewByIdQuery(params.reviewId);

  const {
    data: hospitalData,
    isLoading: hospitalDataLoading,
    isError: hospitalDataError,
    refetch,
  } = useGetUserByIdQuery(userSpecificReviewInfo?.userId);

  useEffect(() => {
    if (isSuccess && reviewData) {
      dispatch(saveSpecificReviewInfo(reviewData.data));

      const refetchData = async () => {
        const response = await refetch();
        return response;
      };

      refetchData().then((data) => {});
      setUserDetails(hospitalData?.data);
    }
  }, [reviewData, params.reviewId, hospitalData]);

  const viewAllReviews = () => {
    router.back();
  };
  return (
    <>
      <Seo
        title={`${userDetails?.name}'s Review`}
        description="Your review with your user"
      />
      <div className="w-screen h-screen bg-zinc-50">
        {isReviewDataLoading || hospitalDataLoading ? (
          <Loader />
        ) : isReviewDataError || hospitalDataError ? (
          <section className="w-full flex items-center flex-col ">
            <Text className="my-5">Couldn't get review details 😥</Text>
            <section className="my-5">
              <Button onClick={viewAllReviews}>All reviews</Button>
            </section>
          </section>
        ) : (
          <HospitalSidebarNav>
            <section className="w-full">
              <section className="review-header my-5">
                <h3 className="font-bold text-[18px]  capitalize">
                  <span className="text-accent">
                    {" "}
                    {`${userDetails?.name}'s`}
                  </span>{" "}
                  Review
                </h3>
              </section>

              <section className="review-container xl:w-2/4">
                <section
                  className={`review bg-gray-100 transition-colors ease-in hover:bg-purple-100 flex items-center justify-between p-4 rounded cursor-pointer my-4`}
                >
                  <section className="icon bg-accent text-white p-3 flex items-center justify-center rounded">
                    <SlBadge className="w-6 h-6" />
                  </section>

                  <section className="other-content w-11/12 flex items-center justify-around">
                    <Text className="text-sm">
                      {
                        formatDateTime(userSpecificReviewInfo?.createdAt!)
                          .formattedDate
                      }
                    </Text>
                    <Text className="text-sm font-bold" noCapitalize={true}>
                      @{userDetails?.username}
                    </Text>
                  </section>
                </section>
              </section>

              <section className="review-details  flex flex-col items-start my-5 md:w-1/2 xl:w-2/4">
                <h3 className="font-bold text-[17px]  capitalize">details</h3>

                <section className="flex items-center justify-center gap-x-2 my-1">
                  <LuTimer className="w-5 h-5" />

                  <Text className="text-sm">
                    created{" "}
                    {moment(new Date(userSpecificReviewInfo?.createdAt!))
                      .startOf("seconds")
                      .fromNow()}
                  </Text>
                </section>

                <section className="flex items-center justify-center gap-x-2 my-1">
                  <MdUpdate className="w-5 h-5" />

                  <Text className="text-sm">
                    updated{" "}
                    {moment(new Date(userSpecificReviewInfo?.updatedAt!))
                      .startOf("seconds")
                      .fromNow()}
                  </Text>
                </section>

                <section className="flex items-center justify-center gap-x-2 my-1">
                  <TbMessage2Bolt className="w-5 h-5" />

                  <Text className="text-sm">
                    {" "}
                    {userSpecificReviewInfo?.message}
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
                </div>
              </dialog>
            </section>
          </HospitalSidebarNav>
        )}
      </div>
    </>
  );
};

export default page;
