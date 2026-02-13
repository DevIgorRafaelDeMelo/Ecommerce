import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home.jsx";
import Admin from "./Pages/Admin.jsx";
import ProdutoDetalhe from "./Pages/ProdutoDetalhe.jsx";
import { CarrinhoProvider } from "./Context/Carrinho.jsx";
import Carrinho from "./Pages/Carinho.jsx";

function App() {
  const [filtro, setFiltro] = useState(null);
  const [busca, setBusca] = useState("");

  return (
    <div>
      <CarrinhoProvider>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                filtro={filtro}
                setFiltro={setFiltro}
                busca={busca}
                setBusca={setBusca}
              />
            }
          />
          <Route path="/admin/*" element={<Admin />} />
          <Route
            path="/produto/:id"
            element={
              <ProdutoDetalhe
                filtro={filtro}
                setFiltro={setFiltro}
                busca={busca}
                setBusca={setBusca}
              />
            }
          />
          <Route
            path="/carinho"
            element={
              <Carrinho
                filtro={filtro}
                setFiltro={setFiltro}
                busca={busca}
                setBusca={setBusca}
              />
            }
          />
        </Routes>
      </CarrinhoProvider>
    </div>
  );
}

export default App;
