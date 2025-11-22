import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import firebaseConfig from "../config/firebaseConfig";
import { getFirestore } from "firebase/firestore";

// Initialize Firebase
let firebaseApp: FirebaseApp;

if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApp();
}

const db = getFirestore(firebaseApp);

export { firebaseApp, db };
