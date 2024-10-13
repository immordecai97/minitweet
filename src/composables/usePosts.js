// composables/usePosts.js
import { ref } from 'vue';
import { createPost, getPostById, getPostsByUser } from '@services/posts';
import useAuth from '@composables/useAuth';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '@/services/firebase';


const { fetchUserById } = useAuth();
const posts = ref([]);

const usePosts = () => {
    const addPost = async (postContent) => {
        await createPost({ ...postContent });
        fetchPosts();
    };

    const fetchPostsByUserId = async (userId) => {
        const userPosts = await getPostsByUser(userId);
        const user = await fetchUserById(userId);
        const postsToShow = userPosts.map(post => ({ ...post, user }));
        posts.value = postsToShow;
    };

    const getAPostById = async (postId) => {
        return await getPostById(postId);
    };

    const fetchPosts = () => {
        const q = query(collection(db, 'posts'), orderBy('create_at', 'desc'));
        onSnapshot(q, async (snapshot) => {
            const userPromises = snapshot.docs.map(async (doc) => {
                const post = { id: doc.id, ...doc.data() };
                const user = await fetchUserById(post.userID);
                return { ...post, user };
            });
            posts.value = await Promise.all(userPromises);
        });
    };

    return {
        posts,
        addPost,
        fetchPosts,
        getAPostById,
        fetchPostsByUserId,
    };
};

export default usePosts;