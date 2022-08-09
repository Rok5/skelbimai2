// /* eslint-disable */
import axios from "axios";
import { showAlert } from "./alert";

export const sukurtiSkelbima = async (
  skelbimoPavadinimas,
  imonesPavadinimas,
  atlyginimas,
  miestas,
  darboSritis
) => {
  try {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:8000/api/v1/skelbimai",
      data: {
        pavadinimas: skelbimoPavadinimas,
        imone: imonesPavadinimas,
        atlyginimas,
        miestas,
        darboSritis,
      },
    });
    if (res.data.status === "success") {
      showAlert("success", "Skelbimas sukurtas");
    }
  } catch (err) {
    console.log(err);
    showAlert("error", err.response.data.message);
  }
};

export const istrintiSkelbima = async (skelbimoId) => {
  try {
    const regex = /(?<=\>).+?(?=\<)/gm;

    const skelbimoIdIString = skelbimoId.outerHTML;
    const regexDone = regex.exec(skelbimoIdIString);

    console.log(regexDone[0], "regex Done");

    const res = await axios({
      method: "DELETE",
      url: `http://127.0.0.1:8000/api/v1/skelbimai/${regexDone}`,
      data: {},
    });
    if (res.data.status === "success") {
      showAlert("success", "Skelbimas ištrintas");
    }
  } catch (err) {
    console.log(err);
    showAlert("error", err.response.data.message);
  }
};
