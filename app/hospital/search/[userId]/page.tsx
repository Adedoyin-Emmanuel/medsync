"use client";
import Button from "@/app/components/Button";
import Loader from "@/app/components/Loader";
import { HospitalSidebarNav } from "@/app/components/SidebarLayout";
import Text from "@/app/components/Text";
import Verified from "@/app/components/Verified";
import {
  saveUserSearchProfileInfo,
  useGetUserByIdQuery,
} from "@/app/store/slices/user.slice";
import { AppDispatch, useAppSelector } from "@/app/store/store";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { GrLocation } from "react-icons/gr";
import { HiOutlineShieldCheck } from "react-icons/hi";
import { MdDateRange } from "react-icons/md";
import { SlBadge } from "react-icons/sl";
import { useDispatch } from "react-redux";
import Seo from "@/app/components/Seo/Seo";

const UserProfile = ({ params }: { params: { userId: string } }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, isLoading, isError } = useGetUserByIdQuery(params.userId);
  const { userSearchProfileInfo } = useAppSelector((state) => state.user);

  const router = useRouter();

  useEffect(() => {
    if (data) {
      dispatch(saveUserSearchProfileInfo(data.data));
    }
  }, [data]);

  const handleSearchUsers = () => {
    router.back();
  };

  return (
    <>
      <Seo
        title={`Viewing ${userSearchProfileInfo?.name}`}
        description="User profile view"
      />
      <div className="w-screen h-screen bg-zinc-50">
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <section className="w-full flex items-center flex-col ">
            <Text className="my-5">Couldn't get user details 😥</Text>
            <section className="my-5">
              <Button onClick={handleSearchUsers}>Search Users</Button>
            </section>
          </section>
        ) : (
          <HospitalSidebarNav>
            <section className=" my-5">
              <section className="w-full">
                <section className="w-full my-5">
                  <section className="w-full flex flex-col items-center">
                    <div className="avatar cursor-pointer">
                      <div className="w-24 rounded-full">
                        <img
                          className=""
                          src={userSearchProfileInfo?.profilePicture}
                          alt="user profile image"
                        />
                      </div>
                    </div>

                    <section className="profile w-full p-1 md:p-0 md:w-1/2 xl:w-2/6">
                      <section className="w-full flex items-center justify-between mt-5">
                        <h3 className="font-bold text-[20px] capitalize flex items-center gap-x-1">
                          {userSearchProfileInfo?.name}
                          <span>
                            {" "}
                            {userSearchProfileInfo?.isVerified && (
                              <Verified big={true} />
                            )}
                          </span>
                        </h3>

                        {/* <Link
                        href={`/hospital/search/${params.userId}/review?hId=${userSearchProfileInfo?._id}`}
                      >
                        <section className="bg-accent rounded-[20px] text-sm py-1 px-3 text-white text-center capitalize cursor-pointer hover:bg-secondary transition-colors duration-100 ease-in">
                          review user
                        </section>
                      </Link> */}
                      </section>

                      <Text noCapitalize className="text-sm">
                        @{userSearchProfileInfo?.username}
                      </Text>

                      <Text className="text-sm mt-2">
                        {userSearchProfileInfo?.bio}
                      </Text>

                      <section className="w-full flex flex-col items-start my-5">
                        <section className=" flex items-center justify-center gap-x-2 my-1">
                          <GrLocation className="w-5 h-5" />
                          <Text className="text-sm">
                            {userSearchProfileInfo?.location || "Lagos 9ja"}
                          </Text>
                        </section>

                        <section className="flex items-center justify-center gap-x-2 my-1">
                          <HiOutlineShieldCheck className="w-5 h-5" />
                          <Text className="text-sm">
                            {userSearchProfileInfo?.allTotalAppointments} total
                            checkups
                          </Text>
                        </section>

                        <section className="flex items-center justify-center gap-x-2 my-1">
                          <SlBadge className="w-5 h-5" />
                          <Text className="text-sm">
                            {userSearchProfileInfo?.reviews.length} reviews
                          </Text>
                        </section>

                        <section className="flex items-center justify-center gap-x-2 my-1">
                          <MdDateRange className="w-5 h-5" />
                          <Text className="text-sm">
                            joined{" "}
                            {moment(new Date(userSearchProfileInfo?.createdAt!))
                              .startOf("days")
                              .fromNow()}{" "}
                          </Text>
                        </section>
                      </section>
                    </section>
                  </section>
                </section>
              </section>
            </section>
          </HospitalSidebarNav>
        )}
      </div>
    </>
  );
};

export default UserProfile;
