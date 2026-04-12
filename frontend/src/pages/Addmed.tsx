import { Header } from "../components/Header";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { createMedicine, updateMedicine, getMedicineById, uploadMedicinePhoto } from '../services/medicineService';
import { AxiosError } from 'axios';
import './styles/Addmed.css';

export function Addmed() {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('editId');
  
  const [name, setName] = useState('');
  const [form, setForm] = useState('таблетки');
  const [purpose, setPurpose] = useState('');
  const [manufactured, setManufactured] = useState('');
  const [expires, setExpires] = useState('');
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadMedicine = async () => {
      if (!editId) return;

      try {
        const med = await getMedicineById(Number(editId));
        setName(med.name);
        setForm(med.form);
        setPurpose(med.purpose || '');

        if (med.photo_url) {
          setPhotoPreview(med.photo_url);
        }
        
        const formatDate = (dateStr?: string): string => {
          if (!dateStr) return '';
          const [year, month, day] = dateStr.split('-');
          return `${day}.${month}.${year}`;
        };
        
        setManufactured(formatDate(med.manufacture_date));
        setExpires(formatDate(med.expiry_date));
        setIsEditing(true);
      } catch (err) {
        console.error('Ошибка загрузки препарата:', err);
        alert('Не удалось загрузить препарат для редактирования');
        navigate('/pillbox');
      }
    };

    loadMedicine();
  }, [editId, navigate]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Разрешены только изображения: JPG, PNG, WebP');
      return;
    }
    
    const maxSize = 5 * 1024 * 1024; 
    if (file.size > maxSize) {
      setError('Размер файла не должен превышать 5 МБ');
      return;
    }

    setSelectedFile(file);
    setError(null);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setSelectedFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const parseDate = (dateStr: string): string | undefined => {
      if (!dateStr) return undefined;
      const parts = dateStr.split('.');
      if (parts.length === 3) {
        const [day, month, year] = parts;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
      return undefined;
    };

    const manufactureDate = parseDate(manufactured);
    const expiryDate = parseDate(expires);

    if (!expiryDate) {
      setError('Неверный формат даты "Годен до". Используйте ДД.ММ.ГГГГ');
      setLoading(false);
      return;
    }

    try {
      let medicineId: number;
      
      if (isEditing && editId) {
        await updateMedicine(Number(editId), {
          name,
          form,
          purpose: purpose || undefined,
          manufacture_date: manufactureDate,
          expiry_date: expiryDate,
        });
        medicineId = Number(editId);
      } else {
        const newMed = await createMedicine({
          name,
          form,
          purpose: purpose || undefined,
          manufacture_date: manufactureDate,
          expiry_date: expiryDate,
        });
        medicineId = newMed.id;
      }

      if (selectedFile && medicineId) {
        setUploading(true);
        try {
          await uploadMedicinePhoto(medicineId, selectedFile);
        } catch (uploadErr) {
          console.warn('Не удалось загрузить фото:', uploadErr);
          setError('Препарат сохранён, но фото не загружено. Попробуйте позже.');
        } finally {
          setUploading(false);
        }
      }

      navigate('/pillbox');
    } catch (err) {
      console.error('Ошибка сохранения:', err);
      if (err instanceof AxiosError) {
        if (err.response?.status === 422) {
          setError('Проверьте данные: все поля обязательны, даты в формате ДД.ММ.ГГГГ');
        } else {
          setError('Не удалось сохранить препарат. Попробуйте позже.');
        }
      } else {
        setError('Ошибка сети');
      }
      setLoading(false);
    }
  };

  const title = isEditing ? 'Редактировать препарат' : 'Добавить препарат';

  return (
    <div>
      <Header />
      <div className="add-med-container">
        <h1 className="add-med-title">{title}</h1>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit} className="add-med-form">
          <div className="form-group photo-upload-group">
            <label>Фотография препарата:</label>
            
            <div className="photo-upload-area">
              {photoPreview ? (
                <div className="photo-preview">
                  <img src={photoPreview} alt="Превью" className="preview-image" />
                  <button 
                    type="button" 
                    onClick={handleRemovePhoto}
                    className="remove-photo-btn"
                    disabled={uploading}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <label className="upload-label">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/jpeg,image/png,image/webp"
                    disabled={uploading}
                    className="file-input-hidden"
                  />
                  <div className="upload-placeholder">
                    <span>Выберите фото</span>
                    <span className="upload-hint">JPG, PNG, WebP до 5 МБ</span>
                  </div>
                </label>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="name">Название:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="form">Форма препарата:</label>
            <select
              id="form"
              name="form"
              value={form}
              onChange={(e) => setForm(e.target.value)}
              required
              className="form-input"
            >
              <option value="таблетки">Таблетки</option>
              <option value="капсулы">Капсулы</option>
              <option value="мазь">Мазь</option>
              <option value="капли">Капли</option>
              <option value="сироп">Сироп</option>
              <option value="инъекции">Инъекции</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="manufactured">Изготовлен:</label>
              <input
                type="text"
                id="manufactured"
                name="manufactured"
                value={manufactured}
                onChange={(e) => setManufactured(e.target.value)}
                placeholder="ДД.ММ.ГГГГ"
                pattern="\d{2}\.\d{2}\.\d{4}"
                className="form-input-date"
              />
            </div>

            <div className="form-group">
              <label htmlFor="expires">Годен до:</label>
              <input
                type="text"
                id="expires"
                name="expires"
                value={expires}
                onChange={(e) => setExpires(e.target.value)}
                placeholder="ДД.ММ.ГГГГ"
                pattern="\d{2}\.\d{2}\.\d{4}"
                required
                className="form-input-date"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="purpose">Назначение:</label>
            <textarea
              id="purpose"
              name="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder=""
              rows={4}
              className="form-textarea"
            />
          </div>

          <button 
            type="submit" 
            className="confirm-button"
            disabled={loading || uploading}
          >
            {loading ? 'Сохранение...' : uploading ? 'Загрузка фото...' : isEditing ? 'Сохранить изменения' : 'Подтвердить'}
          </button>
        </form>
      </div>
    </div>
  );
}