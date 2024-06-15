"use client";

import React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/store/store";
import {
  useGetOnlineUsersQuery,
  saveOnlineUsersInfo,
} from "@/app/store/slices/user.slice";
import { useState, useEffect } from "react";
import { useAppSelector } from "@/app/store/store";
import Text from "../Text";
import { LoaderSmall } from "../Loader";
import Link from "next/link";

interface ActiveUsersProps {
  className?: string;
}

const ActiveUsers = ({ className }: ActiveUsersProps) => {
  const { data, isLoading, refetch } = useGetOnlineUsersQuery({});
  const { onlineUsers, userDashboardInfo } = useAppSelector(
    (state) => state.user
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (data) {
      console.log(data);
      dispatch(saveOnlineUsersInfo(data.data));
    }
  }, [data]);

  return (
    <section className="active-hospitals flex items-center justify-center">
      <section
        className={`hospital w-full flex md:justify-start ${
          isLoading || onlineUsers?.length === 0
            ? "items-center justify-center md:justify-center"
            : "items-start justify-start"
        }  md:gap-x-5 p-2 gap-x-4`}
      >
        {isLoading ? (
          <LoaderSmall />
        ) : onlineUsers?.length === 0 ? (
          <Text className="text-sm text-center">No user online</Text>
        ) : (
          onlineUsers &&
          onlineUsers?.map!((user) => {
            return (
              <Link
                href={`/hospital/messages/${userDashboardInfo?._id}_${user?._id}?userId=${user?._id}`}
              >
                <div className="avatar cursor-pointer online">
                  <div className="w-14 rounded-full">
                    <img src={user?.profilePicture} />
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </section>
    </section>
  );
};

export default ActiveUsers;
