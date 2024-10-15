import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCCXbtrx-NDz3LcIRIM6Jj5Q9ewN0pukDE",
  authDomain: "miniredsocial-83a73.firebaseapp.com",
  projectId: "miniredsocial-83a73",
  storageBucket: "miniredsocial-83a73.appspot.com",
  messagingSenderId: "276706105554",
  appId: "1:276706105554:web:5bb26e03f9931e7ff6f50b"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth(app)