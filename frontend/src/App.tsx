import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Pillbox } from "./pages/Pillbox";
import { Addmed } from "./pages/Addmed";
import { Register } from "./pages/Register";
import "./App.css";
// import { Pillbox } from "./pages/Pillbox";
// import { Medicine } from "./pages/Medicine";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/pillbox" element={<Pillbox />} />
        <Route path="/addmed" element={<Addmed />} />
        <Route path="/register" element={<Register />} />
        
        
      </Routes>
    </BrowserRouter>
  );
};

export default App;