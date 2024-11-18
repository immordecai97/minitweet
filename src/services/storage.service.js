import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '@/services/firebase.service';
/**
 * Función que sube un archivo al storage
 * @param {string} path 
 * @param {File} file 
 */
export const uploadFile = async (path, file) => {
    const storageRef = ref(storage, path); // Referencia al archivo en el storage
    await uploadBytes(storageRef, file); // Subir el archivo (representado como objeto File o Blob) al storage
}

/**
 * Retorna la URL absoluta de un archivo en el storage
 * @param {string} file 
 * @returns {Promise<string>} URL del archivo
 */
export const getFileURL = async (file) => {
    const storageRef = ref(storage, file); // Referencia al archivo en el storage
    return await getDownloadURL(storageRef); // Obtener la URL del archivo
}

/**
 * @param {string} path 
 * @returns 
 */
export const deleteFile = async (path) => {
    const storageRef = ref(storage, path); // Referencia al archivo en el storage
    return await deleteObject(storageRef); // Borrar el archivo
}