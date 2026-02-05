import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home.jsx";
import Admin from "./Pages/Admin.jsx";
import ProdutoDetalhe from "./Pages/ProdutoDetalhe.jsx";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/produto/:id" element={<ProdutoDetalhe />} />
      </Routes>
    </div>
  );
}

export default App;
