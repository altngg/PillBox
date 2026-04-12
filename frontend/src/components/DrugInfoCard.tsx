import { useState, useEffect } from 'react';
import axios from 'axios';
import '../pages/styles/DrugInfoCard.css';

interface DrugInfo {
  brand_name?: string;
  generic_name?: string;
  manufacturer?: string;
  purpose?: string;
  warnings?: string[];
  storage?: string;
  dosage?: string;
}

interface DrugInfoCardProps {
  drugName: string;
}

export function DrugInfoCard({ drugName }: DrugInfoCardProps) {
  const [drugInfo, setDrugInfo] = useState<DrugInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDrugInfo = async () => {
      if (!drugName) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(`http://localhost:8000/external/drug-info/${encodeURIComponent(drugName)}`);
        setDrugInfo(response.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 404) {
            setError('Информация не найдена в базе FDA');
          } else if (err.response?.status === 503) {
            setError('Сервис временно недоступен');
          } else {
            setError('Ошибка загрузки данных');
          }
        } else {
          setError('Неизвестная ошибка');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDrugInfo();
  }, [drugName]);

  if (loading) {
    return (
      <div className="drug-info-card loading">
        <p>Загрузка информации из FDA...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="drug-info-card error">
        <p>{error}</p>
        <p className="error-hint">Основные данные препарата отображаются ниже</p>
      </div>
    );
  }

  if (!drugInfo) {
    return null;
  }

  return (
    <div className="drug-info-card">
      <h3 className="drug-info-title">Информация из FDA</h3>
      
      {drugInfo.brand_name && (
        <div className="info-section">
          <span className="info-label">Торговое название:</span>
          <span>{drugInfo.brand_name}</span>
        </div>
      )}
      
      {drugInfo.generic_name && (
        <div className="info-section">
          <span className="info-label">Международное название:</span>
          <span>{drugInfo.generic_name}</span>
        </div>
      )}
      
      {drugInfo.manufacturer && (
        <div className="info-section">
          <span className="info-label">Производитель:</span>
          <span>{drugInfo.manufacturer}</span>
        </div>
      )}
      
      {drugInfo.purpose && (
        <div className="info-section">
          <span className="info-label">Назначение:</span>
          <p>{drugInfo.purpose}</p>
        </div>
      )}
      
      {drugInfo.warnings && drugInfo.warnings.length > 0 && (
        <div className="info-section warnings">
          <span className="info-label">Предупреждения:</span>
          <ul>
            {drugInfo.warnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </div>
      )}
      
      {drugInfo.storage && (
        <div className="info-section">
          <span className="info-label">Условия хранения:</span>
          <p>{drugInfo.storage}</p>
        </div>
      )}
      
      {drugInfo.dosage && (
        <div className="info-section">
          <span className="info-label">Применение:</span>
          <p>{drugInfo.dosage}</p>
        </div>
      )}
    </div>
  );
}