import { Header } from "../components/Header";
import HomeImage from "../assets/HomePageImage.png";
import './styles/Home.css';

export function Home() {
    return(
        <div>
            <Header/>
                <div className="home-container">
                    <h1 className="about-text-header">
                    Что такое PillBox?
                    <br />
                    Ваша персональная удобная аптечка
                </h1>

                <div className="about-section">
                    <div className="feature-list">
                        <div className="feature-item">Добавляйте  имеющиеся у вас препараты</div>
                        <div className="feature-item">Отслеживайте сроки годности</div>
                        <div className="feature-item">Напоминание о приеме лекарств</div>
                    </div>
                    <img src={HomeImage} alt="PB" className="home-image"/>
                </div>
            </div>
        </div>
    );
}