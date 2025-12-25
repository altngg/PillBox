// src/pages/Pillbox.tsx
import { Header } from "../components/Header";
import { AddButton } from '../components/AddButton';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getMedicines, deleteMedicine } from '../services/medicineService';
import type { Medicine } from '../types';
import './styles/Pillbox.css';

// Импортируем SVG-иконки
import goodIcon from '../assets/good.svg';
import expireSoonIcon from '../assets/expire_soon.svg';
import expiredIcon from '../assets/expired.svg';

export function Pillbox() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleAddMedicine = () => {
    navigate('/addmed');
  };

  // Загрузка препаратов
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const data = await getMedicines();
        setMedicines(data);
      } catch (error) {
        console.error('Ошибка загрузки аптечки:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, []);

  // Удаление препарата
  const handleDelete = async (id: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот препарат?')) {
      return;
    }

    try {
      await deleteMedicine(id);
      setMedicines(prev => prev.filter(med => med.id !== id));
    } catch (error) {
      console.error('Ошибка удаления:', error);
      alert('Не удалось удалить препарат. Попробуйте позже.');
    }
  };

  // Фильтрация по поиску
  const filteredMedicines = medicines.filter(med =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Функция для выбора иконки по статусу
  const getStatusIcon = (status: string) => {
    let iconSrc = goodIcon;
    if (status === 'expiring_soon') {
      iconSrc = expireSoonIcon;
    } else if (status === 'expired') {
      iconSrc = expiredIcon;
    }
    return <img src={iconSrc} alt="Статус" className="status-icon" />;
  };

  return (
    <div>
      <Header />
      <div className="pillbox-container">
        <div className="pillbox-header">
          <div className="stats">Добавлено лекарств: {medicines.length}</div>
          <div className="search-box">
            <label htmlFor="search">Поиск:</label>
            <input 
              type="text" 
              id="search" 
              placeholder="Название препарата..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <p className="loading">Загрузка...</p>
        ) : filteredMedicines.length === 0 ? (
          <p className="empty-message">
            {searchTerm ? `По запросу "${searchTerm}" ничего не найдено` : 'Аптечка пуста. Добавьте первый препарат!'}
          </p>
        ) : (
          <div className="medicines-list">
            {filteredMedicines.map(med => (
              <div 
              key={med.id} 
              className="medicine-item" 
              onClick={() => navigate(`/medicine/${med.id}`)} 
              style={{ cursor: 'pointer' }}
              >
                {/* Левая часть: название и назначение */}
                <div className="medicine-left">
                  <h3 className="medicine-name">{med.name}</h3>
                  <p className="medicine-purpose">{med.purpose || 'Без назначения'}</p>
                </div>

                {/* Центральная часть: срок годности */}
                <div className="medicine-expiry">
                  <span className="expiry-text">Годен до: {med.expiry_date || 'Не указан'}</span>
                  {med.expiry_date && getStatusIcon(med.status)}
                </div>

                {/* Правая часть: кнопка удаления */}
                <button 
                  onClick={() => handleDelete(med.id)}
                  className="delete-button"
                  aria-label="Удалить препарат"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <AddButton onClick={handleAddMedicine} />
      </div>
    </div>
  );
}