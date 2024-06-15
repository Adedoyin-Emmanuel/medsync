"use client";
import Button from "@/app/components/Button";
import Loader from "@/app/components/Loader";
import SidebarLayout from "@/app/components/SidebarLayout";
import Text from "@/app/components/Text";
import React, { useState, useEffect } from "react";
import "@smastrom/react-rating/style.css";
import { Rating as ReactRating } from "@smastrom/react-rating";
import {
  useCreateReviewMutation,
  useGetHospitalByIdQuery,
  saveHospitalSearchProfileInfo,
} from "@/app/store/slices/user.slice";
import { useAppSelector } from "@/app/store/store";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/store/store";
import Seo from "@/app/components/Seo/Seo";

const Review = () => {
  const [userRating, setUserRating] = useState<number>(0);
  const [createReview, { isLoading }] = useCreateReviewMutation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const hospitalId = searchParams.get("hId");
  const {
    data: hospitalData,
    isLoading: isHospitalDataLoading,
    isError,
  } = useGetHospitalByIdQuery(hospitalId);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (hospitalData) {
      dispatch(saveHospitalSearchProfileInfo(hospitalData.data));
    }
  }, [hospitalData]);

  const { userDashboardInfo, hospitalSearchProfileInfo } = useAppSelector(
    (state) => state.user
  );

  const [formData, setFormData] = useState({
    message: "",
  });

  const handleInputChange = (e: React.FormEvent<HTMLFormElement> | any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    //validations
    if (formData.message == "") return toast.error("Message cannot be empty!");
    if (userRating == 0) return toast.error("Rating must be greater than 0");

    const dataToSubmit = {
      rating: userRating,
      userId: userDashboardInfo?._id,
      hospitalId,
      message: formData.message,
    };

    //submit the review
    try {
      const response: any = await createReview(dataToSubmit).unwrap();

      //check if the response is legit
      if (response?.data) {
        toast.success(response.message);
      } else {
        toast.error(response.error.message);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || error.error || error?.data);
    }
  };

  const handleGoBack = () => {
    router.back();
  };
  return (
    <>
      <Seo
        title={`Reviewing ${
          hospitalSearchProfileInfo?.clinicName
            ? hospitalSearchProfileInfo?.clinicName
            : "Hospital"
        }`}
        description="Review a hospital on caresync"
        keywords="hospital, review, caresync, hospital review"
      />
      <div className="w-screen h-screen bg-zinc-50">
        {isLoading || isHospitalDataLoading ? (
          <Loader />
        ) : isError ? (
          <section className="w-full flex items-center flex-col ">
            <Text className="my-5">Couldn't get hospital details 😥</Text>
            <section className="my-5">
              <Button onClick={handleGoBack}>Go back</Button>
            </section>
          </section>
        ) : (
          <SidebarLayout>
            <section className="new-appointment w-full">
              <section className="w-11/12 md:w-3/4 xl:w-2/4 mx-auto my-8">
                <section className="header my-10">
                  <h3 className="font-bold text-2xl capitalize text-accent">
                    submit review
                  </h3>
                  <Text className="text-sm">
                    submitting a review for{" "}
                    <span className="font-bold text-accent">
                      {hospitalSearchProfileInfo?.clinicName}
                    </span>
                    <span className="text-accent font-bold"></span>
                  </Text>
                </section>
                <form className="w-full" onSubmit={handleSubmit}>
                  <section className="my-5 mb-6">
                    <label htmlFor="description" className="text-md block my-2">
                      Star Rating
                    </label>
                    <ReactRating
                      style={{ maxWidth: 220 }}
                      value={userRating}
                      onChange={setUserRating}
                    />
                  </section>

                  <section className="my-5 mb-6">
                    <label htmlFor="description" className="text-md block my-2">
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
                    <Button disabled={isLoading}>submit review</Button>
                  </section>
                </form>
              </section>
            </section>
          </SidebarLayout>
        )}
      </div>
    </>
  );
};

export default Review;
