// src/services/reminderService.ts
import apiClient from '../api/client';
import type { Reminder, ReminderCreate, ReminderUpdate } from '../types';

/**
 * Получить все напоминания текущего пользователя
 */
export const getReminders = async (): Promise<Reminder[]> => {
  const response = await apiClient.get<Reminder[]>('/reminders/');
  return response.data;
};

/**
 * Создать новое напоминание
 */
export const createReminder = async (reminderData: ReminderCreate): Promise<Reminder> => {
  const response = await apiClient.post<Reminder>('/reminders/', reminderData);
  return response.data;
};

/**
 * Получить одно напоминание по ID
 */
export const getReminderById = async (id: number): Promise<Reminder> => {
  const response = await apiClient.get<Reminder>(`/reminders/${id}`);
  return response.data;
};

/**
 * Обновить напоминание (частично или полностью)
 */
export const updateReminder = async (
  id: number,
  reminderData: ReminderUpdate
): Promise<Reminder> => {
  const response = await apiClient.put<Reminder>(`/reminders/${id}`, reminderData);
  return response.data;
};

/**
 * Удалить напоминание
 */
export const deleteReminder = async (id: number): Promise<void> => {
  await apiClient.delete(`/reminders/${id}`);
};