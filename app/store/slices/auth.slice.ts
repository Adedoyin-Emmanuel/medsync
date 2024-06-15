"use client";
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const userInfoFromLocalStorage =
  typeof window !== "undefined" ? localStorage.getItem("userInfo") : null;

const initialState = {
  userInfo: userInfoFromLocalStorage
    ? JSON.parse(userInfoFromLocalStorage)
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUser: (state, action) => {
      state.userInfo = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("userInfo", JSON.stringify(action.payload));
      }
    },

    updateUserInfo: (state, action) => {
      state.userInfo = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("userInfo", JSON.stringify(action.payload));
      }
    },

    logoutUser: () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("userInfo");

        //logout the user
        const logoutUser = async () => {
          await axios.post("/api/auth/reset-token");
        };

        logoutUser();
      }
      return initialState;
    },
  },
});

export const { loginUser, logoutUser, updateUserInfo } = authSlice.actions;
export default authSlice.reducer;
