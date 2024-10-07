// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCCXbtrx-NDz3LcIRIM6Jj5Q9ewN0pukDE",
  authDomain: "miniredsocial-83a73.firebaseapp.com",
  projectId: "miniredsocial-83a73",
  storageBucket: "miniredsocial-83a73.appspot.com",
  messagingSenderId: "276706105554",
  appId: "1:276706105554:web:5bb26e03f9931e7ff6f50b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Inicia la conexion con el servicio de Firestore y exporta la referencia a la base de datos
export const db = getFirestore(app)

// Inicia la conexion con el servicio de Auth y exporta la referencia a la autenticacion
export const auth = getAuth(app)