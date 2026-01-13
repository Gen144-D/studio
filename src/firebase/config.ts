import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
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


if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined' && !(global as any)._didConnect) {
 (global as any)._didConnect = true;
  console.log('Connecting to Firebase Emulators');
  connectFirestoreEmulator(firestore, 'localhost', 8080);
}


export { app, firestore, auth, storage };
