import { useNavigate } from 'react-router-dom';
import { Header } from "../components/Header";
import './styles/Register.css';

export function Register() {
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("isAuthenticated", "true");
    // Здесь можно добавить логику регистрации
    console.log('Регистрация выполнена!');
    navigate('/pillbox'); // После регистрации — на главную
  };

  return (
    <div>
      <Header />
      <div className="register-container">
        <h2 className="register-title">Регистрация</h2>

        <form className="register-form" onSubmit={handleRegister}>
          <div className="input-group">
            <label htmlFor="username">Имя пользователя:</label>
            <input type="text" id="username" placeholder="" required />
          </div>

          <div className="input-group">
            <label htmlFor="email">Почта:</label>
            <input type="email" id="email" placeholder="" required />
          </div>

          <div className="input-group">
            <label htmlFor="password">Пароль:</label>
            <input type="password" id="password" placeholder="" required />
          </div>

          <button type="submit" className="register-button">
            Продолжить
          </button>
        </form>
      </div>
    </div>
  );
}