import "regenerator-runtime";
import "../styles/style.css";
import "../styles/responsive.css";
import * as tf from "@tensorflow/tfjs";
import App from "./views/app";

const app = new App({
  button: document.getElementById("btnHamburger"),
  drawer: document.getElementById("link2"),
  content: document.getElementById("main"),
});
window.addEventListener("hashchange", () => {
  app.renderPage();
});
window.addEventListener("load", () => {
  app.renderPage();
});
