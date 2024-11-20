/**
 * NOTA: Aquí descubrí sin querer, que estamos usando un "Patrón de Diseño" llamado "Singleton"
 * que se encarga de crear una única instancia de un objeto y reutilizarlo en todos los componentes que lo necesiten.
 */
//------------------------------------------------------------------- VUE COMPOSITION API
import { ref } from "vue"
//------------------------------------------------------------------- FUNCIÓN PRINCIPAL
const useLoading = () => {
	//------------------------------------------------------------------- VARIABLES

	const loading = ref(false);
	//------------------------------------------------------------------- METHODS
	/**
	 * Cambia el valor de la variable loading a true
	 * @returns {void}
	 */
	const startLoading = () => loading.value = true;
	/**
	 * Cambia el valor de la variable loading a false
	 * @returns {void}
	 */
	const endLoading = () => loading.value = false;

	return {
		loading,
		startLoading,
		endLoading
	}
}

export default useLoading