import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// The web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCnjI3Gyv_ArUofZwwDI4LOM5CcU_wlbt4",
  authDomain: "studio-625719806-57d5a.firebaseapp.com",
  projectId: "studio-625719806-57d5a",
  storageBucket: "studio-625719806-57d5a.appspot.com",
  messagingSenderId: "490252716094",
  appId: "1:490252716094:web:bd97e6d05eac3c21b2e96f",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const firestore = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, firestore, auth, storage };
