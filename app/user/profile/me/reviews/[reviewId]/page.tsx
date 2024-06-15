"use client";

import React, { useEffect, useRef, useState } from "react";
import SidebarLayout from "@/app/components/SidebarLayout";
import { SlBadge } from "react-icons/sl";
import Text from "@/app/components/Text";
import { BsPen } from "react-icons/bs";
import { AiOutlineDelete } from "react-icons/ai";
import { LuTimer } from "react-icons/lu";
import { MdUpdate } from "react-icons/md";
import { TbMessage2Bolt } from "react-icons/tb";
import Modal from "@/app/components/Modal";
import Button from "@/app/components/Button";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/store/store";
import { useAppSelector } from "@/app/store/store";
import { useRouter } from "next/navigation";
import Loader, { LoaderSmall } from "@/app/components/Loader";
import {
  useGetReviewByIdQuery,
  saveSpecificReviewInfo,
  useGetHospitalByIdQuery,
  hospitalProps,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} from "@/app/store/slices/user.slice";
import { formatDateTime } from "@/app/helpers";
import moment from "moment";
import toast from "react-hot-toast";
import "@smastrom/react-rating/style.css";
import { Rating as ReactRating } from "@smastrom/react-rating";
import Verified from "@/app/components/Verified";
import { GrLocation } from "react-icons/gr";
import { HiOutlineShieldCheck } from "react-icons/hi";
import Seo from "@/app/components/Seo/Seo";

