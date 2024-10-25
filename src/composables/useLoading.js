import { ref } from "vue"

const useLoading = () => {
    const loading = ref(true)
    const toggleLoading = () => setTimeout(() => loading.value = !loading.value, 300); // Le puse un delay de 500ms para mejorar que se pueda notar la carga
    const setLoading = (value) => loading.value = value
    return { loading, toggleLoading, setLoading }
}
export default useLoading