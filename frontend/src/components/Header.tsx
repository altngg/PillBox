import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Icon from "../assets/Icon.png";
import Line from "../assets/Line.png";
import Profile from "../assets/Profile.png";

export function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  // Проверяем, залогинен ли пользователь
  useEffect(() => {
    const loggedIn = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(loggedIn);
  }, []);

  // Закрытие меню при клике вне его
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

  const openMenu = () => {
    setIsMenuOpen(true);
  };

  const handleProfileClick = () => {
    // Если меню закрыто — открываем его
    if (!isMenuOpen) {
      openMenu();
    }
    // Если уже открыто — можно оставить как есть или закрыть (но лучше управлять через пункты)
  };

  const goToProfile = () => {
    setIsMenuOpen(false);
    navigate('/profile'); // если нет — можно на /pillbox
  };

  const goToReminders = () => {
    setIsMenuOpen(false);
    navigate('/reminders');
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
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
            {/* div как "ссылка-кнопка" для открытия меню */}
            <div onClick={handleProfileClick} className="profile-link">
              <img src={Profile} alt="Профиль" className="profile-icon" />
            </div>

            {/* Всплывающее меню */}
            {isMenuOpen && (
              <div className="profile-dropdown-menu">
                <div
                  onClick={goToProfile}
                  className="dropdown-item"
                >
                  Профиль
                </div>
                <div
                  onClick={goToReminders}
                  className="dropdown-item"
                >
                  Напоминания
                </div>
                <div
                  onClick={handleLogout}
                  className="dropdown-item logout"
                >
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