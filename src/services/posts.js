import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

import { getUserFromDB } from "@services/auth";

/**
 * Crear una referencia a la coleccion de posts
 */
const postRef = collection(db, "posts")

/**
 * Función que crea un nuevo post en la base de datos
 * @param {*} oPost 
 */
export const createPost = async (oPost = {}) => {
        try {
                const user = await getUserFromDB()
                const newPost = {
                        ...oPost,
                        userData: { 
                                uid: user.uid,
                                displayName: user.displayName,
                                email: user.email,
                                username: user.username,
                                photoURL: user?.photoURL, // -> proximamente
                         },
                }
                await addDoc(postRef, {
                        ...newPost,
                        create_at: serverTimestamp(),
                })
        } catch (e) {
                console.error("Error adding document: ", e.message)
        }
}

/**
 * Función que obtiene todos los posts de la base de datos
 * @callback callback
 */
export const getPosts = (callback) => {
        try {
                // -> query: Crea una consulta de Firestore
                const queryBySnapshot = query(postRef, orderBy("create_at", "desc"))
                // --> onSnapshot: Escucha los cambios en la base de datos en tiempo real
                onSnapshot(queryBySnapshot, (snapshot) => {
                        // console.log(snapshot) // --> esto es un objeto de tipo QuerySnapshot: es un objeto que contiene los resultados de una consulta a una base de datos Firestore
                        // console.log(queryBySnapshot)// --> esto es un objeto de tipo Query: es un objeto que representa una consulta a una base de datos Firestore. Puede contener cero o más documentos y puede escucharse en tiempo real.
                        const aPosts = snapshot.docs.map((doc) => doc.data()) // --> esto es un array de objetos de tipo DocumentSnapshot: es un objeto que contiene los datos de un documento en una base de datos Firestore. Los DocumentSnapshot ofrecen acceso a los datos del documento y permiten comprobar si existe.
                        callback(aPosts)
                })
        } catch (e) {
                console.error("Error getting documents: ", e)
        }
}
