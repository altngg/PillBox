import { Header } from "../components/Header";
import { useEffect, useState } from 'react';
import { getReminders, deleteReminder } from '../services/reminderService';
import type { Reminder } from '../types';
import { getMedicineById } from '../services/medicineService';
import './styles/Reminders.css';

export function Reminders() {
  const [remindersWithMedicine, setRemindersWithMedicine] = useState<
    (Reminder & { medicineName: string })[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const reminders = await getReminders();
        
        const promises = reminders.map(async (reminder) => {
          try {
            const medicine = await getMedicineById(reminder.medicine_id);
            return { ...reminder, medicineName: medicine.name };
          } catch (error) {
            return { ...reminder, medicineName: 'Препарат недоступен' };
          }
        });

        const results = await Promise.all(promises);
        setRemindersWithMedicine(results);
      } catch (error) {
        console.error('Ошибка загрузки напоминаний:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReminders();
  }, []);

  // Удаление напоминания
  const handleDelete = async (id: number) => {
    if (!window.confirm('Удалить напоминание?')) return;

    try {
      await deleteReminder(id);
      setRemindersWithMedicine(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      console.error('Ошибка удаления:', error);
      alert('Не удалось удалить напоминание');
    }
  };

  return (
    <div>
      <Header />
      <div className="reminders-container">
        <h1 className="reminders-title">Мои напоминания</h1>

        {loading ? (
          <p>Загрузка...</p>
        ) : remindersWithMedicine.length === 0 ? (
          <p>У вас нет напоминаний. Добавьте напоминание к препарату!</p>
        ) : (
          <div className="reminders-list">
            {remindersWithMedicine.map(reminder => (
              <div key={reminder.id} className="reminder-card">
                {/* Крестик удаления */}
                <button
                  onClick={() => handleDelete(reminder.id)}
                  className="delete-reminder-button"
                  aria-label="Удалить напоминание"
                >
                  ✕
                </button>

                <h3>{reminder.medicineName}</h3>
                <p><strong>Дозировка:</strong> {reminder.dosage}</p>
                <p><strong>Раз в день:</strong> {reminder.times_per_day}</p>
                <p><strong>Курс:</strong> {reminder.course_days} дней</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}