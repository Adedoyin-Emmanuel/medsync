"use client";
import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import Loader from "@/app/components/Loader";
import Text from "@/app/components/Text";
import { useForgotPasswordMutation } from "@/app/store/slices/user.slice";
import Link from "next/link";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Seo from "@/app/components/Seo/Seo";

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
    userType: "user",
  });

  const handleInputChange = (e: React.FormEvent<HTMLFormElement> | any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      //
      const response: any = await forgotPassword(formData);
      if (response.data) {
        toast.success(response.data.message);
      } else {
        toast.error(response.error.data.message);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || error.error || error?.data);
    }
  };
  return (
    <>
      <Seo
        title="Forgot password"
        description="Forgot your account password"
        keywords="forgot password"
      />
      <section className="w-screen h-screen flex items-center justify-center">
        {isLoading && <Loader />}
        <form
          className="w-11/12 md:w-1/2 xl:w-1/4"
          onSubmit={(e) => {
            handleForgotPassword(e);
          }}
        >
          <section className="header-section my-8">
            <h3 className="text-3xl capitalize font-bold text-secondary">
              forgot password
            </h3>
            <p>Connnecting you to better health</p>
          </section>

          <section className="my-4 mb-5">
            <label htmlFor="email" className="text-md block my-2">
              Email
            </label>
            <Input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </section>
          <section className="my-4 mb-5">
            <label htmlFor="signupAs" className="text-md block my-2">
              User Type
            </label>
            <select
              className="select border-2 border-gray-300 focus:outline-none rounded-md w-full h-16"
              name="userType"
              value={formData.userType}
              onChange={handleInputChange}
            >
              <option value="user">User</option>
              <option value="hospital">Hospital</option>
            </select>
          </section>

          <section className="mt-4 mb-2 w-full">
            <Button disabled={isLoading}>send email</Button>
          </section>

          <section>
            <Text className="inline">
              Got no account?
              <Link
                className="capitalize text-secondary px-1"
                href={"/auth/signup"}
              >
                create account
              </Link>
            </Text>
          </section>
        </form>
      </section>
    </>
  );
};

export default ForgotPassword;
