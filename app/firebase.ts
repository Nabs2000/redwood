import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import firebaseConfig from '../config/firebaseConfig';

// Initialize Firebase
let firebaseApp: FirebaseApp;

if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApp();
}

export { firebaseApp };