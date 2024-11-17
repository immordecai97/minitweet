import { db } from '@/services/firebase.service';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Función para crear un nuevo perfil de usuario
 * @param {Object} newUserProfile 
 * @returns Promise<{Object}>
 */
export async function createProfileUser(newUserProfile){
    newUserProfile.createdAt = serverTimestamp();
    newUserProfile.updateAt = serverTimestamp();
    await setDoc(doc(db, 'usersProfiles', newUserProfile.uid), { ...newUserProfile });
    return newUserProfile;
}

/**
 * Función para obtener el perfil de usuario por UID
 * @param {String} uid 
 * @returns Object<{userProfile}>
 */
export async function getProfileUserByUID(uid){
    try {
        const userDoc = await getDoc(doc(db, 'usersProfiles', uid));
        if (userDoc.exists()) return userDoc.data();
    } catch (error) {
        console.error("Error getting user by UID: ", error.message);
    }
}

/**
 * Función para actualizar el perfil de usuario
 * @param {String} userUID 
 * @param {Object} data 
 * @returns Object<{userProfile}>
 */
export async function updateProfileUser(userUID, data){
    data.updateAt = serverTimestamp();
    await updateDoc(doc(db, 'usersProfiles', userUID), data);
    return data;
}