"use client";

import { UserCard } from "@/app/components/HospitalCard";
import { LoaderSmall } from "@/app/components/Loader";
import { HospitalSidebarNav } from "@/app/components/SidebarLayout";
import Text from "@/app/components/Text";
import {
  clearUserSearchInfo,
  saveUserSearchInfo,
  useSearchUserQuery,
} from "@/app/store/slices/user.slice";
import { AppDispatch, useAppSelector } from "@/app/store/store";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Seo from "@/app/components/Seo/Seo";

const SearchUsers = () => {
  const [formData, setFormData] = useState({
    userName: "",
  });

  const handleInputChange = (e: React.FormEvent<HTMLFormElement> | any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setSkip(false);
  };

  const [skip, setSkip] = useState<boolean>(true);
  const dispatch = useDispatch<AppDispatch>();
  const { data, isLoading } = useSearchUserQuery(formData.userName, { skip });
  const [showData, setShowData] = useState<boolean>(false);
  const { userSearchInfo } = useAppSelector((state) => state.user);
  const [responseLength, setResponseLength] = useState<number>(0);

  useEffect(() => {
    dispatch(clearUserSearchInfo({}));
    if (data) {
      dispatch(saveUserSearchInfo(data.data));
      setResponseLength(data.data.length);
      setShowData(true);
    }
  }, [formData, data]);

  return (
    <>
      <Seo
        title="Find users"
        description="Find users on caresync"
        keywords="discover, find users, users, hospitals"
      />
      <div className="w-screen h-screen bg-zinc-50">
        <HospitalSidebarNav>
          <section className="my-5">
            <h3 className="font-bold text-2xl capitalize text-accent">
              search users
            </h3>
            <Text className="text-sm ">Search users, view their profile</Text>

            <section>
              <form className="flex items-center justify-center mt-5">
                <input
                  type="text"
                  placeholder="Search users"
                  name="userName"
                  className="bg-[#F5F5F5] capitalize p-5 rounded-full w-11/12 lg:w-8/12  outline-none border-2 border-purple-300 focus:border-accent hover:border-accent transition-all duration-150 ease-in my-5 text-sm"
                  onChange={handleInputChange}
                  value={formData.userName}
                ></input>
              </form>

              <section className="w-full">
                {!isLoading && showData && (
                  <Text className={`text-center text-sm`}>
                    search result for{" "}
                    <span className="text-accent">{formData.userName}</span>
                  </Text>
                )}
              </section>

              <section
                className={` w-full items-center mx-auto gap-10 ${
                  responseLength !== 0 && "grid"
                } sm:grid-cols-2 xl:grid-cols-3 my-8`}
              >
                {isLoading ? (
                  <LoaderSmall />
                ) : responseLength == 0 ? (
                  <Text className="text-center my-5">No users found</Text>
                ) : (
                  userSearchInfo?.map((user) => {
                    return (
                      <UserCard
                        _id={user._id}
                        address={user.location || "Around the world"}
                        name={user.name}
                        isVerified={user.isVerified}
                        key={user._id}
                        bio={user.bio}
                        href={`/hospital/search/${user._id}`}
                      />
                    );
                  })
                )}
              </section>
            </section>
          </section>
        </HospitalSidebarNav>
      </div>
    </>
  );
};

export default SearchUsers;
