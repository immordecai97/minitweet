import { doc, getDoc, updateDoc, collection } from "firebase/firestore";
import { db, auth } from "./firebase";
import { updateProfile } from "firebase/auth";


const userRef = collection(db, "usersData")


/**
 * 
 * @param {String} uid 
 * @returns {Object} user account data
 */
export async function getUserAccountById(uid) {
        // Get a document with a given ID
        const docRef = doc(userRef, uid);
        // Get a snapshot of the document
        const docSnap = await getDoc(docRef);

        // If the document exists, return the data of the document. If not, log an error message.
        if (docSnap.exists()) {
                return docSnap.data();
        } else {
                console.log("No such document!");
        }
}


// export const updateUser = async (user) => {
//         try {
//                 console.log("user", user.displayName);
//                 // --> updateProfile: es u metodo que está disponible en el objeto user
//                 const promiseAuth = updateProfile(auth.currentUser, {
//                         displayName: user?.displayName,
//                         // email: user?.email,
//                         photoURL: user?.photoURL
//                 });
//                 const userDoc = doc(userRef, user.uid);
//                 const promiseStore = updateDoc(userDoc, {
//                         username: user?.username,
//                         bio: user?.bio,
//                 });
//                 // Promise.all(): se usa para esperar a que se resuelvan varias promesas, si una de ellas falla, se captura el error.
//                 await Promise.all([promiseAuth, promiseStore]);
//                 return true;
//         } catch (e) {
//                 console.error("Error updating user: ", e.message);
//                 return false
//         }
// }
export const updateUser = async ({ uid, displayName, email, photoURL, username, bio }) => {
        try {
            if (!auth.currentUser) {
                throw new Error("No authenticated user found");
            }
    
            console.log("Updating user profile for:", auth.currentUser.uid);
    
            // Update the user's profile in Firebase Authentication
            const promiseAuth = updateProfile(auth.currentUser, {
                displayName: displayName ?? auth.currentUser.displayName,
                email: email ?? auth.currentUser.email,
                photoURL: photoURL ?? auth.currentUser.photoURL
            });
    
            // Update the user's document in Firestore
            const userDoc = doc(userRef, uid);
            const promiseStore = updateDoc(userDoc, {
                username: username ?? "",
                bio: bio ?? ""
            });
    
            // Wait for both promises to resolve
            await Promise.all([promiseAuth, promiseStore]);
            console.log("User profile updated successfully");
            return true;
        } catch (e) {
            console.error("Error updating user: ", e.message);
            return false;
        }
    }