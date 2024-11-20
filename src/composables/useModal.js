//------------------------------------------------------------------- VUE COMPOSITION API
import { ref } from 'vue';
//------------------------------------------------------------------- VARIABLES GLOBALES
const modal = ref(false);
//------------------------------------------------------------------- FUNCIÓN PRINCIPAL
const useModal = () => {
	/**
	 * Cambia el valor de modal a true
	 * @returns {Void}
	 */
	const openModal = () => modal.value = true;

	/**
	 * Cambia el valor de modal a false
	 * @returns {Void}
	 */
	const closeModal = () => modal.value = false;
	
	return {
		modal,
		openModal,
		closeModal
	}
}

export default useModal;