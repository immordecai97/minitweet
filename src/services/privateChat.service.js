import { db } from '@services/firebase';
import { collection, addDoc, getDocs, query, where, serverTimestamp, limit, orderBy, onSnapshot } from 'firebase/firestore';

const privateChatCollectionRef = collection(db, 'privateChats');

/**
 * 
 * @param {string} senderID 
 * @param {string} recieverID 
 * @returns {Promise<DocumentReference>}
 */
async function getChatDocument(senderID, recieverID) {
    // Query para verificar que la propiedad users exista y tenga los dos usuarios
    const q = query(privateChatCollectionRef, where('users', '==', {
        [senderID]: true,
        [recieverID]: true
    }), limit(1)); // Limitamos la consulta a un solo documento para optimizar la búsqueda de chats privados en la base de datos de Firestore

    // Buscamos si ya existe un chat privado entre los dos usuarios con la función getDocs() que retorna un objeto de tipo QuerySnapshot
    const chatSnapshot = await getDocs(q);
    // Declaramos una variable que almacenará el documento del chat privado
    let chatDocument = null;

    // Si la consulta está vacía, creamos un nuevo chat privado con los dos usuarios y guardamos el documento en la variable chatDocument
    if (chatSnapshot.empty) {
        chatDocument = await addDoc(privateChatCollectionRef, {
            users: {
                [senderID]: true,
                [recieverID]: true
            }
        });
    } else {
        // Si la consulta no está vacía, guardamos el documento en la variable chatDocument para poder acceder a su ID
        chatDocument = chatSnapshot.docs[0];
    }
    return chatDocument;
}

/**
 * Función que guarda un mensaje privado en la base de datos
 * @param {String} senderID ID del usuario que envía el mensaje
 * @param {String} recieverID ID del usuario que recibe el mensaje
 * @param {String} message Mensaje a enviar
 */
export async function savePrivateMessage(senderID, recieverID, message) {
    
    const chatDocument = await getChatDocument(senderID, recieverID);
    // Guardar mensaje en la subcolección de mensajes
    const messagesRef = collection(db, `privateChats/${chatDocument.id}/messages`);
    await addDoc(messagesRef, {
        userID: senderID,
        message,
        created_at: serverTimestamp()
    });
}

export async function getPrivateMessages(senderID, recieverID, callback) {
    const chatDocument = await getChatDocument(senderID, recieverID);
    const messagesRef = collection(db, `privateChats/${chatDocument.id}/messages`);
    const q = query(messagesRef, orderBy('created_at', 'asc'));
    onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map(doc => {
            return {
                id: doc.id,
                userID: doc.data().userID,
                message: doc.data().message,
                created_at: doc.data().created_at?.toDate()
            };
        });
        callback(messages);
    });
}