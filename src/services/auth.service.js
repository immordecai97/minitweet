import { auth } from '@/services/firebase.service';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

/**
 * Funcion para registrar un nuevo usuario
 * @param {{email: String, password: String}} param0 
 * @returns Promise<{userCredential}>
 */
export async function authRegister({ email, password }) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential;
    } catch (error) {
        console.error("Error registering: ", error.message);
    }
}

/**
 * Funcion para iniciar sesion del usuario
 * @param {{email: String, password: String}} param0 
 * @returns Promise<{userCredential}>
 */
export async function authlogin({ email, password }) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential;
    } catch (error) {
        console.error("Error logging in: ", error.message);
    }
}

/**
 * Funcion para cerrar sesion del usuario
 * @returns Promise<void>
 */
export async function authLogout() {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Error logging out: ", error.message);
    }
}


/**
 * Función para obtener el estado de autenticación del usuario
 * @returns Promise<{user}>
 */
//? NOTA: Esta es la opción 1 de como se puede usar onAuthStateChanged de manera asincrona con callbacks
export async function authState(callback) {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        callback(user);
        unsubscribe();
    });
}
//? NOTA: Esta es la opción 2 de como se puede usar onAuthStateChanged de manera asincrona con promesas
// export async function authState() {
//     return new Promise((resolve, reject) => {
//         try {
//             const unsubscribe = onAuthStateChanged(auth, (user) => {
//                 resolve(user);
//                 unsubscribe();
//             });
//         } catch (error) {
//             reject(error);
//         }
//     })
// }