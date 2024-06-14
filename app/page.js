import Layout from "./components/Layout";
import Navbar from "./components/Navbar";
import { IoLogoFacebook } from "react-icons/io5";
import { LuInstagram } from "react-icons/lu";
import { FaXTwitter } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa";

// import {  } from "react-icons/fa";
import Link from "next/link";

export default function Home() {
  const navItemsClassname = "h-6 w-6 text-accent transition-color hover:text-secondary";
  const navItems = [
    {
      link: "https://gitlab.com/adedoyin-emmanuel/caresync",
      element: <IoLogoFacebook className={navItemsClassname} />,
    },
    {
      link: "/",
      element: <LuInstagram className={navItemsClassname} />,
    },
    {
      link: "/",
      element: <FaXTwitter className={navItemsClassname} />,
    },
    {
      link: "/",
      element: <FaGithub className={navItemsClassname} />,
    },
  ];
  return (
    <section>
      <Layout>
        <Navbar />
        <section className="m-auto w-full lg:w-10/12">
          <div className="container mx-auto  md:py-16 w-10/12 md:w-full md:px-4 md:space-x-10 flex flex-col lg:flex-row items-center justify-center lg:flex lg:items-start overflow-hidden" style={{ display: "flex", alignItems: "center;" }}>
            <div className="md:w-10/12 lg:w-1/2 mt-4 lg:mt-18">
              <p className="p-1 w-full md:w-9/12 text-center rounded-full mb-6" style={{ backgroundColor: "#F2F3F5;", fontSize: "16px" }}>
                Bridging the gap within healthcare services
              </p>
              <h1 className="text-4xl md:text-8xl  font-bold  mb-4">
                Feel <span style={{ color: '#218353' }}>Better</span> when you need to
              </h1>
              <p className=" py-5" style={{ color: '#434242',fontSize:"16px" }} >
                Talk to a doctor, therapist or any medical  expert anywhere you are by phone or video. Discover the profound synergy of technology and empathy seamlessly merging into a powerful force. Caresync stands as your unwavering partner in your journey towards unparalleled health and well-being by transforming your healthcare Experience through innovation, technology and compassion
              </p>
              <section className="flex m-auto overflow-x-hidden space-x-6">
        {navItems.map((navItem, index) => {
          return (
            <Link href={navItem.link} key={index}>
              {navItem.element}
            </Link>
          );
        })}
      </section>
            </div>

            <div className="md:w-10/12 lg:w-1/2 flex items-center  justify-center">
              <img
                src="/hand-drawn-medical-sticker-set (2).png"
                alt="doctors in lab coat"
                className="transform scale-110"
              />
            </div>
          </div>
        </section>
       
     

      </Layout>
    </section>
  );
}
