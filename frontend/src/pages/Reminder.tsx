// src/pages/Reminder.tsx
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { Header } from "../components/Header";
import { createReminder } from '../services/reminderService';
import { AxiosError } from 'axios';
import './styles/Reminder.css';

export function Reminder() {
  const [searchParams] = useSearchParams();
  const medicineId = Number(searchParams.get('medicineId'));
  
  const [dosage, setDosage] = useState('');
  const [courseDays, setCourseDays] = useState('');
  const [timesPerDay, setTimesPerDay] = useState('1');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Проверяем, что medicineId передан
  if (!medicineId) {
    // Если нет ID — возвращаем на аптечку
    navigate('/pillbox');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Преобразуем "7 дней" → 7
    const courseNum = parseInt(courseDays.replace(/\D/g, ''), 10);
    if (isNaN(courseNum) || courseNum <= 0) {
      setError('Укажите корректный курс (например, "7 дней")');
      setLoading(false);
      return;
    }

    try {
      await createReminder({
        dosage,
        times_per_day: parseInt(timesPerDay, 10),
        course_days: courseNum,
        medicine_id: medicineId,
      });

      // Возвращаемся на страницу препарата
      navigate(`/medicine/${medicineId}`);
    } catch (err) {
      console.error('Ошибка сохранения напоминания:', err);
      if (err instanceof AxiosError) {
        if (err.response?.status === 422) {
          setError('Проверьте правильность данных');
        } else {
          setError('Не удалось сохранить напоминание');
        }
      } else {
        setError('Ошибка сети');
      }
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="reminder-container">
        <h1 className="reminder-title">Добавить напоминание</h1>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit} className="reminder-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dose">Доза:</label>
              <input
                type="text"
                id="dose"
                placeholder="1 таблетка"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="course">Курс:</label>
              <input
                type="text"
                id="course"
                placeholder="7 дней"
                value={courseDays}
                onChange={(e) => setCourseDays(e.target.value)}
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="course">
            <div className="form-group">
              <label htmlFor="repeat">Сколько раз в день:</label>
              <select
                id="repeat"
                value={timesPerDay}
                onChange={(e) => setTimesPerDay(e.target.value)}
                className="form-select"
                required
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            className="save-button"
            disabled={loading}
          >
            {loading ? 'Сохранение...' : 'Сохранить'}
          </button>
        </form>
      </div>
    </div>
  );
}