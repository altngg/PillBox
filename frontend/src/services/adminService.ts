import apiClient from '../api/client';
import type { UserProfile } from '../types';
import type { AdminReminderRaw } from '../types';

export const getAdminUsers = async (): Promise<UserProfile[]> => {
  const response = await apiClient.get<UserProfile[]>('/admin/users');
  return response.data;
};

export const deleteAdminUser = async (id: number): Promise<void> => {
  await apiClient.delete(`/admin/users/${id}`);
};

export const makeUserSuperuser = async (id: number): Promise<void> => {
  await apiClient.patch(`/admin/users/${id}/make-superuser`);
};

export const getAdminMedicines = async () => {
  const response = await apiClient.get('/admin/medicines');
  return response.data;
};

export const deleteAdminMedicine = async (id: number): Promise<void> => {
  await apiClient.delete(`/admin/medicines/${id}`);
};

export const getAdminReminders = async (): Promise<AdminReminderRaw[]> => {
  const response = await apiClient.get<AdminReminderRaw[]>('/admin/reminders');
  return response.data;
};

export const deleteAdminReminder = async (id: number): Promise<void> => {
  await apiClient.delete(`/admin/reminders/${id}`);
};