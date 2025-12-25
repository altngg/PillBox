import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Icon from "../assets/Icon.png";
import Line from "../assets/Line.png";
import Profile from "../assets/Profile.png";
import { logout } from "../services/authService";

export function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

 
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsAuthenticated(token !== null); 
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleProfileClick = () => {
    setIsMenuOpen(true);
  };

  const goToProfile = () => {
    setIsMenuOpen(false);
    navigate('/profile');
  };

  const goToReminders = () => {
    setIsMenuOpen(false);
    navigate('/reminders');
  };

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    setIsMenuOpen(false);
    navigate('/');
  };

  return (
    <div className="header-container">
      <NavLink to="/">
        <img className="home-button" src={Icon} alt="Домой" />
      </NavLink>

      <div className="menu-buttons">
        {isAuthenticated ? (
          <div className="profile-menu-container" ref={menuRef}>
            <div onClick={handleProfileClick} className="profile-link">
              <img src={Profile} alt="Профиль" className="profile-icon" />
            </div>

            {isMenuOpen && (
              <div className="profile-dropdown-menu">
                <div onClick={goToProfile} className="dropdown-item">
                  Профиль
                </div>
                <div onClick={goToReminders} className="dropdown-item">
                  Напоминания
                </div>
                <div onClick={handleLogout} className="dropdown-item logout">
                  Выйти
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <NavLink to="/login" className="text-button">
              Вход
            </NavLink>
            <img className="line" src={Line} alt="разделение" />
            <NavLink to="/register" className="text-button">
              Регистрация
            </NavLink>
          </>
        )}
      </div>
    </div>
  );
}