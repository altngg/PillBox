import { Header } from "../../components/Header";
import { useNavigate } from 'react-router-dom';
import '../styles/Admin.css';

export function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <Header />
      <div className="admin-container">
        <h1>Панель администратора</h1>
        <div className="admin-dashboard">
          <button 
            onClick={() => navigate('/admin/users')}
            className="admin-dashboard-button"
          >
            Управление пользователями
          </button>
          <button 
            onClick={() => navigate('/admin/medicines')}
            className="admin-dashboard-button"
          >
            Все препараты
          </button>
          <button 
            onClick={() => navigate('/admin/reminders')}
            className="admin-dashboard-button"
          >
            Все напоминания
          </button>
        </div>
      </div>
    </div>
  );
}