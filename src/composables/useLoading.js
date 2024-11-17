import { ref } from "vue"
//-> patron de diseño "SINGLETON"
const useLoading = () => {
    const loading = ref(false);
    const startLoading = () => loading.value = true;
    const endLoading = () => loading.value = false;
    return {
        loading,
        startLoading,
        endLoading
    }
}

export default useLoading