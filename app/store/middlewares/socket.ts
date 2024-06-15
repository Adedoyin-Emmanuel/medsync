import { AnyAction, Dispatch, MiddlewareAPI } from "@reduxjs/toolkit";
import { ToolkitStore } from "@reduxjs/toolkit/dist/configureStore";
import { io } from "socket.io-client";
import {
  resetUser,
  saveAppointmentInfo,
  saveOnlineHospitalsInfo,
  saveOnlineUsersInfo,
  saveUserSpecificAppointmentInfo,
  userAppointment,
  saveReviewInfo,
  saveSpecificReviewInfo,
  reviewProps,
  saveDashboardInfo,
  userDashboardInfoProps,
} from "../slices/user.slice";
import store from "../store";
import { logoutUser } from "../slices/auth.slice";

const user: any =
  typeof window !== "undefined" &&
  JSON.parse(localStorage.getItem("userDashboardInfo")!);

const socketServerUrl =
  process.env.NEXT_PUBLIC_BASE_SOCKET_URL ||
  "https://caresync-api.onrender.com";

export const socket = io(socketServerUrl, {
  withCredentials: true,
  query: user,
});

function handleAppointmentChange(
  store: ToolkitStore,
  changeType: string,
  appointmentData: userAppointment
) {
  const existingAppointments = store.getState().user.userAppointmentInfo || [];

  let updatedAppointments = [...existingAppointments];

  if (
    changeType === "update" ||
    changeType === "cancel" ||
    changeType === "approve"
  ) {
    // For updates, cancel, or approve, update the corresponding appointment data
    const indexOfUpdatedAppointment = existingAppointments.findIndex(
      (appointment: userAppointment) => appointment._id === appointmentData._id
    );

    if (indexOfUpdatedAppointment !== -1) {
      updatedAppointments[indexOfUpdatedAppointment] = appointmentData;
    }
    store.dispatch(saveUserSpecificAppointmentInfo(appointmentData));
  } else if (changeType === "delete") {
    // For deletions, remove the appointment
    updatedAppointments = existingAppointments.filter(
      (appointment: userAppointment) => appointment._id !== appointmentData._id
    );

    store.dispatch(saveUserSpecificAppointmentInfo(appointmentData));
  }
  store.dispatch(saveAppointmentInfo(updatedAppointments));
}

function handleReviewChange(
  store: ToolkitStore,
  changeType: string,
  reviewData: reviewProps
) {
  const existingReviews = store.getState().userReviewInfo || [];

  let updatedReviews = [...existingReviews];

  if (changeType === "update") {
    // For updates,  update the corresponding review data
    const indexOfUpdatedReview = existingReviews.findIndex(
      (review: reviewProps) => review._id === reviewData._id
    );

    if (indexOfUpdatedReview !== -1) {
      updatedReviews[indexOfUpdatedReview] = reviewData;
    }
    store.dispatch(saveSpecificReviewInfo(reviewData));
  } else if (changeType === "delete") {
    // For deletions, remove the review
    updatedReviews = existingReviews.filter(
      (review: reviewProps) => reviewData._id !== reviewData._id
    );

    store.dispatch(saveSpecificReviewInfo(reviewData));
  }
  store.dispatch(saveReviewInfo(updatedReviews));
}

/* listens for a newAppointment event from the server,
triggers a reducer action that causes an update on the UI 
*/
socket.on("newAppointment", (newAppointment) => {
  const hospitalId = store.getState().auth.userInfo?._id;

  if (
    newAppointment.hospitalId === hospitalId ||
    newAppointment.userId === hospitalId
  ) {
    const existingAppointments =
      store.getState().user.userAppointmentInfo || [];
    const updatedAppointment = [newAppointment, ...existingAppointments];
    store.dispatch(saveAppointmentInfo(updatedAppointment));

    const existingDashboardInfo: userDashboardInfoProps | any =
      store.getState().user.userDashboardInfo || [];

    // the new appointment to replace the old with
    const newAppointmentDashboardInfo = [
      newAppointment,
      ...existingAppointments,
    ];

    // exclude the former appointment from the dashboardInfo
    const { appointments, ...newDashboardInfo } = existingDashboardInfo;

    newDashboardInfo.appointments = newAppointmentDashboardInfo;

    //save the new data
    store.dispatch(saveDashboardInfo(newDashboardInfo));
  }
});

/* listens for an updateAppointment event from the server,
triggers a reducer acdtion that causes an update on the UI 
*/
socket.on("updateAppointment", (updatedAppointment) => {
  handleAppointmentChange(store, "update", updatedAppointment);
});

//cancelAppointment event
socket.on("cancelAppointment", (canceledAppointment) => {
  handleAppointmentChange(store, "cancel", canceledAppointment);
});

//deleteAppointment event
socket.on("deleteAppointment", (deletedAppointment) => {
  handleAppointmentChange(store, "delete", deletedAppointment);
});

socket.on("approveAppointment", (approvedAppointment) => {
  handleAppointmentChange(store, "approve", approvedAppointment);
});

/* Chat events */

socket.on("userLogout", (data) => {
  store.dispatch(logoutUser());
  store.dispatch(resetUser());
});

socket.on("onlineUsers", (onlineUsers) => {
  store.dispatch(saveOnlineUsersInfo(onlineUsers));
});

socket.on("onlineHospitals", (onlineHospitals) => {
  store.dispatch(saveOnlineHospitalsInfo(onlineHospitals));
});

/* Review events */

socket.on("newReview", (newReview) => {
  const id = store.getState().auth.userInfo?._id;

  if (newReview.hospitalId === id || newReview.userId === id) {
    const existingReview = store.getState().user.userReviewInfo || [];
    const updatedReview = [newReview, ...existingReview];
    store.dispatch(saveReviewInfo(updatedReview));

    //update the review info on the dashboard

    const existingDashboardInfo: userDashboardInfoProps | any =
      store.getState().user.userDashboardInfo || [];

    // the new appointment to replace the old with
    const newReviewDashboardInfo = [newReview, ...existingReview];

    // exclude the former appointment from the dashboardInfo
    const { appointments, ...newDashboardInfo } = existingDashboardInfo;
    newDashboardInfo.reviews = newReviewDashboardInfo;

    //save the new data
    store.dispatch(saveDashboardInfo(newDashboardInfo));
  }
});

socket.on("updateReview", (updatedReview) => {
  handleReviewChange(store, "update", updatedReview);
});

socket.on("deleteReview", (deletedReview) => {
  handleReviewChange(store, "delete", deletedReview);
});

const socketMiddleware =
  (store: MiddlewareAPI) =>
  (next: Dispatch<AnyAction>) =>
  (action: AnyAction) => {
    return next(action);
  };

export default socketMiddleware;
