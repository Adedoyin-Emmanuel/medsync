"use client";
import Loader from "@/app/components/Loader";
import { HospitalSidebarNav } from "@/app/components/SidebarLayout";
import Text from "@/app/components/Text";
import React, { useState, useEffect } from "react";
import ReviewCard from "@/app/components/ReviewCard/ReviewCard";
import {
  useGetReviewByHospitalIdQuery,
  saveReviewInfo,
  reviewProps,
} from "@/app/store/slices/user.slice";
import { AppDispatch } from "@/app/store/store";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/app/store/store";
import Seo from "@/app/components/Seo/Seo";

const AllReviews = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const { userReviewInfo } = useAppSelector((state) => state.user);
  const { userInfo } = useAppSelector((state) => state.auth);

  const hospitalId = userInfo?._id;

  const { data, isLoading, isError, refetch } =
    useGetReviewByHospitalIdQuery(hospitalId);

  useEffect(() => {
    refetch();
    if (data) {
      console.log(data);
      dispatch(saveReviewInfo(data.data));
      setTotalReviews(data?.data.length);
    }
  }, [data]);

  return (
    <>
      <Seo title="All reviews" description="All reviews made by your users" />
      <div className="w-screen h-screen bg-zinc-50">
        {isLoading ? (
          <Loader />
        ) : (
          <HospitalSidebarNav>
            <section className="reviews my-5 w-full">
              <h3 className="font-bold text-2xl capitalize text-accent">
                Your reviews
              </h3>
              <Text className="text-sm flex items-center gap-x-2">
                reviews users made for your hospital
                <span
                  className="bg-accent  text-center flex items-center justify-center font-bold h-6 w-6
             text-white rounded-full text-[12px]"
                >
                  <span className="text-[12px]">
                    {userReviewInfo?.length! > 100
                      ? `${99}+`
                      : totalReviews == 0
                      ? 0
                      : userReviewInfo?.length}
                  </span>
                </span>
              </Text>

              <section
                className={`review-container items-center justify-center w-full gap-10 ${
                  totalReviews !== 0 && "flex flex-col md:grid"
                } sm:grid-cols-2 xl:grid-cols-3 my-8`}
              >
                {totalReviews == 0 ? (
                  <div className="w-full mx-auto  p-4">
                    <Text className="text-center">No reviews found!</Text>
                  </div>
                ) : (
                  userReviewInfo?.map((review: reviewProps) => {
                    return (
                      <ReviewCard
                        createdAt={review?.createdAt}
                        userType="user"
                        key={review?._id}
                        _id={review?._id}
                        message={review?.message}
                        hospitalId={review?.hospitalId}
                        userId={review?.userId}
                      />
                    );
                  })
                )}
              </section>
            </section>
          </HospitalSidebarNav>
        )}
      </div>
    </>
  );
};

export default AllReviews;
