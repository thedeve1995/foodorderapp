import "./assets/base.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAyi-Oj-JQCSm-Zx_DvMXLN5u7IxGS63Hc",
  authDomain: "istaghfiru-ku.firebaseapp.com",
  projectId: "istaghfiru-ku",
  storageBucket: "istaghfiru-ku.appspot.com",
  messagingSenderId: "640259776850",
  appId: "1:640259776850:web:a9fcd05e0304cc396b9a8b",
  measurementId: "G-4T81NT7DJ1"
};

initializeApp(firebaseConfig);

const app = createApp(App);

app.use(router);

app.mount("#app");
