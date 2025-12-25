import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Pillbox } from "./pages/Pillbox";
import { Addmed } from "./pages/Addmed";
import { Register } from "./pages/Register";
import { Reminder } from "./pages/Reminder";
import { Profile } from "./pages/Profile";
import { Medicine } from "./pages/Medicine";
import { Reminders } from "./pages/Reminders";

import "./App.css";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    // Если нет токена — перенаправляем на логин
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Публичные маршруты */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Защищённые маршруты */}
        <Route
          path="/pillbox"
          element={
            <ProtectedRoute>
              <Pillbox />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/addmed"
          element={
            <ProtectedRoute>
              <Addmed />
            </ProtectedRoute>
          }
        />
        <Route path="/medicine/:id" element={<Medicine />} />
        <Route
          path="/reminder"
          element={
            <ProtectedRoute>
              <Reminder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reminders"
          element={
            <ProtectedRoute>
              <Reminders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;