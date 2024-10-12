import { ref } from 'vue';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db } from '@services/firebase';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

const user = ref(null);
const unsubscribe = ref(null);

const useAuth = () => {
    const login = async ({ email, password }) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error("Error logging in: ", error.message);
        }
    };

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
            // Crear documento de usuario en Firestore
            await setDoc(doc(db, 'usersProfiles', userId), { ...newUser });
        } catch (error) {
            console.error("Error registering: ", error.message);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error logging out: ", error.message);
        }
    };

    const fetchUserData = async (userId) => {
        try {
            const userDoc = await getDoc(doc(db, 'usersProfiles', userId));
            if (userDoc.exists()) {
                // user.value = { ...user.value, ...userDoc.data() };
                user.value = {...userDoc.data() };
            }
        } catch (error) {
            console.error("Error fetching user data: ", error.message);
        }
    };

    const updateUser = async (userId, updatedData) => {
        try {
            await updateDoc(doc(db, 'users', userId), updatedData);
            // Actualizar el estado local del usuario
            user.value = { ...user.value, ...updatedData };
        } catch (error) {
            console.error("Error updating user data: ", error.message);
        }
    };

    const getUserById = async (userId) => {
        try {
            const userDoc = await getDoc(doc(db, 'usersProfiles', userId));
            if (userDoc.exists()) {
                return userDoc.data();
            } else {
                throw new Error("User not found");
            }
        } catch (error) {
            console.error("Error fetching user by ID: ", error.message);
            throw error;
        }
    };

    const initAuth = async () => {
        return new Promise((resolve) => {
            unsubscribe.value = onAuthStateChanged(auth, async (currentUser) => {
                if (currentUser) {
                    user.value = currentUser;
                    await fetchUserData(currentUser.uid);
                } else {
                    user.value = null;
                }
                resolve();
            });
        });
    };

    const cleanupAuth = () => {
        if (unsubscribe.value) {
            unsubscribe.value();
        }
    };

    return { user, login, register, logout, updateUser, getUserById, initAuth, cleanupAuth };
};

export default useAuth;