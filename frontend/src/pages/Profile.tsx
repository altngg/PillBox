import { useNavigate } from 'react-router-dom';

export function Profile() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '20px' }}>
      <h2>Страница профиля (заглушка)</h2>
      <button onClick={() => navigate(-1)}>Назад</button>
    </div>
  );
}