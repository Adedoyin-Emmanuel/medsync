"use client";
import Button from "@/app/components/Button";
import SidebarLayout from "@/app/components/SidebarLayout";
import Text from "@/app/components/Text";
import React, { useState } from "react";
import "@smastrom/react-rating/style.css";
import { Rating as ReactRating } from "@smastrom/react-rating";
import Seo from "@/app/components/Seo/Seo";

const Review = () => {
  const [userRating, setUserRating] = useState<number>(0);
  const [formData, setFormData] = useState({
    message: "",
  });

  const handleInputChange = (e: React.FormEvent<HTMLFormElement> | any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <>
      <Seo title={`Submit review`} description="Submit user review" />
      <div className="w-screen h-screen bg-zinc-50">
        <SidebarLayout>
          <section className="new-appointment w-full">
            <section className="w-11/12 md:w-3/4 xl:w-2/4 mx-auto my-8">
              <form className="w-full">
                <section className="form-header my-5">
                  <h3 className="font-bold text-2xl capitalize text-accent">
                    submit review
                  </h3>
                  <Text className="text-sm">
                    submitting a review for{" "}
                    <span className="text-accent font-bold"></span>
                  </Text>
                </section>

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
                  <Button>submit review</Button>
                </section>
              </form>
            </section>
          </section>
        </SidebarLayout>
      </div>
    </>
  );
};

export default Review;
