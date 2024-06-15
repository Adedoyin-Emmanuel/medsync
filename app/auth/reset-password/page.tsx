"use client";
import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import Loader from "@/app/components/Loader";
import Text from "@/app/components/Text";
import { useResetPasswordMutation } from "@/app/store/slices/user.slice";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Seo from "@/app/components/Seo/Seo";

const ResetPassword = () => {
  const searchParams = useSearchParams();

  const userType = searchParams.get("userType");
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    password: "",
    userType,
    token,
  });

  const handleInputChange = (e: React.FormEvent<HTMLFormElement> | any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const router = useRouter();

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      //
      const response: any = await resetPassword(formData);
      if (response.data) {
        toast.success(response.data.message);
        router.push("/auth/login");
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
        title="Reset Password"
        description="Reset your Caresync account password"
        keywords="reset password, recover account"
      />
      <section className="w-screen h-screen flex items-center justify-center">
        {isLoading && <Loader />}
        <form
          className="w-11/12 md:w-1/2 xl:w-1/4"
          onSubmit={(e) => {
            handlePasswordReset(e);
          }}
        >
          <section className="header-section my-8">
            <h3 className="text-3xl capitalize font-bold text-secondary">
              reset password
            </h3>
            <p>Connnecting you to better health</p>
          </section>

          <section className="my-4 mb-5">
            <label htmlFor="password" className="text-md block my-2">
              New Password
            </label>
            <Input
              type="password"
              name="password"
              placeholder="Enter your new password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </section>

          <section className="my-4 mb-5 w-full">
            <Button disabled={isLoading}>Reset password</Button>
          </section>
        </form>
      </section>
    </>
  );
};

export default ResetPassword;
