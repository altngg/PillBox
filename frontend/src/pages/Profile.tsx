import { Header } from "../components/Header";
import { useEffect, useState } from 'react';
import { getCurrentUser } from '../services/authService';
import { getMedicines } from '../services/medicineService';
import { getReminders } from '../services/reminderService';
import type { UserProfile } from '../types';
import type { Medicine } from '../types';
import type { Reminder } from '../types';
import './styles/Profile.css';

export function Profile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [medicinesCount, setMedicinesCount] = useState(0);
  const [remindersCount, setRemindersCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);

        const medicines = await getMedicines();
        setMedicinesCount(medicines.length);

        const reminders = await getReminders();
        setRemindersCount(reminders.length);
      } catch (error) {
        console.error('Ошибка загрузки профиля:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div>
        <Header />
        <div className="profile-container">
          <p>Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="profile-container">
        <h1 className="profile-title">Мой профиль</h1>

        <div className="profile-summary">
          <div className="profile-info">
            <p><strong>Имя пользователя:</strong> {user?.username || 'Не указано'}</p>
            <p><strong>Email:</strong> {user?.email}</p>
          </div>

          <div className="profile-stats">
            <div className="stat-card">
              <h3>{medicinesCount}</h3>
              <p>Препаратов</p>
            </div>
            <div className="stat-card">
              <h3>{remindersCount}</h3>
              <p>Напоминаний</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}