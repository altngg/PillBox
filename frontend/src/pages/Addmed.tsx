import { Header } from "../components/Header";
import { useNavigate } from 'react-router-dom';
import './styles/Addmed.css';

export function Addmed () {
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Препарат добавлен');
    navigate('/pillbox'); 
  };
    return(
        <div>
            <Header />
                 <div className="add-med-container">
                    <h1 className="add-med-title">Добавить препарат</h1>
                    
                    <form onSubmit={handleSubmit} className="add-med-form">
                        <div className="form-group">
                        <label htmlFor="name">Название:</label>
                        <input
                            type="text"
                            id="name"
                            placeholder=""
                            required
                            className="form-input"
                        />
                        </div>

                        <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="manufactured">Изготовлен:</label>
                            <input
                            type="text"
                            id="manufactured"
                            placeholder="ДД.ММ.ГГГГ"
                            pattern="\d{2}\.\d{2}\.\d{4}"
                            required
                            className="form-input-date"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="expires">Годен до:</label>
                            <input
                            type="text"
                            id="expires"
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
                            placeholder=""
                            rows={4}
                            required
                            className="form-textarea"
                        />
                        </div>

                        <button type="submit" className="confirm-button">
                        Подтвердить
                        </button>
                    </form>
    </div>
        </div>
    );
}