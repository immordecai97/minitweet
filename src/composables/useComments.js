import { ref } from 'vue';
import { getCommentsFromFirestore, saveCommentToFirestore } from '@/services/comment.service';


/**
 * 1 -> Traer los comentarios de un post especifico por lo tanto necesito el id del post
 * 2 -> Poder agregar un comentario a un post especifico donde se almacene en una subcolleción de comentarios
 * 2.1 -> en la subcolección debe tener el uid del usuario quien comenta y el comentario
 * 3 -> Poder eliminar un comentario (Opcional)
 */

export default function useComments() {
    const comments = ref([]);

    /**
     * Función para obtener los comentarios de un post especifico según su ID
     * @param {String} postID 
     */
    async function getCommentsByPostID(postID, callback) {
        try {
            // comments.value = getCommentsFromFirestore(postID, callback);
            const unsubscribe = getCommentsFromFirestore(postID, callback);
            return unsubscribe;
        } catch (error) {
            console.error('Error obteniendo comentarios:', error);
            // throw error;
        }
    }

    async function saveComment({ postID, comment, userUID }) {
        try {
            await saveCommentToFirestore({ postID, comment, userUID });
            console.log('Comentario guardado');
        } catch (error) {
            console.error('Error guardando comentario:', error);
            // throw error;
        }
    }


    return {
        comments,
        getCommentsByPostID,
        saveComment,
    }
}