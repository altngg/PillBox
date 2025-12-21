import { Header } from "../components/Header";
import { AddButton } from '../components/AddButton';
import { useNavigate } from 'react-router-dom';
import './styles/Pillbox.css';

export function Pillbox() {
    const navigate = useNavigate();
    const handleAddMedicine = () => {
   
      console.log('Добавить лекарство');
      navigate('/addmed');
  };

  return (
    <div>
        <Header />
        <div className="pillbox-container">

        <div className="pillbox-header">
            <div className="stats">Добавлено лекарств: 0</div>
            <div className="search-box">
            <label htmlFor="search">Поиск:</label>
            <input type="text" id="search" placeholder="" />
            </div>
        </div>

        <AddButton onClick={handleAddMedicine} />
        </div>
    </div>
  );
}