"use client";

import { createSlice } from "@reduxjs/toolkit";
import { apiSlice } from "./api.slice";

const USERS_URL = "/user";
const HOSPITALS_URL = "/hospital";
const AUTH_URL = "/auth";
const APPOINTMENTS_URL = "/appointment";
const ROOM_URL = "/room";
const REVIEW_URL = "/review";
const MEDICAL_RECORD_URL = "/medical-record";

const loadFromLocalStorage = (key: string, defaultValue: any) => {
  if (typeof window !== "undefined") {
    const storedData = localStorage.getItem(key);
    if (storedData) {
      try {
        return JSON.parse(storedData);
      } catch (error) {
        console.error("Error parsing data from localStorage:", error);
      }
    }
  }
  return defaultValue;
};

export const saveToLocalStorage = (key: string, data: any) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, data);
  }
};

export interface userDashboardInfoProps {
  _id: string;
  name: string;
  username: string;
  email: string;
  profilePicture: string;
  bio: string;
  isVerified: boolean;
  allTotalAppointments: number;
  appointments: userAppointment[];
  messages: any[];
  reviews: any[];
  healthCareHistory: healthCareHistoryProps[];
  updatedAt: Date;
  createdAt: Date;
  location?: string;
  online?: boolean;

  //looks weird adding this here, well an hospital is also a type of user soo yeah YGTV
  clinicName?: string;
  medicalRecordsAccess: [];
}

export interface userAppointmentInfoProps {
  _id: string;
  title?: string;
  description?: string;
  hospitalId: string;
  userId?: string;
  status: "pending" | "success" | "failed";
  startDate?: Date;
  endDate?: Date;
  reviews?: any[];
  createdAt: Date;
  updatedAt?: Date;
}

export interface userAppointment extends userAppointmentInfoProps {
  className?: string;
  attender: string;
  dateCreated: Date;
  status: "pending" | "failed" | "success";
  id: string;
  href: string;
}

export interface healthCareHistoryProps {
  attender: string;
  _id: string;
  createdAt: Date;
  href: string;
}

export interface hospitalProps {
  _id: string;
  clinicName: string;
  username: string;
  email: string;
  password: string;
  profilePicture: string;
  isVerified: boolean;
  appointments: userAppointment[];
  messages: [];
  reviews: [];
  healthCareHistory: healthCareHistoryProps[];
  allTotalAppointments: number;
  bio: string;
  location?: string;
  online?: boolean;
  updatedAt: Date;
  createdAt: Date;
}

