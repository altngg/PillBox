import apiClient from '../api/сlient';
import type { Medicine, MedicineCreate } from '../types';

export const getMedicines = async (): Promise<Medicine[]> => {
  const response = await apiClient.get<Medicine[]>('/medicines/');
  return response.data;
};

export const getMedicineById = async (id: number): Promise<Medicine> => {
  const response = await apiClient.get<Medicine>(`/medicines/${id}/`);
  return response.data;
};

export const createMedicine = async (medicine: MedicineCreate): Promise<Medicine> => {
  const response = await apiClient.post<Medicine>('/medicines/', medicine);
  return response.data;
};

export const updateMedicine = async (
  id: number,
  medicine: Partial<MedicineCreate>
): Promise<Medicine> => {
  const response = await apiClient.put<Medicine>(`/medicines/${id}/`, medicine);
  return response.data;
};

export const deleteMedicine = async (id: number): Promise<void> => {
  await apiClient.delete(`/medicines/${id}`);
};