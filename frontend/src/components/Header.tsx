import { NavLink } from "react-router-dom";
import Icon from "../assets/Icon.png";
import Line from "../assets/Line.png";

export function Header(){
    return(
        <div className="header-container">
            <NavLink to="/">
                <img className="home-button" src={Icon} alt="Домой" />
            </NavLink>
            <div className="menu-buttons">
                <NavLink to="/login" className="text-button">Вход</NavLink>
                <img className="line" src={Line} alt="разделение" />
                <NavLink to="/register" className="text-button">Регистрация</NavLink>
            </div>
            
        </div>
    );
}