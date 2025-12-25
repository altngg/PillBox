import { Header } from "../../components/Header";
import { useEffect, useState } from 'react';
import { getAdminMedicines, deleteAdminMedicine } from '../../services/adminService';
import '../styles/Admin.css';

export function AdminMedicines() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getAdminMedicines();
        setMedicines(data);
      } catch (error) {
        alert('Доступ запрещён');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Удалить препарат?')) return;
    try {
      await deleteAdminMedicine(id);
      setMedicines(medicines.filter((m: any) => m.id !== id));
    } catch (error) {
      alert('Ошибка удаления');
    }
  };

  return (
    <div>
      <Header />
      <div className="admin-container">
        <h1>Все препараты</h1>
        {loading ? (
          <p>Загрузка...</p>
        ) : (
          <div className="admin-cards">
            {medicines.map((med: any) => (
              <div key={med.id} className="admin-card">
                <h3>{med.name}</h3>
                <p>Владелец ID: {med.owner_id}</p>
                <p>Форма: {med.form}</p>
                <p>Годен до: {med.expiry_date}</p>
                <button 
                  onClick={() => handleDelete(med.id)}
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