// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyBsIFhcf6TjqxXSn5YVqtsf14CPuxRnEqE",
    authDomain: "wangchuk-93e15.firebaseapp.com",
    databaseURL: "https://wangchuk-93e15-default-rtdb.firebaseio.com",
    projectId: "wangchuk-93e15",
    storageBucket: "wangchuk-93e15.appspot.com",
    messagingSenderId: "627383809873",
    appId: "1:627383809873:web:565131235abfba3b0a0570",
    measurementId: "G-8MNBEQW1HB"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
const analytics = getAnalytics(app);

