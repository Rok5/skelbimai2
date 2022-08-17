// /* eslint-disable */
import axios from "axios";
import { showAlert } from "./alert";

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:8000/api/v1/users/login",
      data: {
        email: email,
        password: password,
      },
    });

    if (res.data.status === "success") {
      showAlert("success", "Sėkmingai prisijungta");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "http://127.0.0.1:8000/api/v1/users/logout",
    });
    //reload page
    if ((res.data.status = "success"))
      window.location.replace("http://127.0.0.1:8000/");
  } catch (err) {
    console.log(err.response);
    showAlert("error", "Klaida atsijungiant, bandykite dar");
  }
};

export const forgotPassword = async (email) => {
  try {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:8000/api/v1/users/forgotPassword",
      data: {
        email: email,
      },
    });
    if ((res.data.status = "success"))
      showAlert("", "Laiškas išsiųstas į elektroninį paštą");
  } catch (err) {
    // console.log(err.response);
    showAlert("error", err.response.data.message);
  }
};

export const resetPassword = async (
  password,
  passwordConfirm,
  currentURLApi
) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: `${currentURLApi}`,
      data: {
        password,
        passwordConfirm,
      },
    });

    if (res.data.status === "success") {
      showAlert("success", "Slaptažodis atkurtas");
      window.setTimeout(() => {
        location.assign("/login");
      }, 1500);
    }
  } catch (err) {
    console.log(err);
    showAlert("error", err.response.data.message);
  }
};
