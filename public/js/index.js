// /* eslint-disable */
import "@babel/polyfill";
import { login, logout, forgotPassword, resetPassword } from "./login";
import { signup } from "./signup";
import { userSettings, updatePassword } from "./userSettings";
import { sukurtiSkelbima, istrintiSkelbima } from "./sukurtiSkelbima";
import { imonesInfo, updateImonesInfo } from "./imonesInfo";

// DOM ELEMENTS

const logOutBtn = document.querySelector(".logOut");
const logInForm = document.querySelector(".formLogin");
const signUpForm = document.querySelector(".formSignup");
const userUpdateNameEmail = document.querySelector(".form-user-data");
const updatePasswordForm = document.querySelector(".form-user-settings");
const sukurtiSkelbimaForma = document.querySelector(".skelbimoKurimoForma");
const sukurtiImonesInfoForma = document.querySelector(".imonesInfoForma");
const updateImonesInfoForma = document.querySelector(".imonesInfoFormaUpdate");
const trintiSkelbima = document.querySelector(".trintiSkelbima");
const forgotPasswordForm = document.querySelector(".forgotPasswordForm");
const resetPasswordForm = document.querySelector(".resetPasswordForm");

if (forgotPasswordForm)
  forgotPasswordForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;

    forgotPassword(email);
  });

if (resetPasswordForm)
  resetPasswordForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("passwordConfirm").value;
    const currentURL = document.URL;
    // console.log(currentURL, "currentURL is index");
    const currentURLApi = currentURL.replace(
      "/resetPassword/",
      "/api/v1/users/resetPassword/"
    );
    // console.log(currentURLApi);
    resetPassword(password, passwordConfirm, currentURLApi);
  });

if (trintiSkelbima)
  trintiSkelbima.addEventListener("click", (e) => {
    e.preventDefault();
    const skelbimoId = document.getElementById("skelbimas");
    // console.log(skelbimoId, "is index.js");

    istrintiSkelbima(skelbimoId);
  });

if (logOutBtn) logOutBtn.addEventListener("click", logout);

if (logInForm)
  logInForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    login(email, password);
  });

if (signUpForm)
  signUpForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const name = document.getElementById("name").value;
    const password = document.getElementById("pass").value;
    const passwordConfirm = document.getElementById("repass").value;
    const role = document.getElementById("role").value;
    signup(email, password, passwordConfirm, role, name);
  });

if (userUpdateNameEmail)
  userUpdateNameEmail.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const name = document.getElementById("name").value;
    userSettings(email, name);
  });

if (updatePasswordForm)
  updatePasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;
    const currentPassword = document.getElementById("password-current").value;

    await updatePassword(currentPassword, password, passwordConfirm);
    document.getElementById("password-current").value = "";
    document.getElementById("password").value = "";
    document.getElementById("password-confirm").value = "";
  });

if (sukurtiSkelbimaForma)
  sukurtiSkelbimaForma.addEventListener("submit", (e) => {
    e.preventDefault();

    const pareiguPavadinimas =
      document.getElementById("pareiguPavadinimas").value;
    const imonesPavadinimas =
      document.getElementById("imonesPavadinimas").value;
    const atlyginimas = document.getElementById("atlyginimas").value;
    const miestas = document.getElementById("miestas").value;
    const darboSritis = document.getElementById("sritis").value;

    const reikalavimaiDarbuotojui = document.getElementById(
      "reikalavimaiDarbuotojui"
    ).value;
    const imoneSiulo = document.getElementById("imoneSiulo").value;
    const informacijaApieImone = document.getElementById(
      "informacijaApieImone"
    ).value;
    const darboPobudis = document.getElementById("darboPobudis").value;
    const atlyginimoTipas = document.getElementById("atlyginimoTipas").value;
    // console.log(pareiguPavadinimas);
    sukurtiSkelbima(
      pareiguPavadinimas,
      imonesPavadinimas,
      atlyginimas,
      miestas,
      darboSritis,
      reikalavimaiDarbuotojui,
      imoneSiulo,
      informacijaApieImone,
      darboPobudis,
      atlyginimoTipas
    );
  });

if (sukurtiImonesInfoForma)
  sukurtiImonesInfoForma.addEventListener("submit", (e) => {
    e.preventDefault();

    const imonesPav = document.getElementById("imonesPavadinimas").value;
    const imonesKodas = document.getElementById("imonesKodas").value;
    const kontaktinisAsmuo = document.getElementById("kontaktinisAsmuo").value;
    // // console.log(
    //   "pavadinimas: ",
    //   imonesPav,
    //   "imones kodas ",
    //   imonesKodas,
    //   "kontaktinis asmuo ",
    //   kontaktinisAsmuo
    // );
    imonesInfo(imonesPav, imonesKodas, kontaktinisAsmuo);
  });

if (updateImonesInfoForma)
  updateImonesInfoForma.addEventListener("submit", (e) => {
    e.preventDefault();

    const imonesPav = document.getElementById("imonesPavadinimasUpdate").value;
    const imonesKodas = document.getElementById("imonesKodasUpdate").value;
    const kontaktinisAsmuo = document.getElementById(
      "kontaktinisAsmuoUpdate"
    ).value;
    // console.log(
    //   "pavadinimas: ",
    //   imonesPav,
    //   "imones kodas ",
    //   imonesKodas,
    //   "kontaktinis asmuo ",
    //   kontaktinisAsmuo
    // );
    updateImonesInfo(imonesPav, imonesKodas, kontaktinisAsmuo);
  });
