import { Header } from "../../components/Header";
import { useEffect, useState } from 'react';
import { getAdminReminders, deleteAdminReminder } from '../../services/adminService';
import { getMedicineById } from '../../services/medicineService';
import { getAdminUsers } from '../../services/adminService';
import type { AdminReminderRaw, UserProfile } from '../../types'; 
import '../styles/Admin.css';

interface AdminReminder extends AdminReminderRaw {
  medicineName?: string;
  ownerEmail?: string;
}

export function AdminReminders() {
  const [reminders, setReminders] = useState<AdminReminder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const remindersData: AdminReminderRaw[] = await getAdminReminders();
        
        const enriched = await Promise.all(
          remindersData.map(async (r: AdminReminderRaw) => { // ← типизировано!
            let medicineName = '—';
            let ownerEmail = '—';
            
            try {
              const medicine = await getMedicineById(r.medicine_id);
              medicineName = medicine.name;
            } catch (e) {
              console.warn(`Препарат ID ${r.medicine_id} не найден`);
            }
            
            try {
              const users: UserProfile[] = await getAdminUsers();
              const owner = users.find(u => u.id === r.owner_id);
              ownerEmail = owner?.email || '—';
            } catch (e) {
              console.warn(`Пользователь ID ${r.owner_id} не найден`);
            }
            
            return { ...r, medicineName, ownerEmail };
          })
        );
        
        setReminders(enriched);
      } catch (error) {
        console.error('Ошибка загрузки напоминаний:', error);
        alert('Доступ запрещён или сервер недоступен');
      } finally {
        setLoading(false);
      }
    };

    fetchReminders();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Удалить напоминание?')) return;
    try {
      await deleteAdminReminder(id);
      setReminders(reminders.filter(r => r.id !== id));
    } catch (error) {
      alert('Не удалось удалить напоминание');
    }
  };

  return (
    <div>
      <Header />
      <div className="admin-container">
        <h1>Все напоминания</h1>
        
        {loading ? (
          <p>Загрузка...</p>
        ) : (
          <div className="admin-cards">
            {reminders.map(reminder => (
              <div key={reminder.id} className="admin-card">
                <h3>{reminder.medicineName || 'Препарат недоступен'}</h3>
                <p><strong>Пользователь:</strong> {reminder.ownerEmail}</p>
                <p><strong>Дозировка:</strong> {reminder.dosage}</p>
                <p><strong>Раз в день:</strong> {reminder.times_per_day}</p>
                <p><strong>Курс:</strong> {reminder.course_days} дней</p>
                <button 
                  onClick={() => handleDelete(reminder.id)}
                  className="admin-button delete"
                >
                  Удалить
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}