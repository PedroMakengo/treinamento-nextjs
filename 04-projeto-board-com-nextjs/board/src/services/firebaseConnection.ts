import firebase from "firebase/app";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

let firebaseConfig = {
  apiKey: "AIzaSyDPe97rMNKs4b_89ki8fBVzcmj7yEUkgn0",
  authDomain: "boardapp-3369e.firebaseapp.com",
  projectId: "boardapp-3369e",
  storageBucket: "boardapp-3369e.appspot.com",
  messagingSenderId: "295701875023",
  appId: "1:295701875023:web:c890fce2641a5587245d3a",
  measurementId: "G-DB5B0GC726",
};

if (!firebase) {
  const app = initializeApp(firebaseConfig);
  getAnalytics(app);
}
