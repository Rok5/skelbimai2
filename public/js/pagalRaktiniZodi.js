// /* eslint-disable */
import axios from "axios";
import { showAlert } from "./alert";

export const filterPagalRaktiniZodi = async (key) => {
  // const filtras ={pavadinimas: { $regex: new RegExp(key, "i") },
  try {
    // req.param(key) = key;
    // console.log(req.query, "parametrai");
    // console.log(key);
    const res = await axios({
      method: "GET",
      url: "http://127.0.0.1:8000/",
      data: {
        key,
      },
    });

    if (res.data.status === "success") {
      showAlert("success", "Sėkmingai prisijungta");
      window.setTimeout(() => {
        location.reload();
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
    console.log(err);
  }
};
