import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Pillbox } from "./pages/Pillbox";
import { Addmed } from "./pages/Addmed";
import { Register } from "./pages/Register";
import { Reminder } from "./pages/Reminder";
import { Profile } from "./pages/Profile";
import "./App.css";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/pillbox" element={<Pillbox />} />
        <Route path="/addmed" element={<Addmed />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reminder" element={<Reminder />} />
        <Route path="/profile" element={<Profile />} />
        
      </Routes>
    </BrowserRouter>
  );
};

export default App;