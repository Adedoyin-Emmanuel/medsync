"use client";

import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import Loader from "@/app/components/Loader";
import Text from "@/app/components/Text";
import {
  useRegisterHospitalMutation,
  useRegisterUserMutation,
} from "@/app/store/slices/user.slice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import Seo from "@/app/components/Seo/Seo";

const Signup = () => {
  const formRef = useRef<HTMLFormElement | any>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    signupAs: "user",
  });

  const router = useRouter();

  const [registerUser, { isLoading: userLoading }] = useRegisterUserMutation();
  const [registerHospital, { isLoading: hospitalLoading }] =
    useRegisterHospitalMutation();

  const handleInputChange = (e: React.FormEvent<HTMLFormElement> | any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { signupAs, ...rest } = formData;

    if (signupAs === "user") {
      try {
        const response = await registerUser(rest).unwrap();
        if (response) {
          toast.success(response.message);
          router.push("/auth/login");
        }
      } catch (error: any) {
        toast.error(error?.data?.message || error.error || error?.data);
      }
    } else if (signupAs === "hospital") {
      try {
        const { name, signupAs, ...rest } = formData;
        const newData = {
          clinicName: name,
          ...rest,
        };
        const response = await registerHospital(newData).unwrap();
        if (response) {
          toast.success(response.message);
          router.push("/auth/login");
        }
      } catch (error: any) {
        toast.error(error?.data?.message || error.error || error?.data);
      }
    } else {
      toast.error("Not a valid user type!");
    }
  };

  return (
    <>
      <Seo
        title="Signup"
        description="Create your Caresync account"
        keywords="signup, create account, register"
      />
      <section className="w-screen h-screen flex items-center justify-center">
        {userLoading || (hospitalLoading && <Loader />)}
        <form
          className="w-11/12 md:w-1/2 xl:w-1/4"
          onSubmit={(e) => {
            handleSubmit(e);
          }}
          ref={formRef}
        >
          <section className="header-section my-8">
            <h3 className="text-3xl capitalize font-bold text-secondary">
              Signup
            </h3>
            <p>Connnecting you to better health</p>
          </section>

          <section className="my-4 mb-5">
            <label htmlFor="name" className="text-md block my-2">
              Fullname
            </label>
            <Input
              type="text"
              name="name"
              placeholder="Enter your fullname"
              value={formData.name}
              onChange={handleInputChange}
            />
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
            <label htmlFor="username" className="text-md block my-2">
              Username
            </label>
            <Input
              type="text"
              name="username"
              placeholder="Enter a unique username"
              value={formData.username}
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

          <section className="my-4 mb-5">
            <label htmlFor="email" className="text-md block my-2">
              State
            </label>
            <select
              className="select border-[1px] border-gray-300 focus:outline-none rounded-md w-full h-16"
              name="signupAs"
              value={formData.signupAs}
              onChange={handleInputChange}
            >
              <option value="user">Lagos</option>
              <option value="hospital">Ogun</option>
            </select>
          </section>

          <section className="my-4 mb-5">
            <label htmlFor="email" className="text-md block my-2">
              Signup As
            </label>
            <select
              className="select border-[1px] border-gray-300 focus:outline-none rounded-md w-full h-16"
              name="signupAs"
              value={formData.signupAs}
              onChange={handleInputChange}
            >
              <option value="user">User</option>
              <option value="hospital">Hospital</option>
            </select>
          </section>

          <section className="mt-4 mb-2 w-full">
            <Button disabled={userLoading || hospitalLoading}>Sign up</Button>
          </section>

          <section>
            <Text className="inline">
              have an account?
              <Link
                className="capitalize text-secondary px-1"
                href={"/auth/login"}
              >
                login
              </Link>
            </Text>
          </section>
        </form>
      </section>
    </>
  );
};

export default Signup;
