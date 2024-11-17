import { db } from '@/services/firebase.service';
import { collection, addDoc, query, serverTimestamp, onSnapshot, orderBy, limit } from 'firebase/firestore';

/**
 * Función para obtener los comentarios de un post especifico
 * @param {String} postID 
 * @returns Array<Comment>
 */
export function getCommentsFromFirestore(postID, callback){
    // const q = query(collection(db, 'posts', postID, 'comments'), orderBy('createdAt', 'asc'));
    const q = query(collection(db, 'posts', postID, 'comments'), orderBy('createdAt', 'asc'), limit(20));
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        const comments = querySnapshot.docs.map((doc) => {
            return {
                id: doc.id,
                ...doc.data()
            }
        })
        callback(comments);
        return unsubscribe;
    })
}

export async function saveCommentToFirestore({ postID, comment, userUID}) {
    try {
        await addDoc(collection(db, 'posts', postID, 'comments'), {
            userUID,
            comment,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        })
    } catch (error) {
        console.error('Error guardando comentario:', error);
        // throw error;
    }
}