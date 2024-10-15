import { ref } from 'vue';
import { db } from '@/services/firebase';
import useAuth from '@composables/useAuth';
import { collection, onSnapshot, getDocs, query, where, serverTimestamp, getDoc, doc, addDoc, orderBy } from 'firebase/firestore';

const { fetchUserById } = useAuth();
const posts = ref([]);
const postsCollection = collection(db, 'posts');

const usePosts = () => {

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
                create_at: serverTimestamp()
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
        posts.value = postsToShow;
    };

    /**
     * Función para obtener un post por su ID
     * Retorna un objeto con los datos del post
     * @param {String} postId 
     * @returns {Object}
     */
    const getAPostById = async (postId) => {
        const docRef = await getDoc(doc(db, 'posts', postId));
        return docRef.data();
    };

    /**
     * Función para obtener todos los posts de la colección
     */
    const fetchPosts = () => {
        const q = query(postsCollection, orderBy('create_at', 'desc'));
        onSnapshot(q, async (snapshot) => {
            const userPromises = snapshot.docs.map(async (doc) => {
                const post = { id: doc.id, ...doc.data() };
                const user = await fetchUserById(post.userID);
                return { ...post, user };
            });
            posts.value = await Promise.all(userPromises);
        });
    };

    return { posts, addPost, fetchPosts, getAPostById, fetchPostsByUserId };
};

export default usePosts;