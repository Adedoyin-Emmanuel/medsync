"use client";
import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import Loader from "@/app/components/Loader";
import Text from "@/app/components/Text";
import { loginUser } from "@/app/store/slices/auth.slice";
import { useLoginMutation } from "@/app/store/slices/user.slice";
import { AppDispatch } from "@/app/store/store";
import jwt from "jsonwebtoken";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import axios from "axios";
import Seo from "@/app/components/Seo/Seo";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userType: "user",
  });

  const handleInputChange = (e: React.FormEvent<HTMLFormElement> | any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await login(formData).unwrap();
      if (response) {
        toast.success(response.message);
        const jwtToken = response.data.accessToken;
        const jwtPayload: any = jwt.decode(jwtToken);
        const tempData = jwtPayload;
        const { role } = tempData;
        const { accessToken, refreshToken: token, ...data } = response.data;
        const userData = { ...data, role };

        dispatch(loginUser(userData));

        //make request to our auth server
        try {
          const serverResponse = await axios.post("/api/auth/set-token", {
            token,
          });
        } catch (error: any) {
          toast.error("Token not set");
        }

        //route the user to their respective page
        if (role === "user") {
          router.push("/user/dashboard");
        } else if (role === "hospital") {
          router.push("/hospital/dashboard");
        } else {
          toast.error("Invalid token, please login!");
          router.push("/auth/login");
        }
      }
    } catch (error: any) {
      toast.error(error?.data?.message || error.error || error?.data);
    }
  };
  return (
    <>
      <Seo
        title="Login"
        description="Login to your Caresync account"
        keywords="login, log in"
      />
      <section className="w-screen h-screen flex items-center justify-center">
        {isLoading && <Loader />}
        <form
          className="w-11/12 md:w-1/2 xl:w-1/4"
          onSubmit={(e) => {
            handleLogin(e);
          }}
        >
          <section className="header-section my-8">
            <h3 className="text-3xl capitalize font-bold text-secondary">
              Login
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
            <label htmlFor="email" className="text-md block my-2">
              Password
            </label>
            <Input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </section>

          <section className="mt-4 mb-2 w-full">
            <Button disabled={isLoading}> Login</Button>
          </section>
          <section>
            <Text className="inline" noCapitalize>
              Got no account?
              <Link
                className="capitalize text-secondary px-1"
                href={"/auth/signup"}
              >
                create
              </Link>
            </Text>
            <Text className="inline" noCapitalize>
              <Link
                href={"/auth/forgot-password"}
                className="capitalize text-secondary px-1"
              >
                <span className="text-black">|</span> Forgot password
              </Link>
            </Text>
          </section>
        </form>
      </section>
    </>
  );
};

export default Login;
