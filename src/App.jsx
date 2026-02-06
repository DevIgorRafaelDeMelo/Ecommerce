import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home.jsx";
import Admin from "./Pages/Admin.jsx";
import ProdutoDetalhe from "./Pages/ProdutoDetalhe.jsx";
import { CarrinhoProvider } from "./Context/Carrinho.jsx";
import Carrinho from "./Pages/Carinho.jsx";

function App() {
  return (
    <div>
      <CarrinhoProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/*" element={<Admin />} />
          <Route path="/produto/:id" element={<ProdutoDetalhe />} />
          <Route path="/carinho" element={<Carrinho />} />
        </Routes>
      </CarrinhoProvider>
    </div>
  );
}

export default App;
