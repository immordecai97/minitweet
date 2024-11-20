//------------------------------------------------------------------- FIREBASE CONFIG
import { db } from '@/services/firebase.service';
//------------------------------------------------------------------- FIREBASE SERVICES
import { addDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore';
//------------------------------------------------------------------- VUE COMPOSITION API
import { ref } from 'vue';
//------------------------------------------------------------------- METHODS
const useChat = () => {
	//------------------------------------------------------------------- VARIABLES
	const messages = ref([]);
	const unsubscribe = ref(null);

	/**
	 * Función para obtener los mensajes de un chat
	 * @param {String} chatId 
	 */
	async function getMessages(chatId) {
		try {
			const querySnapshot = await getDocs(collection(db, 'chats', chatId, 'messages'));
			messages.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
		} catch (error) {
			console.error("Error getting messages: ", error.message);
		}
	}

	/**
	 * Función para enviar un mensaje a un chat privado
	 * @param {String} chatId 
	 * @param {String} message 
	 */
	async function sendMessage(chatId, message) {
		try {
			await addDoc(collection(db, 'chats', chatId, 'messages'), {
				...message,
				createdAt: serverTimestamp()
			});
		} catch (error) {
			console.error("Error sending message: ", error.message);
		}
	}

	return {
		messages,
		unsubscribe,
		getMessages,
		sendMessage

	};
}

export default useChat;