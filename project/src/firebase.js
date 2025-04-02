import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDvsra21ikQj9Xv_buza8bcUOSDulMXYxA",
  authDomain: "code-convertor-25100.firebaseapp.com",
  projectId: "code-convertor-25100",
  storageBucket: "code-convertor-25100.firebasestorage.app",
  messagingSenderId: "547741984281",
  appId: "1:547741984281:web:267d458745ec5f81d16c88"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);