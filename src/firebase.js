import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAHrs4DNagcyjAG5u9ILg280HmZFNSpP-A",
  authDomain: "foodspace-4fbb1.firebaseapp.com",
  projectId: "foodspace-4fbb1",
  storageBucket: "foodspace-4fbb1.appspot.com",
  messagingSenderId: "827546519552",
  appId: "1:827546519552:web:f4be2f96c1314e443f70e5",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
