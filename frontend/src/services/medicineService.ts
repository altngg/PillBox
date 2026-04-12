import apiClient from '../api/сlient';
import type { Medicine, MedicineCreate } from '../types';

export const getMedicines = async (params?: Record<string, string>): Promise<Medicine[] | any> => {
    const response = await apiClient.get('/medicines', { params });
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

export const uploadMedicinePhoto = async (
    medicineId: number, 
    file: File
): Promise<{ photo_url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post(
        `/medicines/${medicineId}/photo`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
    );
    return response.data;
};


export const deleteMedicinePhoto = async (
    medicineId: number
): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/medicines/${medicineId}/photo`);
    return response.data;
};
