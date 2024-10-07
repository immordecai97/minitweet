import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from './firebase';
import { ref } from 'vue';
import { getUserAccountById } from '@services/myAccount';
import { collection, doc, setDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";


// Variable reactiva para el usuario
export const user = ref(null);

// Escuchar cambios en el estado de autenticación
onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser ? currentUser : null;
});

/**
 * Función para crear un usuario
 * @param {{email: String, password: String}} param0 
 */
export const createUser = async ({ email, password, displayName, username }) => {

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, {
            displayName: displayName,
            // photoURL: photoURL // --> proximamente
        });
        user.value = userCredential.user;
        const userRef = collection(db, 'usersData');
        // --> Crear un documento en la colección 'usersData' con el id del usuario
        const userDoc = doc(userRef, userCredential.user.uid);
        // --> Establecer los datos del documento
        await setDoc(userDoc, {
            username: username,
            bio: '',
            // followers: [],               // --> proximamente
            // following: [],               // --> proximamente
            // posts: [],                   // --> proximamente
            // createdAt: new Date(),       // --> proximamente
        });

    } catch (e) {
        console.error("Error creating user: ", e.message);
    }
};

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//! ojo: lo pasé al archivo myAccount.js
// export const updateUser = async (user) => {
//     try {
//         // --> updateProfile: es u metodo que está disponible en el objeto user
//         await user.updateProfile({
//             displayName: user.displayName,
//             photoURL: user.photoURL
//         });

//     } catch (e) {
//         console.error("Error updating user: ", e.message);
//     }
// }

/**
 * Función para iniciar sesión
 * @param {{email: String, password: String}} param0 
 */
export const loginUser = async ({ email, password }) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        user.value = userCredential.user;
    } catch (e) {
        console.error("Error logging in user: ", e.message);
    }
};
/**
 * Función para cerrar sesión
 */
export const logoutUser = async () => {
    try {
        await signOut(auth);
        user.value = null;
    } catch (e) {
        console.error("Error logging out user: ", e.message);
    }
};

/**
 * Función para obtener los datos del usuario autenticado y de la base de datos asociados a ese usuario
 * @returns {Promise<Object>} user account data
 */
export function getUserFromDB() {
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, async (currentUser) => {
            // --> onAuthStateChanged: retorna un unsubscribe function
            // const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            // unsubscribe(); // Desuscribirse inmediatamente después de obtener el estado de autenticación
            if (!currentUser) {
                resolve(null);
                return;
            }
            try {
                const userAccount = await getUserAccountById(currentUser.uid);
                console.log({ ...currentUser, ...userAccount });
                resolve({ ...currentUser, ...userAccount });
            } catch (error) {
                console.error('Error getting user account:', error);
                reject(error);
            }
        });
    });
}






// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// // --> Variable reactiva para almacenar el callback de los observadores y notificar cambios con notifyAll
// let observer = []

// /**
//  * Función para suscribirse a los cambios de autenticación
//  * @param {*} callback 
//  */
// export function suscribeToAuth(callback) {
//         observer.push(callback)
//         notify(callback)
// }

// /**
//  * Función para desuscribirse a los cambios de autenticación
//  * @param {function} callback 
//  */
// export function unsuscribeToAuth(callback) {
//         observer = observer.filter(subscriber => subscriber !== callback)
// }

// /**
//  * Función para notificar a los observadores de los cambios en la autenticación
//  * por ejemplo cuando el usuario inicia sesión, cierra sesión o se registra
//  * @param {function} callback 
//  */
// function notify(callback) {
//         callback({...user.value})
// }

// function notifyAll() {
//         observer.forEach(notify)
// }

// onAuthStateChanged(auth, (currentUser) => {
//         user.value = currentUser ? currentUser : null;
//         notifyAll()
// })