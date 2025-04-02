import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBxP0iefpioMikZ9LbwYrWVKEjF_2ixFVo",
    authDomain: "codetranslate-9ec0c.firebaseapp.com",
    projectId: "codetranslate-9ec0c",
    storageBucket: "codetranslate-9ec0c.firebasestorage.app",
    messagingSenderId: "197496166073",
    appId: "1:197496166073:web:003d86d8c94b6946cb2d68",
    measurementId: "G-LR6Y64EGW1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };