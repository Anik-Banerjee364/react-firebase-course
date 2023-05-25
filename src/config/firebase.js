import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import {getFirestore} from "firebase/firestore"
import {getStorage} from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyBaXS6xYtLF2xrpSUENTdNkKVpGxiUe4VE",
  authDomain: "fir-course1-8d749.firebaseapp.com",
  projectId: "fir-course1-8d749",
  storageBucket: "fir-course1-8d749.appspot.com",
  messagingSenderId: "540560738728",
  appId: "1:540560738728:web:0d37459491971d6cb1b59d",
  measurementId: "G-CJ4K52ZHXB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth  = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
