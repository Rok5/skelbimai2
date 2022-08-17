// /* eslint-disable */
import axios from "axios";
import { showAlert } from "./alert";
export const signup = async (email, password, passwordConfirm, role, name) => {
  // console.log(email, "sign up funkcija");
  try {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:8000/api/v1/users/signup",
      data: {
        email: email,
        password: password,
        passwordConfirm,
        role,
        name,
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
