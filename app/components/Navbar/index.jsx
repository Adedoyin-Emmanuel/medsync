"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { FiGitlab, FiTwitter, FiYoutube } from "react-icons/fi";

const Navbar = () => {
  const mobileLinksRef = useRef(null);
  const [navToggled, setNavToggled] = useState(false);

  useEffect(() => {
    if (navToggled) {
      mobileLinksRef.current.style.maxHeight = `${mobileLinksRef.current.scrollHeight}px`;
    } else {
      mobileLinksRef.current.style.maxHeight = "0";
    }
  }, [navToggled]);

  const handleHamburgerClick = () => {
    setNavToggled(!navToggled);
  };

  const navItemsClassname = "h-6 w-6 text-accent transition-color hover:text-secondary";
  const navItems = [
    {
      link: "https://gitlab.com/adedoyin-emmanuel/caresync",
      element: <FiGitlab className={navItemsClassname} />,
    },
    {
      link: "/",
      element: <FiYoutube className={navItemsClassname} />,
    },
    {
      link: "/",
      element: <FiTwitter className={navItemsClassname} />,
    },
  ];

  return (
    <>
    <p style={{backgroundColor:"#218353",padding:"8px 0px;",textAlign:"center",width:'100%',color:"#fff",fontSize:"16px"}}>This project is sponsored by  Pipeops. It was developed during the hackathon period</p>
    <nav className="w-10/12 mx-auto flex items-center md:justify-between justify-between md:flex-row flex-col py-5 overflow-x-hidden z-10">
      <h2 className="font-extrabold text-4xl text-secondary mx-5 lg:flex items-center hidden cursor-pointer">
        <Link href="/">Medisync</Link>
      </h2>
      <section className="hidden lg:flex items-end justify-end  overflow-x-hidden space-x-6">
      <Link href="/" className=" block my-6" style={{color:"#218353"}}>
      Home
          </Link>
          <Link href="/about" className=" block my-6" style={{color:"#218353"}}>
          How it works
          </Link>
          <Link href="/functions" className=" block my-6" style={{color:"#218353"}}>
          Functions
          
          </Link>
          <Link href="/Team" className=" block my-6" style={{color:"#218353"}}>
          Team
          
          </Link>
      </section>
      <section className="hidden lg:flex  items-end justify-end overflow-x-hidden space-x-6">
      <button class="hover:bg-blue-700 text-black py-2 px-4 rounded-full"  style={{fontSize:"16px", backgroundColor:"#F2F3F5;"}}>
  Sign up
</button>
<button class="bg-green-700 hover:bg-blue-700 text-white  py-2 px-4 rounded-full"  style={{fontSize:"16px"}}>
  Login
</button>
      </section>

      <section className="lg:hidden flex w-full flex-col">
        <section className="header flex w-full items-center justify-between">
          <h2 className="font-extrabold text-secondary text-2xl mx-5">
            <Link href="/">Medsync</Link>
          </h2>

          <section
            className={`hamburger mx-5 transform transition-transform duration-300 ease-in-out ${navToggled ? "-rotate-90 text-secondary" : "rotate-0"}`}
            onClick={handleHamburgerClick}
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 24 24"
              className="font-bold"
              height="35"
              width="35"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M4 11h12v2H4zm0-5h16v2H4zm0 12h7.235v-2H4z"></path>
            </svg>
          </section>
        </section>

        <section ref={mobileLinksRef} className="md:mx-5 my-2 overflow-hidden transition-max-h duration-500 ease-in-out">
        <Link href="/" className=" block my-6" style={{color:"#218353"}}>
      Home
          </Link>
          <Link href="/about" className=" block my-6" style={{color:"#218353"}}>
          How it works
          </Link>
          <Link href="/functions" className=" block my-6" style={{color:"#218353"}}>
          Functions
          
          </Link>
          <Link href="/Team" className=" block my-6" style={{color:"#218353"}}>
          Team
          
          </Link>
        </section>
      </section>
    </nav>
    </>
  );
};

export default Navbar;
