"use client";

import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import Text from "@/app/components/Text";
import { useState } from "react";
import './page.css'
import {

  CountrySelect,
  StateSelect,
  
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";

import Link from "next/link";


const Signup = () => {
  const [countryid, setCountryid] = useState(0);
  const [stateid, setstateid] = useState(0);
  return (
    <>
   
      <section className=" mx-auto my-10 flex space-x-6">
        <section className="w-1/2 ">
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
            Join us today!
            </h3>
            <Text style={{color:"#218353;"}} noCapitalize>Create an account with us first</Text>
          </section>

          <section className="my-3 mb-5">
            <label htmlFor="name" className="text-md block font-bold  my-2">
              Fullname
            </label>
            <Input
              type="text"
              name="name"
              placeholder="Enter your fullname"
              
            />
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
            <label htmlFor="username" className="text-md block font-bold my-2">
              Username
            </label>
            <Input
              type="text"
              name="username"
              placeholder="Enter a unique username"
             
            />
          </section>

          <section className="my-4 mb-5">
            <label htmlFor="email" className="text-md block font-bold my-2">
              Password
            </label>
            <Input
              type="password"
              name="password"
              placeholder="Enter your password"
              
            />
          </section>

          <section className="my-4 mb-5">
            <label htmlFor="email" className="text-md block font-bold my-2">
              Signup As
            </label>
            <select
              className="select border-2 border-gray-500 focus:outline-none rounded-md w-full h-14"
              name="signupAs"
              
            >
              <option value="user">User</option>
              <option value="hospital">Hospital</option>
            </select>
            
          </section>
          <section className="my-4 mb-5 flex space-x-4 w-full">
            <section className="w-1/2">
            <label htmlFor="Country" className="text-md block font-bold my-2">
            Country
            </label>
            <CountrySelect
              className='border-none'
        onChange={(e) => {
          setCountryid(e.id);
        }}
        placeHolder="Select Country"
      />
            </section>
            <section className="w-1/2">
            <label htmlFor="state" className="text-md block font-bold my-2">
              State
            </label>
            <StateSelect
            className='border-none'
        countryid={countryid}
        onChange={(e) => {
          setstateid(e.id);
        }}
        placeHolder="Select State"
      />
            </section>
          </section>
          <section className="mt-3 mb-2 w-full">
            <Button>Sign up</Button>
          </section>

          <section className="text-center mt-6">
          <Text style={{color:"#218353;"}} noCapitalize>By creating an account, you agree to the <b>Terms of Service</b> and <b>Privacy Policy</b></Text>
            <Text className="inline text-gray-700 mt-6">
            Already have an account? 
              <Link
                className=" text-black px-1"
                href={"/auth/login"}
              >
                <b>Sign In</b>
              </Link>
            </Text>
          </section>
        </form>
        </section>
        <section className="w-1/2 h-screen" >
        <img src="/Right.png" alt="sidebar signup" style={{width:"98%"}} />
      </section>
      </section>
      
    </>
  );
};

export default Signup;
