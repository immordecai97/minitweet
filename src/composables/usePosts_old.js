import { ref } from 'vue';
import { db } from '@/services/firebase.service';
import useAuth from '@composables/useAuth';
import { collection, onSnapshot, getDocs, query, where, serverTimestamp, getDoc, doc, addDoc, orderBy } from 'firebase/firestore';

const { fetchUserById } = useAuth();
const postsCollection = collection(db, 'posts');

const usePosts = () => {
    const posts = ref([]);
    /**
     * Función para agregar un nuevo post/tweet
     * @param {Object} postContent 
     */
    const addPost = async (postContent) => {
        try {
            const { userID, title, body } = postContent;
            await addDoc(postsCollection, {
                userID,
                title,
                body,
                create_at: serverTimestamp(),
                // createdAt: serverTimestamp() // TODO -> CAMBIAR A ESTA PROPIEDAD
            });
            fetchPosts();
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };

    /**
     * Función para obtener todos los posts de un usuarios según su ID
     * @param {String} userId 
     */
    const fetchPostsByUserId = async (userId) => {
        const q = query(postsCollection, where('userID', '==', userId), orderBy('create_at', 'desc'));
        const querySnapshot = await getDocs(q);
        const userPosts = [];
        querySnapshot.forEach((doc) => {
            userPosts.push({ ...doc.data() });
        });
        const user = await fetchUserById(userId);
        const postsToShow = userPosts.map(post => ({ ...post, user }));
        return postsToShow;
        // posts.value = postsToShow;
    };

    // ? respaldo
    // const fetchPostsByUserId = async (userId) => {
    //     const q = query(postsCollection, where('userID', '==', userId), orderBy('create_at', 'desc'));
    //     const querySnapshot = await getDocs(q);
    //     const userPosts = [];
    //     querySnapshot.forEach((doc) => {
    //         userPosts.push({ ...doc.data() });
    //     });
    //     const user = await fetchUserById(userId);
    //     const postsToShow = userPosts.map(post => ({ ...post, user }));
    //     posts.value = postsToShow;
    // };

    /**
     * Función para obtener un post por su ID
     * Retorna un objeto con los datos del post
     * @param {String} postId 
     * @returns {Object}
     */
    const getAPostById = async (postId) => {
        try {
            const currentPostDoc = await getDoc(doc(db, 'posts', postId));
            const user = await fetchUserById(currentPostDoc.data().userID);
            const post = { id: currentPostDoc.id, ...currentPostDoc.data(), user };
            console.log(post);
            return post;
        } catch (error) {
            console.error("Error getting document: ", error);
            return null;
        }
    };

    /**
     * Función para obtener todos los posts de la colección
     */
    const fetchPosts = () => {
        return new Promise((resolve, reject) => {
            const q = query(postsCollection, orderBy('create_at', 'desc'));
            onSnapshot(q, async (snapshot) => {
                try {
                    const userPromises = snapshot.docs.map(async (doc) => {
                        const post = { id: doc.id, ...doc.data() };
                        const user = await fetchUserById(post.userID);
                        return { ...post, user };
                    });
                    posts.value = await Promise.all(userPromises);
                    resolve();
                } catch (error) {
                    console.error("Error fetching posts: ", error);
                    reject(error);
                }
            });
        });
    };

    // /**
    //  * Función para agregar un comentario a un post
    //  * @param {String} postId 
    //  * @param {Object} commentContent 
    //  */
    // const addCommentToPost = async (postId, commentContent) => {
    //     try {
    //         const { userID, body } = commentContent;
    //         const commentsCollection = collection(db, 'posts', postId, 'comments');
    //         await addDoc(commentsCollection, {
    //             userID,
    //             body,
    //             create_at: serverTimestamp()
    //         });
    //     } catch (error) {
    //         console.error("Error adding comment: ", error);
    //     }
    // };

    // /**
    //  * Función para obtener los comentarios de un post
    //  * @param {String} postId 
    //  * @returns {Array}
    //  */
    // const fetchCommentsByPostId = async (postId) => {
    //     const commentsCollection = collection(db, 'posts', postId, 'comments');
    //     const q = query(commentsCollection, orderBy('create_at', 'desc'));
    //     const querySnapshot = await getDocs(q);
    //     const comments = [];
    //     querySnapshot.forEach((doc) => {
    //         comments.push({ id: doc.id, ...doc.data() });
    //     });
    //     return comments;
    // };

    return {
        posts,
        addPost,
        fetchPosts,
        getAPostById,
        fetchPostsByUserId,
        // addCommentToPost,
        // fetchCommentsByPostId
    };
};

export default usePosts;