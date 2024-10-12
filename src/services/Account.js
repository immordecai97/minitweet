import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import { db } from '@services/firebase';
import UserAccount from '@models/UserAccount';

const usersCollectionRef = collection(db, "usersProfiles")

export async function createUserOnDB({ uid, email, name, username }) {
    try {
        const userAccount = new UserAccount({
            uid: uid,
            email: email,
            name: name,
            username: username
        })
        const userDoc = doc(usersCollectionRef, uid);
        await setDoc(userDoc, userAccount.toJSON())
    } catch (e) {
        console.error("Error creating user: ", e.message);
    }
}

export async function getUserAccountById(uid) {
    try {
        const userDoc = doc(usersCollectionRef, uid);
        const profile = await getDoc(userDoc);
        return profile.data();
    } catch (error) {
        console.error("Error getting user account: ", error.message);
    }
}