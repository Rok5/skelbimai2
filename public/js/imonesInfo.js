// /* eslint-disable */
import axios from "axios";
import { showAlert } from "./alert";

export const imonesInfo = async (imonesPav, imonesKodas, kontaktinisAsmuo) => {
  try {
    // console.log(imonesPav, imonesKodas, kontaktinisAsmuo, "funkc");
    const res = await axios({
      method: "POST",
      url: "/api/v1/darbdavioInfo",
      data: {
        imonesPav,
        imonesKodas,
        kontaktinisAsmuo,
      },
    });
    if (res.data.status === "success") {
      showAlert("success", "Įmonės informacija pridėta");
    }
  } catch (err) {
    // console.log(err);
    showAlert("error", err.response.data.message);
  }
};
export const updateImonesInfo = async (
  imonesPav,
  imonesKodas,
  kontaktinisAsmuo
) => {
  try {
    // console.log(imonesPav, imonesKodas, kontaktinisAsmuo, "funkc");
    const res = await axios({
      method: "PATCH",
      url: "/api/v1/darbdavioInfo",
      data: {
        imonesPav,
        imonesKodas,
        kontaktinisAsmuo,
      },
    });
    if (res.data.status === "success") {
      showAlert("success", "Įmonės info pridėta");
    }
  } catch (err) {
    // console.log(err);
    showAlert("error", err.response.data.message);
  }
};

export const rodytiImonesInfo = async (
  imonesPav,
  imonesKodas,
  kontaktinisAsmuo
) => {
  try {
    // console.log(imonesPav, imonesKodas, kontaktinisAsmuo, "funkc");
    const res = await axios({
      method: "GET",
      url: "/api/v1/darbdavioInfo",
      data: {
        imonesPav,
        imonesKodas,
        kontaktinisAsmuo,
      },
    });
    if (res.data.status === "success") {
      showAlert("success", "Įmonės info pridėta");
    }
  } catch (err) {
    // console.log(err);
    showAlert("error", err.response.data.message);
  }
};
