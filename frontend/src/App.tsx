import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import "./App.css";
// import { Pillbox } from "./pages/Pillbox";
// import { Medicine } from "./pages/Medicine";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        {/* <Route path="/about" element={<About />} />
        <Route path="/login" element={<About />} />
        <Route path="/register" element={<About />} />
        <Route path="/pillbox" element={<Pillbox />} />
        <Route path="/medicine" element={<Medicine />} /> */}
        
        
      </Routes>
    </BrowserRouter>
  );
};

export default App;