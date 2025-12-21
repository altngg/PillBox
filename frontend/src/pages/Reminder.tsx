import { useNavigate } from 'react-router-dom';
import { Header } from "../components/Header";
import './styles/Reminder.css';

export function Reminder() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь можно добавить логику сохранения напоминания
    console.log('Напоминание сохранено');
    navigate('/pillbox'); // Возврат на главную страницу
  };

  return (
    <div>
        <Header/>
        <div className="reminder-container">
        <h1 className="reminder-title">Добавить напоминание</h1>

        <form onSubmit={handleSubmit} className="reminder-form">
            <div className="form-row">
            <div className="form-group">
                <label htmlFor="dose">Доза:</label>
                <input
                type="text"
                id="dose"
                placeholder="1 таблетка"
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
                required
                className="form-input"
                />
            </div>
           
            </div>

            <div className="course">
             <div className="form-group">
                <label htmlFor="repeat">Сколько раз в день:</label>
                <select id="repeat" className="form-select">
                <option value="once">1</option>
                <option value="twice">2</option>
                <option value="threes">3</option>
                <option value="custom">настроить</option>
                </select>
            </div>

            
            </div>

            <button type="submit" className="save-button">
            Сохранить
            </button>
        </form>
        </div>
    </div>
  );
}