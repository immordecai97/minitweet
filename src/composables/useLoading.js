import { ref } from "vue"

const useLoading = () => {
    const loading = ref(false);
    const startLoading = () => loading.value = true;
    const endLoading = () => setTimeout(() => loading.value = false, 600);
    return {
        loading,
        startLoading,
        endLoading
    }
}
export default useLoading