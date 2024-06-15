"use client";

import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import Text from "@/app/components/Text";


import Link from "next/link";


const Login = () => {
  
  return (
    <>
   
      <section className=" mx-auto my-10 flex flex-col w-screen  md:flex-row justify-center items-center space-x-2">
      <section className="hidden md:flex md:w-1/2 " >
        <img src="/Right.png" alt="sidebar signup"  className="h-screen" style={{width:"94%", margin:"auto;"}} />
      </section>
        <section className="w-full md:w-1/2 ">
        <form
          className="w-10/12 mx-auto"
         
        >
          <img
                src="/signup.png"
                alt="doctors in lab coat"
                className="mb-6  text-center mx-auto"
                style={{width:"150px;"}}
              />
          <section className="header-section text-center my-6">
          
            <h3 className="text-3xl  font-bold text-secondary">
            Welcome back!
            </h3>
            <Text style={{color:"#218353;"}} noCapitalize>Please enter your details!</Text>
          </section>

          

          <section className="my-4 mb-5">
            <label htmlFor="email" className="text-md font-bold block font-bold my-2">
              Email
            </label>
            <Input
              type="email"
              name="email"
              placeholder="Enter your email"
             
            />
          </section>

         

          <section className="my-4 mb-5">
            <label htmlFor="password" className="text-md block font-bold my-2">
              Password
            </label>
            <Input
              type="password"
              name="password"
              placeholder="Enter your password"
              
            />
          </section>

          
      
          <section className="mt-3 mb-2 w-full">
            <Button>Sign In</Button>
          </section>

          <section className="text-center mt-6">
          
            <Text className="inline text-gray-700 mt-6">
            Don’t have an account?
              <Link
                className=" text-black px-1"
                href={"/auth/login"}
              >
                <b>Sign Up</b>
              </Link>
            </Text>
          </section>
        </form>
        </section>
       
      </section>
      
    </>
  );
};

export default Login;
