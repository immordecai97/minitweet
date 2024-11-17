import { ref } from 'vue';
import { getAllPostFromFirestore, createNewPostOnFirestore, getAllPostByUserUIDFromFirestore, getPostByIdFromFirestore, updatePostOnFirestore } from '@/services/post.service';

const usePosts = () => {
    const postsList = ref([]);
    const unsubscribe = ref(null);

    /**
     * Función para obtener todos los posts de Firestore ordenados por fecha de creación,
     * de forma descendente y en tiempo real
     * @param {Function} callback 
     * @returns 
     */
    function getAllPosts(callback) {
        try {
            const unsubscribe = getAllPostFromFirestore(callback);
            return unsubscribe;
        } catch (error) {
            console.error("Error getting documents: ", error);

        }
    }

    /**
     * Función para agregar un nuevo post/tweet en Firestore
     * @param {Object} newPost 
     */
    async function createNewPost(newPost) {
        try {
            await createNewPostOnFirestore(newPost);
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    }

    /**
     * Función para obtener todos los posts de un usuario por su UID
     * @param {String} userId 
     * @returns {Array} userPosts
     */
    function getAllPostsByUserUID(userId) {
        try {
            const userPosts = getAllPostByUserUIDFromFirestore(userId);
            return userPosts;
        } catch (error) {
            console.error("Error getting documents: ", error);
        }
    }

    /**
     * Función para obtener un post por su ID
     * @param {String} postID 
     * @returns 
     */
    async function getPostByID(postID) {
        try {
            const post = await getPostByIdFromFirestore(postID);
            return post;
        } catch (error) {
            console.error("Error getting document: ", error);
        }
    }

    /**
     * Función para actualizar un post por su ID
     * @param {String} postID 
     * @param {String} updatedPost 
     */
    async function updatePost(postID, updatedPost) {
        try {
            await updatePostOnFirestore(postID, updatedPost);
        } catch (error) {
            console.error("Error updating document: ", error);
        }
    }

    return {
        postsList,
        unsubscribe,
        getAllPosts,
        createNewPost,
        getAllPostsByUserUID,
        getPostByID,
        updatePost,
    };
};

export default usePosts;