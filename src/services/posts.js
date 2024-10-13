// services/posts.js
import { db } from '@services/firebase';
import { collection, getDocs, query, where, serverTimestamp, getDoc, doc, addDoc, orderBy } from 'firebase/firestore';
const postsCollection = collection(db, 'posts');

export const createPost = async ({ userID, title, body }) => {
    try {
        const docRef = await addDoc(postsCollection, {
            userID,
            title,
            body,
            create_at: serverTimestamp()
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (error) {
        console.error("Error adding document: ", error);
    }
};

export const getPostsByUser = async (userId) => {
    const q = query(postsCollection, where('userID', '==', userId), orderBy('create_at', 'desc'));
    const querySnapshot = await getDocs(q);
    const posts = [];
    querySnapshot.forEach((doc) => {
        posts.push({ ...doc.data() });
        // posts.push({ id: doc.id, ...doc.data() });
    });
    return posts;
};

export const getAllPosts = async () => {
    // Crea una consulta que ordena los documentos por el campo 'create_at' en orden descendente
    const q = query(postsCollection, orderBy('create_at', 'desc'));
    const querySnapshot = await getDocs(q);
    const posts = [];
    querySnapshot.forEach((doc) => {
        posts.push({ id: doc.id, ...doc.data() });
    });
    return posts;
};

export const getPostById = async (postId) => {
    const docRef = await getDoc(doc(db, 'posts', postId));
    return docRef.data();
}
