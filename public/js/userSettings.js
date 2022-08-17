// /* eslint-disable */
import axios from "axios";
import { showAlert } from "./alert";

export const userSettings = async (email, name) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: "/api/v1/users/updateMe",
      data: {
        email,
        name,
      },
    });

    if (res.data.status === "success") {
      showAlert("success", "Atnaujinta");
      window.setTimeout(() => {
        location.assign("/me");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const updatePassword = async (
  currentPassword,
  password,
  passwordConfirm
) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: "/api/v1/users/updatePassword",
      data: {
        currentPassword,
        password,
        passwordConfirm,
      },
    });
    if (res.data.status === "success") {
      showAlert("success", "Updated");
    }
  } catch (err) {
    // console.log(err);
    showAlert("error", err.response.data.message);
  }
};
