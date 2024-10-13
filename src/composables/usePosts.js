// composables/usePosts.js
import { ref } from 'vue';
import { createPost, getAllPosts, getPostById, getPostsByUser } from '@services/posts';
import useAuth from '@composables/useAuth';


const { fetchUserById } = useAuth();
const posts = ref([]);

const usePosts = () => {
    const addPost = async (postContent) => {
        await createPost({ ...postContent });
        await fetchPosts();
    };

    const fetchPostsByUserId = async (userId) => {
        posts.value = await getPostsByUser(userId);
    };

    const getAPostById = async (postId) => {
        return await getPostById(postId);
    };

    const fetchPosts = async () => {
        const allPosts = await getAllPosts();
        const userPromises = allPosts.map(async (post) => {
            const user = await fetchUserById(post.userID);
            const postToShow = { ...post, user };
            return postToShow;
        });
        posts.value = await Promise.all(userPromises);
    };

    return {
        posts,
        addPost,
        fetchPosts,
        getAPostById,
        fetchPostsByUserId
    };
};

export default usePosts;