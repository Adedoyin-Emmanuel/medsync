"use client";

import { AppointmentLabel } from "@/app/components/AppointmentCard";
import Button from "@/app/components/Button";
import ChatBotButton from "@/app/components/ChatBotButton";
import DashboardCard from "@/app/components/DashboardCard/DashboardCard";
import Loader, { LoaderSmall } from "@/app/components/Loader";
import SidebarLayout from "@/app/components/SidebarLayout";
import Text from "@/app/components/Text";
import {
  saveAppointmentInfo,
  saveDashboardInfo,
  saveRecentAppointmentInfo,
  useGetLatestAppointmentsQuery,
  useGetUserQuery,
  userAppointmentInfoProps,
} from "@/app/store/slices/user.slice";
import { AppDispatch, useAppSelector } from "@/app/store/store";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BsCameraVideo } from "react-icons/bs";
import { HiOutlineShieldCheck } from "react-icons/hi";
import { SlBadge } from "react-icons/sl";
import { useDispatch } from "react-redux";
import { DashboardQuickActions } from "@/app/components/DashboardQuickActions/DashboardQuickActions";
import toast from "react-hot-toast";
import Seo from "@/app/components/Seo/Seo"; // Special thanks to @benrobo for this trick 🙌

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: userData, isLoading } = useGetUserQuery({});
  const { userInfo } = useAppSelector((state) => state.auth);
  const healthCareHistoryRef = useRef<HTMLDivElement | any>(null);
  const chatBotRef = useRef<HTMLFormElement>(null);
  const chatBotMessageBottomRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    userChat: "",
  });

  const [showLoaderSmall, setShowLoaderSmall] = useState<boolean>(false);

  const [chatBodyHeight, setChatBodyHeight] = useState<string>("h-full");

  const handleInputChange = (e: React.FormEvent<HTMLFormElement> | any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  //it makes more sense to define it here

  interface messageStruct {
    sender: "bot" | "user";
    message: string;
  }

  const [messages, setMessages] = useState<messageStruct[]>([
    {
      sender: "bot",
      message: `Hi, I'm Caresync AI, nice to meet you ${userInfo?.name}`,
    },

    {
      sender: "bot",
      message: ` I can analyze your symptoms to provide rapid and accurate diagnoses for a wide range of health conditions. 
      I can also provide valuable insights into your overall health and wellness, helping you make informed decisions about your healthcare.
`,
    },
  ]);

  let dataToPass = {
    id: userInfo?._id,
    limit: 5,
    userType: "user",
  };

  const router = useRouter();

  useEffect(() => {
    if (userData) {
      dispatch(saveDashboardInfo(userData?.data));
    }
  }, [userData]);

  const { userDashboardInfo, recentAppointmentInfo } = useAppSelector(
    (state) => state.user
  );

  const { data: latestAppointmentData, isLoading: latestAppointmentLoading } =
    useGetLatestAppointmentsQuery(dataToPass);

  useEffect(() => {
    if (latestAppointmentData) {
      dispatch(saveAppointmentInfo(latestAppointmentData?.data));
      dispatch(saveRecentAppointmentInfo(latestAppointmentData?.data));
    }
  }, [latestAppointmentData]);

  const handleNewAppointmentClick = () => {
    router.push("/user/appointments/new");
  };

  const handleSymptomsCheckerClick = () => {
    router.push("/user/dashboard/symptoms-checker");
  };

  const handleBotClick = () => {
    chatBotRef.current?.classList.remove("scale-0");
    chatBotRef.current?.classList.add("scale-100");
  };

  const handleBotCancelButtonClick = () => {
    chatBotRef.current?.classList.remove("scale-100");
    chatBotRef.current?.classList.add("scale-0");
  };

  const handleChatSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    let resp: any = { success: false, data: null, msg: "" };
    const prompt = `
    You are a helpful AI assistant named CaresyncAI, an advanced AI dedicated to providing accurate healthcare diagnoses, treatment recommendations, and medical information to users.

    You must provide accurate, relevant, and helpful information only about health diagnoses, healthcare recommendations, diseases and treatments, drugs, medical procedures, and related topics within the healthcare domain.

    You must respond in simple, concise, and understandable language that any user can comprehend.

    If a user asks a question or initiates a discussion that is not directly related to healthcare or medical topics, do not provide an answer or engage in the conversation. Instead, politely redirect their focus back to the healthcare domain and its related content.

    If a user inquires about the creator of CaresyncAI, respond with: "The creator of CaresyncAI is Adedoyin Emmanuel Adeniyi, a Software Engineer."

    Your expertise is limited to healthcare, medical diagnosis, treatments, and related topics, and you must not provide any information on topics outside the scope of that domain.

    All replies or outputs must be rendered in markdown format.

    If a user inquires about the symptoms of a specific disease, you must provide accurate information about the symptoms of that disease. You must also tell reply with this "visit the  symptoms checker from your dashboard"

    Additionally, you must only answer and communicate in English language, regardless of the language used by the user.
  `;
    e.preventDefault();

    setShowLoaderSmall(true);

    const updatedMessages = [...messages];

    updatedMessages.push({ sender: "user", message: formData.userChat });

    setMessages(updatedMessages);
    setFormData({ ...formData, userChat: "" });
    scrollToBottom();

    try {
      const body = {
        messages: [
          {
            role: "system",
            content: prompt,
          },
          {
            role: "user",
            content: formData.userChat,
          },
        ],
        model: "gpt-3.5-turbo",
        max_tokens: 1000,
        temperature: 0.9,
        n: 1,
        top_p: 1,
        stream: true,
      };

      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              process.env.NEXT_PUBLIC_OPEN_AI_KEY as string
            }`,
          },
        }
      );

      const reader: any = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");
      let result = [];

      while (true) {
        const chunk = await reader?.read();
        const { done, value } = chunk as any;
        if (done) {
          break;
        }

        const decoded = decoder.decode(value);
        const lines = decoded.split("\n");
        const parsedLines = lines
          .map((l) => l.replace(/^data:/, "").trim())
          .filter((line) => line !== "" && line !== "[DONE]")
          .map((line) => JSON.parse(line));

        for (const parsedLine of parsedLines) {
          const { choices } = parsedLine;
          const { delta } = choices[0];
          const { content } = delta;
          if (content) {
            result.push(content);
          }
        }
      }

      resp["data"] = result;
      resp["msg"] = "";
      resp["success"] = true;

      updatedMessages.push({
        sender: "bot",
        message: resp["data"].join(""),
      });

      setShowLoaderSmall(false);
      setMessages(updatedMessages);
      scrollToBottom();
    } catch (error) {
      console.log(error);
      toast.error("An error occurred");
      const updatedMessages = [...messages];
      updatedMessages.push({
        sender: "bot",
        message: `Oh sugar, an error occurred 😞`,
      });
      setMessages(updatedMessages);
      setShowLoaderSmall(false);
    }
  };

  const scrollToBottom = () => {
    const chatBotMessageBottom = chatBotMessageBottomRef.current;
    if (chatBotMessageBottom) {
      chatBotMessageBottom.scrollIntoView({ behavior: "smooth" });
    }
  };
  useEffect(() => {
    if (messages.length >= 4) {
      setChatBodyHeight("h-auto");
    }
  }, [messages]);

  return (
    <>
      <Seo
        title="Dashboard"
        description="Caresync Dashboard"
        keywords="dashboard, user dashboard"
      />
      <div className="w-screen h-screen bg-zinc-50">
        {isLoading ? (
          <Loader />
        ) : (
          <SidebarLayout showWelcomeMesage={true}>
            <section className="general-container w-full mx-auto items-start flex flex-col xl:flex-row gap-x-5">
              <section className="w-full p-1 flex md:hidden items-center justify-center">
                <DashboardCard
                  appointments={userDashboardInfo?.appointments?.length!}
                  className="mt-5"
                  healthcareHistoryRef={healthCareHistoryRef}
                  userType="user"
                />
              </section>

              <section className="w-full p-1 flex md:hidden items-center justify-center">
                <DashboardQuickActions />
              </section>

              <section className="first-section w-full xl:w-8/12 hidden md:flex flex-col items-center justify-center ">
                <section className="stats-container grid p-1 lg:grid-cols-3 gap-10 w-full">
                  <section className="bg-gray-100 h-28 w-52 rounded my-5 flex items-center flex-col justify-around cursor-pointer hover:bg-accent hover:text-white transition-colors duration-100 ease-in">
                    <BsCameraVideo className="w-8 h-8" />
                    <Text>
                      {userDashboardInfo?.appointments?.length}{" "}
                      {userDashboardInfo?.appointments?.length! > 1
                        ? "Appointments"
                        : "Appointment"}
                    </Text>
                  </section>

                  <section className="bg-gray-100 h-28 w-52 rounded my-5 flex items-center flex-col justify-around cursor-pointer hover:bg-accent hover:text-white transition-colors duration-100 ease-in">
                    <HiOutlineShieldCheck className="w-8 h-8" />
                    <Text>
                      {userDashboardInfo?.allTotalAppointments} total{" "}
                      {userDashboardInfo?.allTotalAppointments! > 1
                        ? "Checkups"
                        : "Checkup"}
                    </Text>
                  </section>

                  <section className="bg-gray-100 h-28 w-52 rounded my-5 flex items-center flex-col justify-around cursor-pointer hover:bg-accent hover:text-white transition-colors duration-100 ease-in">
                    <SlBadge className="w-8 h-8" />
                    <Text>
                      {userDashboardInfo?.reviews?.length} total{" "}
                      {userDashboardInfo?.reviews?.length! > 1
                        ? "Reviews"
                        : "Review"}
                    </Text>
                  </section>
                </section>

                <section
                  className="health-care-history w-full my-5 p-2"
                  ref={healthCareHistoryRef}
                >
                  <h3 className="font-bold capitalize text-[18px] md:text-[20px]">
                    healthcare history
                  </h3>

                  {userDashboardInfo?.healthCareHistory?.length === 0 ? (
                    <Text className="text-center my-5">
                      No healthcare history
                    </Text>
                  ) : (
                    <Text>History dey</Text>
                  )}
                </section>
              </section>

              <section className="second-section w-full xl:w-4/12 mt-16 md:mt-0 grid grid-cols-1 items-center justify-center p-2">
                <section className="user-appointments">
                  <h3 className="font-bold capitalize text-[18px] md:text-[20px]">
                    recent appointments
                  </h3>

                  <section className="appointments mt-4">
                    {latestAppointmentLoading ? (
                      <LoaderSmall className="my-2" />
                    ) : recentAppointmentInfo?.length == 0 ? (
                      <Text className="text-center my-3">
                        No recent appointments
                      </Text>
                    ) : (
                      recentAppointmentInfo?.map(
                        (appointment: userAppointmentInfoProps) => {
                          return (
                            <AppointmentLabel
                              key={appointment._id}
                              userType="hospital"
                              status={appointment.status}
                              attender={appointment.hospitalId}
                              _id={appointment._id}
                              href={`/user/appointments/${appointment._id}`}
                              createdAt={appointment.createdAt}
                            />
                          );
                        }
                      )
                    )}
                    <section className="new-appointment w-full flex items-end justify-end my-5">
                      <Button
                        className="bg-accent"
                        onClick={handleNewAppointmentClick}
                      >
                        New appointment
                      </Button>
                    </section>
                  </section>
                </section>
                <br />
                <br />
                <section className="symptoms-checker">
                  <h3 className="font-bold capitalize text-[18px] md:text-[20px]">
                    symptoms checker
                  </h3>

                  <Text noCapitalize className="my-4">
                    Symptoms checker to help you identify potential health
                    conditions based on your symptoms.
                  </Text>

                  <Button
                    className="bg-accent"
                    onClick={handleSymptomsCheckerClick}
                  >
                    Symptoms checker
                  </Button>
                </section>
              </section>

              <section className="health-care-history w-full md:hidden my-5 p-2">
                <h3 className="font-bold capitalize text-[18px] md:text-[20px]">
                  healthcare history
                </h3>

                {userDashboardInfo?.healthCareHistory?.length === 0 ? (
                  <Text className="text-center my-5 text-sm">
                    No healthcare history
                  </Text>
                ) : (
                  <Text>History dey</Text>
                )}
              </section>
              <form
                className="bg-purple-200 h-4/6 absolute overflow-x-hidden scroll-smooth overflow-y-auto md:w-[28rem] w-11/12 transform-gpu transition duration-150 ease-linear scale-0 rounded-lg shadow-md  bottom-3  right-2 z-[10000]"
                ref={chatBotRef}
                onSubmit={(e) => {
                  handleChatSubmit(e);
                }}
                id="chat-container"
              >
                <section className="w-full sticky top-0 z-[10000] bg-white flex items-center justify-between p-1">
                  <section className="w-full flex items-center gap-5  p-2">
                    <div className="avatar online">
                      <div className="w-10 rounded-full">
                        <img
                          src="https://api.dicebear.com/7.x/micah/svg?seed=ai"
                          alt="Caresync bot image"
                        />
                      </div>
                    </div>
                    <h2 className="capitalize font-semibold text-[16px]">
                      caresync Ai
                    </h2>
                  </section>

                  <section className="">
                    <section className="h-8 w-8 flex items-center justify-center rounded-full  shadow bg-red-400 text-white duration-100 cursor-pointer transition-colors ease-linear">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                        onClick={handleBotCancelButtonClick}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18 18 6M6 6l12 12"
                        />
                      </svg>
                    </section>
                  </section>
                </section>

                <section
                  className={`chat-container w-full ${chatBodyHeight} p-2 overflow-x-hidden overflow-y-clip mb-10`}
                >
                  {messages.map((msg, index) => (
                    <>
                      <div
                        key={index}
                        className={`chat ${
                          msg.sender === "user" ? "chat-end" : "chat-start"
                        }`}
                      >
                        <div className="chat-image avatar">
                          <div className="w-10 rounded-full">
                            <img
                              src={`${
                                msg.sender === "user"
                                  ? userInfo?.profilePicture
                                  : "https://api.dicebear.com/7.x/micah/svg?seed=ai"
                              }`}
                              alt={`${msg.sender} image`}
                            />
                          </div>
                        </div>
                        <div className="chat-bubble bg-white text-black break-words">
                          {msg.message}
                        </div>
                      </div>
                    </>
                  ))}
                </section>

                <section className="my-2">
                  {showLoaderSmall && <LoaderSmall className="bg-white" />}
                </section>

                <div className="sticky bottom-0 w-full shadow-md flex items-center">
                  <input
                    type="text"
                    placeholder="Type something..."
                    name="userChat"
                    onChange={handleInputChange}
                    value={formData.userChat}
                    className="w-full border-none focus:outline-none focus:border-transparent p-4"
                  />
                  <button className="flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="absolute right-1 z-[10000] w-6 h-6 cursor-pointer"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                      />
                    </svg>
                  </button>
                </div>
                <div className="" ref={chatBotMessageBottomRef}></div>
              </form>
              <ChatBotButton onClick={handleBotClick} />
            </section>
          </SidebarLayout>
        )}
      </div>
    </>
  );
};

export default Home;
