//------------------------------------------------------------------- FIREBASE SERVICES
import { authRegister, authlogin, authLogout, authState } from '@/services/auth.service';
import { createProfileUser, getProfileUserByUID, updateProfileUser } from '@/services/profile.service';
import { uploadFile, getFileURL } from '@/services/storage.service';
//------------------------------------------------------------------- COMPOSABLES
import useLocalStorage from './useLocalStorage';
//------------------------------------------------------------------- VUE COMPOSITION API
import { ref } from 'vue';
//------------------------------------------------------------------- USE COMPOSABLES
const { saveDataInLocalStorage, getDataFromLocalStorage, removeDataFromLocalStorage } = useLocalStorage();
//------------------------------------------------------------------- VARIABLES GLOBALES
const user = ref(null);
//------------------------------------------------------------------- FUNCIÓN PRINCIPAL
const useAuth = () => {
	//------------------------------------------------------------------- METHODS
	/**
	 * Función para verificar si el usuario está autenticado
	 */
	async function checkAuth() {
		const storedUser = getDataFromLocalStorage('user');
		if (storedUser) {
			user.value = storedUser;
		} else {
			let currentUser = null;
			authState((user) => currentUser = user);
			if (currentUser) {
				user.value = await getProfileUserByUID(currentUser.uid);
				saveDataInLocalStorage('user', user.value);
			}
		}
	}

	/**
	 * Función para registrar un nuevo usuario al servicio de autenticación y crear su perfil en la base de datos
	 * @param {{ name: String, username: String, password: String }} param0 
	 */
	async function registerUser({ name, username, email, password }) {
		try {
			const userCredential = await authRegister({ email, password });
			const newUser = {
				uid: userCredential.user.uid,
				name,
				username,
				email,
				bio: null,
				photoURL: null,
				coverPhotoURL: null,
				followers: [],
				following: [],
				posts: [],
			}
			user.value = await createProfileUser(newUser);
			saveDataInLocalStorage('user', user.value);
		} catch (error) {
			console.error("Error registering: ", error.message);
		}
	}

	/**
	 * Función para iniciar sesión
	 * @param { { email: String, password: String } } param0 
	 */
	async function login({ email, password }) {
		try {
			const userCredential = await authlogin({ email, password });
			user.value = await getProfileUserByUID(userCredential.user.uid);
			saveDataInLocalStorage('user', user.value);
		} catch (error) {
			console.error("Error logging in: ", error.message);
		}
	}

	/**
	 * Función para cerrar sesión
	 */
	async function logout() {
		await authLogout();
		removeDataFromLocalStorage('user');
		user.value = null;
	}

	/**
	 * Función para obtener los datos de un usuario por su ID
	 * @param {String} userId 
	 */
	async function getUserById(userId) {
		try {
			if (user.value?.uid === userId) return user.value;
			else {
				const user = await getProfileUserByUID(userId);
				return user;
			}
		} catch (error) {
			console.error("Error fetching user data: ", error.message);
		}
	}

	/**
	 * Función para actualizar los datos de un usuario
	 * @param {Object} updatedData 
	 */
	async function updateUser(updatedData) {
		try {
			const updatedUser = await updateProfileUser(user.value.uid, updatedData);
			user.value = { ...user.value, ...updatedUser };
			saveDataInLocalStorage('user', user.value);
		} catch (error) {
			console.error("Error updating user data: ", error.message);
		}
	}

	/**
	 * Función para actualizar la foto de perfil de un usuario
	 * @param {File} filePhoto 
	 */
	async function updateProfilePhoto(filePhoto) {
		const fileExtension = filePhoto.name.split('.').pop();
		const filePath = `users/${user.value?.uid}/profilePhoto/profilePhoto.${fileExtension}`;
		await uploadFile(filePath, filePhoto);
		const photoURL = await getFileURL(filePath);
		updateUser({ photoURL });
	}

	/**
	 * Función para actualizar la foto de portada de un usuario
	 * @param {File} filePhoto 
	 */
	async function updateCoverPhoto(filePhoto) {
		const fileExtension = filePhoto.name.split('.').pop();
		const filePath = `users/${user.value?.uid}/coverPhoto/coverPhoto.${fileExtension}`;
		await uploadFile(filePath, filePhoto);
		const coverPhotoURL = await getFileURL(filePath);
		updateUser({ coverPhotoURL });
	}

	return {
		user,
		checkAuth,
		registerUser,
		login,
		logout,
		getUserById,
		updateUser,
		updateProfilePhoto,
		updateCoverPhoto,
	};
};

export default useAuth;