const page = ({ params }: { params: { reviewId: string } }) => {
  const viewHospitalModalRef = useRef<HTMLDialogElement | any>(null);
  const deleteReviewModalRef = useRef<HTMLDialogElement | any>();
  const updateReviewModalRef = useRef<HTMLDialogElement | any>();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { userSpecificReviewInfo } = useAppSelector((state) => state.user);
  const [hospitalDetails, setHospitalDetails] = useState<hospitalProps>();
  const [updateReview, { isLoading: updateReviewLoading }] =
    useUpdateReviewMutation();

  const [deleteReview, { isLoading: deleteReviewLoading }] =
    useDeleteReviewMutation();

  const [formData, setFormData] = useState({
    message: userSpecificReviewInfo?.message,
  });
  const [userRating, setUserRating] = useState<number>(
    userSpecificReviewInfo?.rating!
  );

  const handleInputChange = (e: React.FormEvent<HTMLFormElement> | any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

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
  } = useGetHospitalByIdQuery(userSpecificReviewInfo?.hospitalId);

  useEffect(() => {
    if (isSuccess && reviewData) {
      dispatch(saveSpecificReviewInfo(reviewData.data));

      const refetchData = async () => {
        const response = await refetch();
        return response;
      };

      refetchData().then((data) => {});
      setHospitalDetails(hospitalData?.data);
    }
  }, [reviewData, params.reviewId, hospitalData]);

  const handleUpdateReviewClick = () => {
    if (updateReviewModalRef && updateReviewModalRef.current) {
      updateReviewModalRef?.current.showModal();
    }
  };

  const handleDeleteReviewClick = () => {
    if (deleteReviewModalRef && deleteReviewModalRef.current) {
      deleteReviewModalRef?.current.showModal();
    }
  };

  const handleUpdateReview = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    //validations
    if (formData.message == "") return toast.error("Message cannot be empty!");
    if (userRating == 0) return toast.error("Rating must be greater than 0");

    const dataToSubmit = {
      id: params.reviewId,
      body: {
        rating: userRating,
        message: formData.message,
      },
    };

    //update the review
    try {
      const response: any = await updateReview(dataToSubmit).unwrap();

      //check if the response is legit
      if (response?.data) {
        toast.success(response.message);
        router.back();
      } else {
        toast.error(response.error.message);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || error.error || error?.data);
    }
  };

  const handleDeleteReview = async () => {
    //delete the review
    try {
      const response: any = await deleteReview(params.reviewId).unwrap();

      //check if the response is legit
      if (response?.data) {
        toast.success(response.message);
        router.back();
      } else {
        toast.error(response.error.message);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || error.error || error?.data);
    }
  };

  const viewAllReviews = () => {
    router.back();
  };
  return (
    <>
      <Seo
        title={`${
          hospitalDetails?.clinicName
            ? hospitalDetails?.clinicName + "'s"
            : "Hospital"
        } Review`}
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
          <SidebarLayout>
            <section className="w-full">
              <section className="review-header my-5">
                <h3 className="font-bold text-[18px]  capitalize">
                  <span className="text-accent">
                    {" "}
                    {`${hospitalDetails?.clinicName}'s`}
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
                      @{hospitalDetails?.username}
                    </Text>
                  </section>
                </section>
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
                      onClick={handleUpdateReviewClick}
                    >
                      <BsPen className="w-4 h-4" />
                      <div>
                        <Text className="block">update</Text>
                      </div>
                    </section>
                    <section
                      className="flex items-center gap-x-3 p-2 cursor-pointer hover:bg-red-400 hover:text-white rounded-md transition-colors duration-100 ease-linear"
                      onClick={handleDeleteReviewClick}
                    >
                      <AiOutlineDelete className="w-4 h-4" />
                      <div>
                        <Text className="block">delete</Text>
                      </div>
                    </section>
                  </ul>
                </div>
              </section>

              <section className="review-details  flex flex-col items-start my-5 md:w-1/2 xl:w-2/4">
                <h3 className="font-bold text-[17px]  capitalize">details</h3>

                <section className="flex items-center justify-center gap-x-2 my-1">
                  <SlBadge className="w-5 h-5" />
                  <Text className="text-sm">
                    {""}
                    <ReactRating
                      style={{ maxWidth: 100 }}
                      value={userSpecificReviewInfo?.rating!}
                    />
                  </Text>
                </section>

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
              <Modal ref={updateReviewModalRef}>
                {updateReviewLoading ? (
                  <LoaderSmall />
                ) : (
                  <section className="w-full">
                    <section className="header my-10">
                      <h3 className="font-bold text-2xl capitalize text-accent">
                        update review
                      </h3>
                      <Text className="text-sm">
                        updating review for{" "}
                        <span className="font-bold text-accent">
                          {hospitalDetails?.clinicName}
                        </span>
                        <span className="text-accent font-bold"></span>
                      </Text>
                    </section>
                    <form className="w-full" onSubmit={handleUpdateReview}>
                      <section className="my-5 mb-6">
                        <label
                          htmlFor="description"
                          className="text-md block my-2"
                        >
                          Star Rating
                        </label>
                        <ReactRating
                          style={{ maxWidth: 220 }}
                          value={userRating}
                          onChange={setUserRating}
                        />
                      </section>

                      <section className="my-5 mb-6">
                        <label
                          htmlFor="description"
                          className="text-md block my-2"
                        >
                          Message
                        </label>
                        <textarea
                          className="textarea border-2 border-gray-300 focus:outline-none rounded-md w-full textarea-md"
                          name="message"
                          placeholder="Enter appointment description"
                          value={formData.message}
                          onChange={handleInputChange}
                          rows={3}
                          required
                        ></textarea>
                      </section>

                      <section className="my-4 mb-5 w-full">
                        <Button disabled={updateReviewLoading}>
                          update review
                        </Button>
                      </section>
                    </form>
                  </section>
                )}
              </Modal>

              <Modal ref={deleteReviewModalRef}>
                <section className="cancel">
                  <h3 className="font-bold text-2xl capitalize text-accent">
                    delete review
                  </h3>
                  <p className="my-3">
                    Are you sure you want to delete this review? This an
                    irreversible process?
                  </p>

                  <section className="mt-8 w-full flex items-end justify-end">
                    <button
                      className="bg-red-400 capitalize p-2 rounded-md text-white text-sm"
                      onClick={handleDeleteReview}
                    >
                      Delete review
                    </button>
                  </section>
                </section>
              </Modal>
            </section>
          </SidebarLayout>
        )}
      </div>
    </>
  );
};

export default page;
