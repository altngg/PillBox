// import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from "../components/Header";
import './styles/Login.css';

export function Login() {
    // const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e:React.FormEvent) => {
        e.preventDefault();

        //console.log('Вход:', { email, password });

        navigate('/pillbox');
    };

    return(
        <div>
            <Header/>
            <div className="login-container">
                <h2 className="login-title">Вход</h2>

                <form className="login-form" onSubmit={handleLogin}>
                    <div className="input-group">
                    <label htmlFor="email">Почта:</label>
                    <input type="email" id="email" placeholder="" />
                    </div>

                    <div className="input-group">
                    <label htmlFor="password">Пароль:</label>
                    <input type="password" id="password" placeholder="" />
                    </div>

                    <button type="submit" className="login-button">
                    Продолжить
                    </button>
                </form>
            </div>
        </div>
    );
}