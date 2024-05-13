// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "nomadshell-613fe.firebaseapp.com",
    projectId: "nomadshell-613fe",
    storageBucket: "nomadshell-613fe.appspot.com",
    messagingSenderId: "118459844012",
    appId: "1:118459844012:web:01f4f89901cb9de4566609",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
