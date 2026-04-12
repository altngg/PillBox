import { Header } from "../components/Header";
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getMedicineById } from '../services/medicineService';
import { SEO } from '../components/SEO';
import { DrugInfoCard } from '../components/DrugInfoCard';
import type { Medicine } from '../types';
import './styles/Medicine.css';

export function Medicine() {
  const { id } = useParams<{ id: string }>();
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMedicine = async () => {
      if (!id) return;
      try {
        const data = await getMedicineById(Number(id));
        setMedicine(data);
      } catch (error) {
        console.error('Ошибка загрузки препарата:', error);
        alert('Не удалось загрузить препарат');
        navigate('/pillbox');
      } finally {
        setLoading(false);
      }
    };

    fetchMedicine();
  }, [id, navigate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'expired': return '#d32f2f';
      case 'expiring_soon': return '#ed6c02';
      default: return '#2e7d32';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'expired': return 'Просрочен';
      case 'expiring_soon': return 'Скоро истечёт';
      default: return 'Годен';
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="medicine-container">
          <p>Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!medicine) {
    return (
      <div>
        <Header />
        <div className="medicine-container">
          <p>Препарат не найден</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SEO 
        title={medicine.name}
        description={`Информация о препарате ${medicine.name}. Форма: ${medicine.form}. ${medicine.purpose || ''}`}
        ogType="product"
      />
      
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Drug",
          "name": medicine.name,
          "description": medicine.purpose || "Лекарственный препарат",
          "image": medicine.photo_url || "",
          "brand": {
            "@type": "Brand",
            "name": medicine.form
          }
        })
      }} />

      <Header />
      <main className="medicine-container">
        <h1 className="medicine-title">{medicine.name}</h1>
        <DrugInfoCard drugName={medicine.name} />
        {medicine.photo_url && (
          <div className="medicine-photo-container">
            <img 
              src={medicine.photo_url} 
              alt={`Фотография препарата ${medicine.name}`}
              loading="lazy"
              className="medicine-photo"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}

        <div className="medicine-info">
          <div className="info-row">
            <span className="label">Дата изготовления:</span>
            <span>{medicine.manufacture_date || 'Не указана'}</span>
          </div>
          <div className="info-row">
            <span className="label">Годен до:</span>
            <span>{medicine.expiry_date || 'Не указан'}</span>
            {medicine.expiry_date && (
              <span 
                className="status-badge"
                style={{ backgroundColor: getStatusColor(medicine.status) }}
              >
                {getStatusText(medicine.status)}
              </span>
            )}
          </div>
          <div className="info-row">
            <span className="label">Форма:</span>
            <span>{medicine.form}</span>
          </div>
          <div className="info-row">
            <span className="label">Назначение:</span>
            <span>{medicine.purpose || 'Не указано'}</span>
          </div>
          <div className="info-row">
            <span className="label">Напоминания:</span>
            <button 
              onClick={() => navigate(`/reminder?medicineId=${medicine.id}`)} 
              className="add-reminder-button"
            >
              Добавить напоминание
            </button>
          </div>
        </div>
        
        <div className="medicine-actions">
          <button 
            onClick={() => navigate(`/addmed?editId=${medicine.id}`)} 
            className="action-button edit"
           >
            Редактировать
           </button>
        </div>
      </main>
    </div>
  );
}