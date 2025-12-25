import { Header } from "../../components/Header";
import { useEffect, useState } from 'react';
import { getAdminUsers, deleteAdminUser, makeUserSuperuser } from '../../services/adminService';
import type { UserProfile } from '../../types';
import '../styles/Admin.css';

export function AdminUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAdminUsers();
        setUsers(data);
      } catch (error) {
        console.error('Ошибка загрузки пользователей:', error);
        alert('Доступ запрещён или сервер недоступен');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id: number, email: string) => {
    if (!window.confirm(`Удалить пользователя ${email}?`)) return;
    try {
      await deleteAdminUser(id);
      setUsers(users.filter(u => u.id !== id));
    } catch (error) {
      alert('Не удалось удалить пользователя');
    }
  };

  const handleMakeSuperuser = async (id: number) => {
    try {
      await makeUserSuperuser(id);
      setUsers(users.map(u => 
        u.id === id ? { ...u, is_superuser: true } : u
      ));
    } catch (error) {
      alert('Не удалось назначить админом');
    }
  };

  return (
    <div>
      <Header />
      <div className="admin-container">
        <h1>Пользователи</h1>
        
        {loading ? (
          <p>Загрузка...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Имя</th>
                <th>Активен</th>
                <th>Админ</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.email}</td>
                  <td>{user.username || '-'}</td>
                  <td>{user.is_active ? '+' : '-'}</td>
                  <td>{user.is_superuser ? '+' : '-'}</td>
                  <td>
                    {!user.is_superuser && (
                      <button 
                        onClick={() => handleMakeSuperuser(user.id)}
                        className="admin-button admin"
                      >
                        Сделать админом
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(user.id, user.email)}
                      className="admin-button delete"
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}