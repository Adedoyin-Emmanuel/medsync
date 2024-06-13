import Layout from "./components/Layout";
import Navbar from "./components/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <section>
      <Layout>
        <Navbar />
        <section className="m-auto w-full">
          <div className="container mx-auto py-5 md:py-16 px-4  flex items-center justify-center lg:flex lg:items-start overflow-x-hidden">
            <div className="lg:w-1/2  mt-4 lg:mt-18">
            <p  className="p-1 w-11/12 text-center rounded-full mb-6" style={{backgroundColor:"#F2F3F5;",fontSize:"20px"}}>
            Bridging the gap within healthcare services
            </p>
              <h1 className="md:text-7xl text-5xl  font-bold  mb-4">
              Feel <span style={{ color: '#287BFF' }}>Better</span> when you need to
              </h1>
              <p className=" py-5" style={{ color: '#434242' }} >
              Talk to a doctor, therapist or any medical  expert anywhere you are by phone or video. Discover the profound synergy of technology and empathy seamlessly merging into a powerful force. Caresync stands as your unwavering partner in your journey towards unparalleled health and well-being by transforming your healthcare Experience through innovation, technology and compassion
              </p>

            </div>

            <div className="lg:w-1/2  lg:ml-12 flex items-center  justify-center">
              <img
                src="/home.png"
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
