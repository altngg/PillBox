import apiClient from "../api/client"

export interface UserLogin {
  email: string
  password: string
}

export interface UserRegister {
  email: string
  password: string
  username?: string
}

export interface UserProfile {
  id: number
  email: string
  username: string | null
  is_active: boolean
  is_superuser: boolean
}

export const register = async (userData: UserRegister): Promise<void> => {
  await apiClient.post("/auth/register", userData)
}

export const login = async (credentials: UserLogin): Promise<void> => {
  await apiClient.post("/auth/login", credentials)
}

export const logout = async (): Promise<void> => {
  await apiClient.post("/auth/logout")
}

export const getCurrentUser = async (): Promise<UserProfile> => {
  const response = await apiClient.get<UserProfile>("/auth/me")
  return response.data
}