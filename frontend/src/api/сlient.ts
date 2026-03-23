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

export default apiClient