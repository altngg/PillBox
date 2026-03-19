import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import "../styles/Admin.css";

export function ForbiddenPage() {
  const navigate = useNavigate();
  useEffect(() => {
    return () => {
      localStorage.removeItem('lastError');
    };
  }, []);

  return (
    <div>
      <Header />
      <div className="forbidden-container">
        <h1>Доступ запрещён</h1>
        <p className="forbidden-message">
          У вас нет прав для просмотра этой страницы.
        </p>
        <p>
          Только пользователи с правами администратора могут видеть раздел админа.
        </p>
        <button onClick={() => navigate('/pillbox')} className="back-button">
          Вернуться в аптечку
        </button>
      </div>
    </div>
  );
}