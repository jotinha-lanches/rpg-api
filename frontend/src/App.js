import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Batalha from "./pages/Batalha";

function App() {
  return (
    <Router>
      <nav>
        <ul>
          <li><Link to="/">Início</Link></li>
          <li><Link to="/batalha">Batalha</Link></li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<h1>Bem-vindo ao RPG Battle!</h1>} />
        <Route path="/batalha" element={<Batalha />} />
      </Routes>
    </Router>
  );
}

export default App;
