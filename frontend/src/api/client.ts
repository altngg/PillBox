import axios from "axios"

const apiClient = axios.create({
    baseURL: "http://localhost:8000",
    withCredentials: true
})

apiClient.interceptors.response.use(
    function (response) {
        return response
    },
    async function (error) {
        const originalRequest = error.config

        if (
            error.response &&
            error.response.status === 401 &&
            originalRequest &&
            !originalRequest._retry &&
            originalRequest.url !== "/auth/login" &&
            originalRequest.url !== "/auth/register" &&
            originalRequest.url !== "/auth/refresh" &&
            originalRequest.url !== "/auth/me"
        ) {
            originalRequest._retry = true

            try {
                await axios.post(
                    "http://localhost:8000/auth/refresh",
                    {},
                    { withCredentials: true }
                )

                return apiClient(originalRequest)
            } catch (refreshError) {
                if (window.location.pathname !== "/login") {
                    window.location.href = "/login"
                }
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    }
)


export const uploadMedicinePhoto = async (
    medicineId: number, 
    file: File
): Promise<{ photo_url: string }> => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await apiClient.post(
        `/medicines/${medicineId}/photo`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
    )
    return response.data
}


export const getMedicinePhotoUrl = async (
    medicineId: number
): Promise<{ photo_url: string }> => {
    const response = await apiClient.get(`/medicines/${medicineId}/photo`)
    return response.data
}


export const deleteMedicinePhoto = async (
    medicineId: number
): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/medicines/${medicineId}/photo`)
    return response.data
}


export const getMedicinesPaginated = async (
    params?: Record<string, any>
) => {
    const response = await apiClient.get('/medicines', { params })
    return response.data
}



export default apiClient