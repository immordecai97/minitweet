import { createUserOnDB, getUserAccountById } from '@services/Account';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@services/firebase';

/**
 * Función que se encarga de crear un usuario en Firebase Authentication y en Firestore.
 * @param {{ email: String, password: String, name: String, username: String }} param0 
 */
export async function createUser({ email, password, name, username }) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const { uid } = userCredential.user;
        await createUserOnDB({ uid, email, name, username });
    } catch (error) {
        console.error("Error creating user: ", error.message);
    }
}

/**
 * Función que se encarga de obtener el estado de autenticación del usuario.
 * También obtiene la información del usuario desde Firestore.
 * @returns {Promise<{ result: Object | null, unsubscribe: Function }>} 
 */
export async function getUserLoggedState() {
    let unsubscribe = () => {};
    const promise = new Promise((resolve, reject) => {
        unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (!currentUser) {
                return resolve({ result: null, unsubscribe });
            }
            try {
                const userAccount = await getUserAccountById(currentUser.uid);
                resolve({ result: userAccount, unsubscribe });
            } catch (error) {
                reject(error);
            }
        });
    });

    return promise;
}

/**
 * Función que se encarga de iniciar sesión en Firebase Authentication.
 * @param {{email: String, password: String}} param0 
 */
export async function login({ email, password }) {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.error("Error logging in: ", error.message);
    }
}

/**
 * Función que se encarga de cerrar la sesión del usuario.
 */
export async function logout() {
    try {
        await auth.signOut();
        return null;
    } catch (error) {
        console.error("Error logging out: ", error.message);
    }
}