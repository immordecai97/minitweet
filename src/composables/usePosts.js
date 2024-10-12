// composables/usePosts.js
import { ref } from 'vue';
import { createPost, getAllPosts, getPostById, getPostsByUser } from '@services/posts';

const posts = ref([]);

const usePosts = () => {
    const addPost = async (userId, postContent) => {
        await createPost(userId, postContent);
    };

    const fetchPostsByUserId = async (userId) => {
        posts.value = await getPostsByUser(userId);
    };

    const getAPostById = async (postId) => {
        return await getPostById(postId);
    };

    const fetchPosts = async () => {
        posts.value = await getAllPosts();
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