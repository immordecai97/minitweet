// services/posts.js
import { db } from '@services/firebase';
import { collection, addDoc, getDocs, query, where, serverTimestamp, getDoc, doc } from 'firebase/firestore';
const postsCollection = collection(db, 'posts');


export const createPost = async (userId, postContent) => {
    try {
        const docRef = await addDoc(postsCollection, {
            userId,
            content: postContent,
            timestamp: serverTimestamp()
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (error) {
        console.error("Error adding document: ", error);
    }
};

export const getPostsByUser = async (userId) => {
    const q = query(collection(db, 'posts'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const posts = [];
    querySnapshot.forEach((doc) => {
        posts.push({ id: doc.id, ...doc.data() });
    });
    return posts;
};

export const getAllPosts = async () => {
    const querySnapshot = await getDocs(collection(db, 'posts'));
    const posts = [];
    querySnapshot.forEach((doc) => {
        posts.push({ id: doc.id, ...doc.data() });
    });
    return posts;
}

export const getPostById = async (postId) => {
    const docRef = await getDoc(doc(db, 'posts', postId));
    return docRef.data();
}
