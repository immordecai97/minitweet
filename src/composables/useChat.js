import { ref } from 'vue';
import { db } from '@/services/firebase.service';
import { addDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore';

const useChat = () => {
    const messages = ref([]);
    const unsubscribe = ref(null);

    const getMessages = async (chatId) => {
        try {
            const querySnapshot = await getDocs(collection(db, 'chats', chatId, 'messages'));
            messages.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error getting messages: ", error.message);
        }
    };

    const sendMessage = async (chatId, message) => {
        try {
            await addDoc(collection(db, 'chats', chatId, 'messages'), {
                ...message,
                createdAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Error sending message: ", error.message);
        }
    };

    return { messages, unsubscribe, getMessages, sendMessage };
}

export default useChat;