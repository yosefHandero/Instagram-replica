import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

import firebase  from 'firebase/compat/app';

// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "instagram-replica-dab56.firebaseapp.com",
  projectId: "instagram-replica-dab56",
  storageBucket: "instagram-replica-dab56.appspot.com",
  messagingSenderId: "222035989808",
  appId: "1:222035989808:web:30399c9ee3d251019ea4f5",
  measurementId: "G-STX1588H7H"
};
// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)
export const auth = getAuth(app)
export default firebase
export const db = getFirestore(app);

