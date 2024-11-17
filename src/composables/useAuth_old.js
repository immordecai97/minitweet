import { ref } from 'vue';
import { auth, db } from '@/services/firebase.service';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, setPersistence, browserLocalPersistence } from 'firebase/auth';
import useStorage from './useStorage';

const { uploadFile, getFileURL } = useStorage();
const user = ref(null);
const unsubscribe = ref(null);

const useAuth = () => {

    /**
     * Función para iniciar sesión
     * @param {{email: String, password: String}} param0 
     */
    const login = async ({ email, password }) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            user.value = await fetchUserById(userCredential.user.uid);
            localStorage.setItem('user', JSON.stringify(user.value));
        } catch (error) {
            console.error("Error logging in: ", error.message);
        }
    };

    /**
     * Función para registrar un nuevo usuario
     * @param {{name: String, username: String, email: String, password: String}} param0 
     */
    const register = async ({ name, username, email, password }) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const userId = userCredential.user.uid;
            const newUser = {
                uid: userId,
                name,
                username,
                email,
                bio: null,
                photoURL: null,
                coverPhotoURL: null,
                followers: [],
                following: [],
                posts: [],
                createdAt: serverTimestamp(),
                updateAt: serverTimestamp()
            }
            await setDoc(doc(db, 'usersProfiles', userId), { ...newUser });
            user.value = newUser;
            localStorage.setItem('user', JSON.stringify(user.value));
        } catch (error) {
            console.error("Error registering: ", error.message);
        }
    };

    /**
     * Función para cerrar sesión
     */
    const logout = async () => {
        try {
            await signOut(auth);
            cleanupAuth();
            localStorage.removeItem('user');
            user.value = null;
        } catch (error) {
            console.error("Error logging out: ", error.message);
        }
    };

    /**
     * Función para obtener los datos de un usuario por su ID
     * Retorna un objeto con los datos del usuario
     * @param {String} userId 
     * @returns {Object}
     */
    const fetchUserById = async (userId) => {
        try {
            const userDoc = await getDoc(doc(db, 'usersProfiles', userId));
            if (userDoc.exists()) {
                return userDoc.data();
            }
        } catch (error) {
            console.error("Error fetching user data: ", error.message);
        }
    };

    /**
     * Función para actualizar los datos de un usuario
     * @param {Object} updatedData 
     */
    const updateUser = async (updatedData) => {
        try {
            await updateDoc(doc(db, 'usersProfiles', user.value.uid), updatedData);
            user.value = { ...user.value, ...updatedData };
            localStorage.setItem('user', JSON.stringify(user.value)); // Actualizar en localStorage
        } catch (error) {
            console.error("Error updating user data: ", error.message);
        }
    };

    /**
     * Función para actualizar la foto de perfil de un usuario
     * @param {{photoURL: string}} param0 --> photoURL: es la propiedad del usuario que se va a actualizar 
     * @param {File} filePhoto  --> filePhoto: es el archivo de la foto de perfil
     */
    const updateProfilePhoto = async (filePhoto) => {
        const fileExtension = filePhoto.name.split('.').pop();
        // const fileName = `${filePhoto.name}.${fileExtension}`;
        // const filePath = `users/${user.value.uid}/profilePhotos/${filePhoto.name}`;
        const filePath = `users/${user.value?.uid}/profilePhoto/profilePhoto.${fileExtension}`;
        await uploadFile(filePath, filePhoto);
        const photoURL = await getFileURL(filePath);
        updateUser({ photoURL });
    }
    const updateCoverPhoto = async (filePhoto) => {
        const fileExtension = filePhoto.name.split('.').pop();
        // const fileName = `${filePhoto.name}.${fileExtension}`;
        // const filePath = `users/${user.value.uid}/profilePhotos/${filePhoto.name}`;
        const filePath = `users/${user.value?.uid}/coverPhoto/coverPhoto.${fileExtension}`;
        await uploadFile(filePath, filePhoto);
        const coverPhotoURL = await getFileURL(filePath);
        updateUser({ coverPhotoURL });
    }

    /**
     * Función para verificar si el usuario está autenticado
     */
    const checkAuth = async () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            user.value = JSON.parse(storedUser);
        } else {
            await initAuth();
        }
    };

    /**
     * Función para inicializar la autenticación
     * Retorna una promesa que se resuelve cuando se ha inicializado la autenticación
     * @returns {Promise}
     */
    const initAuth = async () => {
        return new Promise((resolve, reject) => {
            try {
                setPersistence(auth, browserLocalPersistence).then(() => {
                    const storedUser = localStorage.getItem('user');
                    if (storedUser) {
                        user.value = JSON.parse(storedUser);
                    }
                    unsubscribe.value = onAuthStateChanged(auth, async (currentUser) => {
                        if (currentUser) {
                            user.value = await fetchUserById(currentUser.uid);
                            localStorage.setItem('user', JSON.stringify(user.value)); // Guardar en localStorage
                        } else {
                            user.value = null;
                            localStorage.removeItem('user'); // Eliminar de localStorage
                        }
                        resolve();
                    });
                }).catch((error) => {
                    console.error("Error setting persistence: ", error.message);
                    reject(error);
                });
            } catch (error) {
                console.error("Error initializing auth: ", error.message);
                reject(error);
            }
        });
    };

    /**
     * Función para limpiar la autenticación
     */
    const cleanupAuth = () => {
        if (unsubscribe.value) {
            unsubscribe.value();
        }
    };

    return {
        user,
        login,
        register,
        logout,
        updateUser,
        fetchUserById,
        checkAuth,
        //  initAuth,
        cleanupAuth,
        updateProfilePhoto,
        updateCoverPhoto
    };
};

export default useAuth;