//------------------------------------------------------------------- FUNCIÓN PRINCIPAL
const useLocalStorage = () => {
	//------------------------------------------------------------------- METHODS
	/**
	 * Función para guardar datos en el localStorage
	 * @param {String} key 
	 * @param {String} data 
	 */
	function saveDataInLocalStorage(key, data) {
		localStorage.setItem(key, JSON.stringify(data));
	}

	/**
	 * Función para obtener datos del localStorage
	 * @param {String} key 
	 * @returns 
	 */
	function getDataFromLocalStorage(key) {
		return JSON.parse(localStorage.getItem(key));
	}

	/**
	 * Función para remover datos del localStorage
	 * @param {String} key 
	 */
	function removeDataFromLocalStorage(key) {
		localStorage.removeItem(key);
	}

	return {
		saveDataInLocalStorage,
		getDataFromLocalStorage,
		removeDataFromLocalStorage
	}
}

export default useLocalStorage;