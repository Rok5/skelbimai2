// /* eslint-disable */
import "@babel/polyfill";
import { login, logout } from "./login";
import { signup } from "./signup";
import { userSettings, updatePassword } from "./userSettings";
import { sukurtiSkelbima, istrintiSkelbima } from "./sukurtiSkelbima";
import { imonesInfo } from "./imonesInfo";

// DOM ELEMENTS

const logOutBtn = document.querySelector(".nav__el--logout");
const logInForm = document.querySelector(".formLogin");
const signUpForm = document.querySelector(".formSignup");
const userUpdateNameEmail = document.querySelector(".form-user-data");
const updatePasswordForm = document.querySelector(".form-user-settings");
const sukurtiSkelbimaForma = document.querySelector(".skelbimoKurimoForma");
const sukurtiImonesInfoForma = document.querySelector(".imonesInfoForma");
const trintiSkelbima = document.querySelector(".trintiSkelbima");

if (trintiSkelbima)
  trintiSkelbima.addEventListener("click", (e) => {
    e.preventDefault();
    const skelbimoId = document.getElementById("skelbimas");
    console.log(skelbimoId, "is index.js");

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

    const skelbimoPavadinimas = document.getElementById(
      "skelbimoPavadinimas"
    ).value;
    const imonesPavadinimas =
      document.getElementById("imonesPavadinimas").value;
    const atlyginimas = document.getElementById("atlyginimas").value;
    const miestas = document.getElementById("miestas").value;
    const darboSritis = document.getElementById("sritis").value;
    sukurtiSkelbima(
      skelbimoPavadinimas,
      imonesPavadinimas,
      atlyginimas,
      miestas,
      darboSritis
    );
  });

if (sukurtiImonesInfoForma)
  sukurtiImonesInfoForma.addEventListener("submit", (e) => {
    e.preventDefault();

    const imonesPav = document.getElementById("imonesPavadinimas").value;
    const imonesKodas = document.getElementById("imonesKodas").value;
    const kontaktinisAsmuo = document.getElementById("kontaktinisAsmuo").value;
    console.log(
      "pavadinimas: ",
      imonesPav,
      "imones kodas ",
      imonesKodas,
      "kontaktinis asmuo ",
      kontaktinisAsmuo
    );
    imonesInfo(imonesPav, imonesKodas, kontaktinisAsmuo);
  });