export interface currentTypingMessaageProps {
  message: string;
  sender: string;
  receiver: string;
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface reviewProps {
  _id: string;
  rating: number;
  message: string;
  hospitalId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface medicalRecordsProps {
  _id: string;
  userId: string;
  symptoms: string;
  diagnosis: string;
  createdAt: Date;
  updatedAt: Date;
}

const initialState = {
  userDashboardInfo:
    typeof window !== "undefined"
      ? (loadFromLocalStorage(
          "userDashboardInfo",
          null
        ) as userDashboardInfoProps | null)
      : null,

  userAppointmentInfo:
    typeof window !== "undefined"
      ? (loadFromLocalStorage("userAppointmentInfo", null) as
          | userAppointmentInfoProps[]
          | null)
      : null,

  recentAppointmentInfo:
    typeof window !== "undefined"
      ? (loadFromLocalStorage("userRecentAppointmentInfo", null) as
          | userAppointment[]
          | null)
      : null,

  healthCareHistoryInfo:
    typeof window !== "undefined"
      ? (loadFromLocalStorage("userHealthCareHistoryInfo", null) as
          | healthCareHistoryProps[]
          | null)
      : null,

  hospitalSearchInfo:
    typeof window !== "undefined"
      ? (loadFromLocalStorage("userHospitalSearchInfo", null) as
          | hospitalProps[]
          | null)
      : null,

  hospitalSearchProfileInfo:
    typeof window !== "undefined"
      ? (loadFromLocalStorage(
          "userHospitalSearchProfileInfo",
          null
        ) as hospitalProps | null)
      : null,

  userSearchInfo:
    typeof window !== "undefined"
      ? (loadFromLocalStorage("hospitalUserSearchInfo", null) as
          | userDashboardInfoProps[]
          | null)
      : null,

  userSearchProfileInfo:
    typeof window !== "undefined"
      ? (loadFromLocalStorage(
          "hospitalUserSearchProfileInfo",
          null
        ) as userDashboardInfoProps | null)
      : null,

  userSpecificAppointmentInfo:
    typeof window !== "undefined"
      ? (loadFromLocalStorage(
          "userSpecificAppointmentInfo",
          null
        ) as userAppointment | null)
      : null,

  onlineUsers:
    typeof window !== "undefined"
      ? (loadFromLocalStorage("onlineUsers", null) as
          | userDashboardInfoProps[]
          | null)
      : null,

  onlineHospitals:
    typeof window !== "undefined"
      ? (loadFromLocalStorage("onlineHospitals", null) as
          | hospitalProps[]
          | null)
      : null,

  roomToken:
    typeof window !== "undefined"
      ? (loadFromLocalStorage("roomToken", null) as string | null)
      : null,

  currentTypingMessage:
    typeof window !== "undefined"
      ? (loadFromLocalStorage(
          "currentTypingMessage",
          null
        ) as currentTypingMessaageProps | null)
      : null,

  userReviewInfo:
    typeof window !== "undefined"
      ? (loadFromLocalStorage("userReviewInfo", null) as reviewProps[] | null)
      : null,

  userSpecificReviewInfo:
    typeof window !== "undefined"
      ? (loadFromLocalStorage(
          "userSpecificReviewInfo",
          null
        ) as reviewProps | null)
      : null,
};

const userSlice = createSlice({
  name: "userDashboardInfo",
  initialState,
  reducers: {
    saveDashboardInfo: (state, action) => {
      state.userDashboardInfo = action.payload;
      saveToLocalStorage("userDashboardInfo", JSON.stringify(action.payload));
    },

    // all appointment information this is for not specific for a user or hospital
    saveAppointmentInfo: (state, action) => {
      state.userAppointmentInfo = action.payload;
      saveToLocalStorage("userAppointmentInfo", JSON.stringify(action.payload));
    },

    saveRecentAppointmentInfo: (state, action) => {
      state.recentAppointmentInfo = action.payload;
      saveToLocalStorage(
        "userRecentAppointmentInfo",
        JSON.stringify(action.payload)
      );
    },

    saveHealthCareHistoryInfo: (state, action) => {
      state.healthCareHistoryInfo = action.payload;
      saveToLocalStorage(
        "userHealthCareHistoryInfo",
        JSON.stringify(action.payload)
      );
    },

    //action to dispatch when an hospital search for a user
    saveHospitalSearchInfo: (state, action) => {
      state.hospitalSearchInfo = action.payload;
      saveToLocalStorage(
        "userHospitalSearchInfo",
        JSON.stringify(action.payload)
      );
    },

    //action to dispatch when an hospital search for a user and then wants to view his/her profile
    saveHospitalSearchProfileInfo: (state, action) => {
      state.hospitalSearchProfileInfo = action.payload;
      saveToLocalStorage(
        "userHospitalSearchProfileInfo",
        JSON.stringify(action.payload)
      );
    },

    //action to dispatch when a user searches for an hosptial
    saveUserSearchInfo: (state, action) => {
      state.userSearchInfo = action.payload;
      saveToLocalStorage(
        "hospitalUserSearchInfo",
        JSON.stringify(action.payload)
      );
    },

    //action to dispatch when a user searches for an hosptial and then wants to view their profile
    saveUserSearchProfileInfo: (state, action) => {
      state.userSearchProfileInfo = action.payload;
      saveToLocalStorage(
        "hospitalUserSearchProfileInfo",
        JSON.stringify(action.payload)
      );
    },

    // this is a specific appointment, like one out of many
    saveUserSpecificAppointmentInfo: (state, action) => {
      state.userSpecificAppointmentInfo = action.payload;
      saveToLocalStorage(
        "userSpecificAppointmentInfo",
        JSON.stringify(action.payload)
      );
    },

    // this istthe review endpoints reducers
    saveReviewInfo: (state, action) => {
      state.userReviewInfo = action.payload;
      saveToLocalStorage("userReviewInfo", JSON.stringify(action.payload));
    },

    saveSpecificReviewInfo: (state, action) => {
      state.userSpecificReviewInfo = action.payload;
      saveToLocalStorage(
        "userSpecificReviewInfo",
        JSON.stringify(action.payload)
      );
    },

    //this is specific to an hospital

    saveOnlineHospitalsInfo: (state, action) => {
      state.onlineHospitals = action.payload;
      saveToLocalStorage("onlineHospitals", JSON.stringify(action.payload));
    },

    //this is specific to a user

    saveOnlineUsersInfo: (state, action) => {
      state.onlineUsers = action.payload;
      saveToLocalStorage("onlineUsers", JSON.stringify(action.payload));
    },

    // this is for the user and the hospital

    saveRoomToken: (state, action) => {
      state.roomToken = action.payload;
      saveToLocalStorage("roomToken", JSON.stringify(action.payload));
    },

    // this is for the user and the hospital

    saveCurrentTypingMessage: (state, action) => {
      state.currentTypingMessage = action.payload;
      saveToLocalStorage(
        "currentTypingMessage",
        JSON.stringify(action.payload)
      );
    },

    // clear data reducers

    clearHospitalSearchInfo: (state, action) => {
      state.hospitalSearchInfo = null;
      localStorage.removeItem("userHospitalSearchInfo");
    },

    clearUserSearchInfo: (state, action) => {
      state.userSearchInfo = null;
      localStorage.removeItem("hospitalUserSearchInfo");
    },

    resetUser: () => {
      localStorage.removeItem("userDashboardInfo");
      localStorage.removeItem("userAppointmentInfo");
      localStorage.removeItem("userRecentAppointmentInfo");
      localStorage.removeItem("userHealthCareHistoryInfo");
      localStorage.removeItem("userHospitalSearchInfo");
      localStorage.removeItem("userHospitalSearchProfileInfo");
      localStorage.removeItem("hospitalUserSearchInfo");
      localStorage.removeItem("userSpecificAppointmentInfo");
      localStorage.removeItem("hospitalUserSearchProfileInfo");
      localStorage.removeItem("onlineHospitals");
      localStorage.removeItem("onlineUsers");
      localStorage.removeItem("roomToken");
      localStorage.removeItem("currentTypingMessage");
      localStorage.removeItem("userReviewInfo");
      localStorage.removeItem("userSpecificReviewInfo");
    },
  },
});

/*
  UserApiCalls
*/

export const userApiCall = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //auth based endpoints

    login: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/login`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["User", "Hospital"],
    }),

    logout: builder.mutation({
      query: () => ({
        url: `${AUTH_URL}/logout`,
        method: "POST",
      }),
      invalidatesTags: ["User", "Hospital"],
    }),

    verifyEmail: builder.query({
      query: (data) => {
        return {
          url: `${AUTH_URL}/verify-email?email=${data}`,
          method: "GET",
        };
      },
    }),

    forgotPassword: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/forgot-password`,
        method: "POST",
        data: data,
      }),
    }),

    resetPassword: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/reset-password`,
        method: "POST",
        data: data,
      }),
    }),

    registerUser: builder.mutation({
      query: (data) => ({
        url: USERS_URL,
        method: "POST",
        data: data,
      }),
    }),

    registerHospital: builder.mutation({
      query: (data) => ({
        url: HOSPITALS_URL,
        method: "POST",
        data: data,
      }),
    }),

    // miscellaneous

    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/${data.id}`,
        method: "PUT",
        data: data.body,
      }),
      invalidatesTags: ["User", "Hospital"],
    }),

    updateHospital: builder.mutation({
      query: (data) => ({
        url: `${HOSPITALS_URL}/${data.id}`,
        method: "PUT",
        data: data.body,
      }),
      invalidatesTags: ["User", "Hospital"],
    }),

    getAllUsers: builder.query({
      query: (data) => ({
        url: USERS_URL,
        method: "GET",
      }),
      providesTags: ["User", "Hospital"],
    }),

    getAllHospitals: builder.query({
      query: (data) => ({
        url: HOSPITALS_URL,
        method: "GET",
      }),
      providesTags: ["User", "Hospital"],
    }),

    getUserById: builder.query({
      query: (data) => ({
        url: `${USERS_URL}/${data}`,
        method: "GET",
      }),
      providesTags: ["User", "Hospital"],
    }),

    getHospitalById: builder.query({
      query: (data) => ({
        url: `${HOSPITALS_URL}/${data}`,
        method: "GET",
      }),
      providesTags: ["User", "Hospital"],
    }),

    searchHospital: builder.query({
      query: (data) => ({
        url: `${HOSPITALS_URL}/search`,
        method: "GET",
        params: {
          searchTerm: data,
        },
      }),
      providesTags: ["User", "Hospital"],
    }),

    //search user

    searchUser: builder.query({
      query: (data) => ({
        url: `${USERS_URL}/search`,
        method: "GET",
        params: {
          searchTerm: data,
        },
      }),
      providesTags: ["User", "Hospital"],
    }),

    getHospitalRating: builder.query({
      query: (data) => ({
        url: `${HOSPITALS_URL}/rating/${data}`,
        method: "GET",
      }),
      providesTags: ["User", "Hospital"],
    }),

    // user resource deletion

    deleteUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/${data.id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User", "Hospital"],
    }),

    deleteHospital: builder.mutation({
      query: (data) => ({
        url: `${HOSPITALS_URL}/${data.id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User", "Hospital"],
    }),

    //dashboard based endpoints

    getUser: builder.query({
      query: () => ({
        url: `${USERS_URL}/me`,
        method: "GET",
      }),
      providesTags: ["User", "Hospital"],
    }),

    getHospital: builder.query({
      query: () => ({
        url: `${HOSPITALS_URL}/me`,
        method: "GET",
      }),
      providesTags: ["User", "Hospital"],
    }),

    //appointments based endpoints
    getUserAppointments: builder.query({
      query: (data) => ({
        url: `${APPOINTMENTS_URL}/user/${data}`,
        method: "GET",
      }),
      providesTags: ["User", "Hospital"],
    }),

    getHospitalAppointments: builder.query({
      query: (data) => ({
        url: `${APPOINTMENTS_URL}/hospital/${data}`,
        method: "GET",
      }),
      providesTags: ["User", "Hospital"],
    }),

    getAppointmentById: builder.query({
      query: (data) => ({
        url: `${APPOINTMENTS_URL}/${data}`,
        method: "GET",
      }),
      providesTags: ["User", "Hospital"],
    }),

    getLatestAppointments: builder.query({
      query: (data) => {
        return {
          url: `${APPOINTMENTS_URL}/latest/${data.id}`,
          method: "GET",
          params: {
            userType: data.userType,
            limit: data.limit,
          },
        };
      },
      providesTags: ["User", "Hospital"],
    }),

    createAppointment: builder.mutation({
      query: (data) => ({
        url: APPOINTMENTS_URL,
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["User", "Hospital"],
    }),

    updateAppointment: builder.mutation({
      query: (data) => {
        const { id, ...dataWithoutId } = data;

        return {
          url: `${APPOINTMENTS_URL}/${id}`,
          method: "PUT",
          data: dataWithoutId,
        };
      },
      invalidatesTags: ["User", "Hospital"],
    }),

    cancelAppointment: builder.mutation({
      query: (data) => {
        const { id } = data;

        return {
          url: `${APPOINTMENTS_URL}/cancel/${id}`,
          method: "PUT",
        };
      },
      invalidatesTags: ["User", "Hospital"],
    }),

    approveAppointment: builder.mutation({
      query: (data) => {
        const { id } = data;

        return {
          url: `${APPOINTMENTS_URL}/approve/${id}`,
          method: "PUT",
        };
      },
      invalidatesTags: ["User", "Hospital"],
    }),

    deleteAppointment: builder.mutation({
      query: (data) => {
        const { id, ...dataWithoutId } = data;

        return {
          url: `${APPOINTMENTS_URL}/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["User", "Hospital"],
    }),

    getAppointmentToken: builder.query({
      query: (data) => {
        return {
          url: `${APPOINTMENTS_URL}/generate-token`,
          method: "GET",
          params: {
            participantName: data.participantName,
            roomName: data.roomName,
          },
        };
      },
    }),

    // user and hospital chat endpoints

    getOnlineUsers: builder.query({
      query: (data) => ({
        url: `${USERS_URL}/online`,
        method: "GET",
      }),

      providesTags: ["User", "Hospital"],
    }),

    getOnlineHospitals: builder.query({
      query: (data) => ({
        url: `${HOSPITALS_URL}/online`,
        method: "GET",
      }),

      providesTags: ["User", "Hospital"],
    }),

    //room and chat endpoints

    getRoomToken: builder.query({
      query: (data) => ({
        url: `${ROOM_URL}/get-token`,
        params: {
          userId: data.userId,
          hospitalId: data.hospitalId,
        },
      }),
      providesTags: ["User", "Hospital"],
    }),

    // review endpoints
    createReview: builder.mutation({
      query: (data) => ({
        url: REVIEW_URL,
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["User", "Hospital"],
    }),

    getReviewById: builder.query({
      query: (data) => ({
        url: `${REVIEW_URL}/${data}`,
        method: "GET",
      }),
      providesTags: ["User", "Hospital"],
    }),

    getReviewByUserId: builder.query({
      query: (data) => ({
        url: `${REVIEW_URL}/user/${data}`,
        method: "GET",
      }),
      providesTags: ["User", "Hospital"],
    }),

    getReviewByHospitalId: builder.query({
      query: (data) => ({
        url: `${REVIEW_URL}/hospital/${data}`,
        method: "GET",
      }),
      providesTags: ["User", "Hospital"],
    }),

    updateReview: builder.mutation({
      query: (data) => ({
        url: `${REVIEW_URL}/${data.id}`,
        method: "PUT",
        data: data.body,
      }),
      invalidatesTags: ["User", "Hospital"],
    }),

    deleteReview: builder.mutation({
      query: (data) => ({
        url: `${REVIEW_URL}/${data}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User", "Hospital"],
    }),

    // medical records endpoint

    createMedicalRecord: builder.mutation({
      query: (data) => ({
        url: MEDICAL_RECORD_URL,
        method: "POST",
        data,
      }),

      invalidatesTags: ["User", "Hospital"],
    }),

    getAllMedicalRecords: builder.query({
      query: () => ({
        url: MEDICAL_RECORD_URL,
        method: "GET",
      }),
      providesTags: ["User", "Hospital"],
    }),

    getMedicalRecordsByUserId: builder.query({
      query: (data) => ({
        url: MEDICAL_RECORD_URL,
        method: "GET",

        params: {
          userId: data.userId,
          hospitalId: data.hospitalId,
        },

        providesTags: ["User", "Hospital"],
      }),
    }),

    getMedicalRecordById: builder.query({
      query: (data) => ({
        url: `${MEDICAL_RECORD_URL}/${data.id}`,
        method: "GET",
        params: {
          hospitalId: data?.hospitalId,
        },
      }),
      providesTags: ["User", "Hospital"],
    }),

    getCurrentUserMedicalRecords: builder.query({
      query: (data) => ({
        url: `${MEDICAL_RECORD_URL}/me`,
        method: "GET",
      }),
      providesTags: ["User", "Hospital"],
    }),

    getAllHospitalsWithUserMedicalRecordAccess: builder.query({
      query: (data) => ({
        url: `${HOSPITALS_URL}/user-medical-record/${data}`,
        method: "GET",
      }),

      providesTags: ["User", "Hospital"],
    }),

    updateUserMedicalRecords: builder.mutation({
      query: (data) => {
        const { id, ...dataWithoutId } = data;

        return {
          url: MEDICAL_RECORD_URL,
          method: "PUT",
          data: dataWithoutId,
          params: {
            id,
          },
        };
      },

      invalidatesTags: ["User", "Hospital"],
    }),

    deleteUserMedicalRecords: builder.mutation({
      query: (data) => ({
        url: `${MEDICAL_RECORD_URL}/${data.id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User", "Hospital"],
    }),

    removeHospitalFromUserMedicalRecordAccess: builder.mutation({
      query: (data) => ({
        url: `${MEDICAL_RECORD_URL}/hospital-access`,
        method: "DELETE",
        params: {
          userId: data.userId,
          hospitalId: data.hospitalId,
        },
      }),
      invalidatesTags: ["User", "Hospital"],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,

  useVerifyEmailQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,

  useRegisterUserMutation,
  useRegisterHospitalMutation,

  useUpdateUserMutation,
  useUpdateHospitalMutation,
  useGetAllUsersQuery,
  useGetAllHospitalsQuery,
  useGetUserByIdQuery,
  useGetHospitalByIdQuery,
  useDeleteUserMutation,
  useDeleteHospitalMutation,

  useSearchHospitalQuery,
  useGetHospitalRatingQuery,

  useSearchUserQuery,

  useGetUserQuery,
  useGetHospitalQuery,

  useGetUserAppointmentsQuery,
  useGetHospitalAppointmentsQuery,
  useGetAppointmentByIdQuery,
  useGetLatestAppointmentsQuery,
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation,
  useCancelAppointmentMutation,
  useApproveAppointmentMutation,
  useDeleteAppointmentMutation,

  useGetAppointmentTokenQuery,

  useGetOnlineUsersQuery,
  useGetOnlineHospitalsQuery,

  useGetRoomTokenQuery,

  useCreateReviewMutation,
  useGetReviewByIdQuery,
  useGetReviewByHospitalIdQuery,
  useGetReviewByUserIdQuery,
  useUpdateReviewMutation,
  useDeleteReviewMutation,

  useCreateMedicalRecordMutation,

  useGetMedicalRecordByIdQuery,
  useGetAllMedicalRecordsQuery,
  useGetCurrentUserMedicalRecordsQuery,
  useGetMedicalRecordsByUserIdQuery,
  useGetAllHospitalsWithUserMedicalRecordAccessQuery,

  useUpdateUserMedicalRecordsMutation,
  useDeleteUserMedicalRecordsMutation,

  useRemoveHospitalFromUserMedicalRecordAccessMutation,
} = userApiCall;

export const {
  saveDashboardInfo,
  resetUser,
  saveAppointmentInfo,
  saveRecentAppointmentInfo,
  saveHealthCareHistoryInfo,
  saveHospitalSearchInfo,
  saveHospitalSearchProfileInfo,
  saveUserSpecificAppointmentInfo,
  saveUserSearchInfo,
  saveUserSearchProfileInfo,
  clearHospitalSearchInfo,
  clearUserSearchInfo,

  saveOnlineUsersInfo,
  saveOnlineHospitalsInfo,

  saveRoomToken,
  saveCurrentTypingMessage,

  saveReviewInfo,
  saveSpecificReviewInfo,
} = userSlice.actions;
export default userSlice.reducer;
