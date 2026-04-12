import { Header } from "../components/Header";
import { AddButton } from '../components/AddButton';
import { useNavigate, useSearchParams } from 'react-router-dom'; 
import { useEffect, useState, useMemo } from 'react';
import { getMedicines, deleteMedicine } from '../services/medicineService';
import type { Medicine } from '../types';
import './styles/Pillbox.css';

import goodIcon from '../assets/good.svg';
import expireSoonIcon from '../assets/expire_soon.svg';
import expiredIcon from '../assets/expired.svg';

export function Pillbox() {
  const [searchParams, setSearchParams] = useSearchParams(); 
  
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [purposeFilter, setPurposeFilter] = useState(searchParams.get('purpose') || '');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>((searchParams.get('sort') as 'asc' | 'desc') || 'asc');
  
  const navigate = useNavigate();

  const handleAddMedicine = () => {
    navigate('/addmed');
  };

  const updateURL = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const params: Record<string, string> = {
          page: '1',
          size: '100',
          sort_by: 'expiry_date',
          sort_order: sortOrder
        };
        
        if (searchTerm) params.name = searchTerm;
        if (purposeFilter) params.purpose = purposeFilter;
        
        const data = await getMedicines(params);
        const items = Array.isArray(data) ? data : (data?.items || []);
        setMedicines(items);
      } catch (error) {
        console.error('Ошибка загрузки аптечки:', error);
        setMedicines([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, [searchTerm, purposeFilter, sortOrder]);

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

  const uniquePurposes = useMemo(() => {
    const purposes = medicines
      .map(med => med.purpose)
      .filter((p): p is string => !!p && p.trim() !== '');
    return [...new Set(purposes)].sort();
  }, [medicines]);

  const filteredMedicines = medicines.filter(med =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <div className="header-left">
            <div className="stats">Добавлено лекарств: {medicines.length}</div>
            <div className="search-box">
              <label htmlFor="search">Поиск:</label>
              <input 
                type="text" 
                id="search" 
                placeholder="Название препарата..." 
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); updateURL('search', e.target.value); }}
                className="form-input"
              />
            </div>
          </div>

          <div className="header-right">
            <div className="filters-container">
              <select 
                value={purposeFilter}
                onChange={(e) => { setPurposeFilter(e.target.value); updateURL('purpose', e.target.value); }}
                className="form-select"
              >
                <option value="">Все назначения</option>
                {uniquePurposes.map(purpose => (
                  <option key={purpose} value={purpose}>
                    {purpose}
                  </option>
                ))}
              </select>
              
              <select 
                value={sortOrder}
                onChange={(e) => { setSortOrder(e.target.value as 'asc' | 'desc'); updateURL('sort', e.target.value); }}
                className="form-select"
              >
                <option value="asc">Срок: сначала дальние</option>
                <option value="desc">Срок: сначала ближние</option>
              </select>
              
              {(purposeFilter || sortOrder !== 'asc') && (
                <button 
                  onClick={() => { 
                    setPurposeFilter(''); 
                    setSortOrder('asc'); 
                    setSearchParams({}); 
                  }}
                  className="reset-button"
                >
                  Сбросить
                </button>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <p className="loading">Загрузка...</p>
        ) : filteredMedicines.length === 0 ? (
          <p className="empty-message">
            {searchTerm || purposeFilter 
              ? `По запросу ничего не найдено` 
              : 'Аптечка пуста. Добавьте первый препарат!'}
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
                <div className="medicine-left">
                  <h3 className="medicine-name">{med.name}</h3>
                  <p className="medicine-purpose">{med.purpose || 'Без назначения'}</p>
                </div>

                <div className="medicine-expiry">
                  <span className="expiry-text">Годен до: {med.expiry_date || 'Не указан'}</span>
                  {med.expiry_date && getStatusIcon(med.status)}
                </div>

                <button 
                  onClick={(e) => { e.stopPropagation(); handleDelete(med.id); }}
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