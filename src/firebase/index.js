import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging, getToken,onMessage } from "firebase/messaging";


const firebaseConfig = {
  apiKey: "AIzaSyAyi-Oj-JQCSm-Zx_DvMXLN5u7IxGS63Hc",
  authDomain: "istaghfiru-ku.firebaseapp.com",
  projectId: "istaghfiru-ku",
  storageBucket: "istaghfiru-ku.appspot.com",
  messagingSenderId: "640259776850",
  appId: "1:640259776850:web:a9fcd05e0304cc396b9a8b",
  measurementId: "G-4T81NT7DJ1"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);

export {
  db,
  storage,
  app // Export the storage object
};