import React from "react";
import { useContext } from "react";
import { CarrinhoContext } from "../Context/Carrinho";
import {
  FiSearch,
  FiUser,
  FiShoppingBag,
  FiShoppingCart,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/Img/Logo.png";

export default function Header({ setFiltro, busca, setBusca }) {
  const { itensCarrinho } = useContext(CarrinhoContext);
  const navigate = useNavigate();

  const handleFiltro = (tipo) => {
    setFiltro(tipo);
    navigate("/");
  };

  return (
    <header className=" top-0 w-full z-50">
      <div className="bg-gray-900 text-white text-xs py-2 overflow-hidden">
        <div className="whitespace-nowrap animate-marquee">
          <span className="mx-8">
            FRETE GRÁTIS EM COMPRAS ACIMA DE R$ 1.000,00
          </span>
          <span className="mx-8"> PRIMEIRA TROCA GRÁTIS</span>
          <span className="mx-8"> ENTREGA EM TODO O BRASIL</span>
          <span className="mx-8">
            FRETE GRÁTIS EM COMPRAS ACIMA DE R$ 1.000,00
          </span>
          <span className="mx-8"> PRIMEIRA TROCA GRÁTIS</span>
          <span className="mx-8"> ENTREGA EM TODO O BRASIL</span>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-md shadow-md">
        <Link
          to="/"
          onClick={() => setFiltro(null)}
          className="container mx-auto flex justify-center py-4"
        >
          <img
            src={Logo}
            alt="CVA Group Distribuidora"
            className="h-22 object-contain"
          />
        </Link>

        <nav className="flex justify-center space-x-8 text-sm font-medium text-gray-700">
          <button
            onClick={() => handleFiltro("Brut")}
            className="hover:text-blue-900 transition"
          >
            Brut
          </button>

          <button
            onClick={() => handleFiltro("Extra Brut")}
            className="hover:text-blue-900 transition"
          >
            Extra Brut
          </button>

          <button
            onClick={() => handleFiltro("Nature")}
            className="hover:text-blue-900 transition"
          >
            Nature (Brut Nature)
          </button>

          <button
            onClick={() => handleFiltro("Seco")}
            className="hover:text-blue-900 transition"
          >
            Seco
          </button>

          <button
            onClick={() => handleFiltro("Demi-Sec")}
            className="hover:text-blue-900 transition"
          >
            Demi-Sec
          </button>

          <button
            onClick={() => handleFiltro("Doce")}
            className="hover:text-blue-900 transition"
          >
            Doce / Moscatel
          </button>

          <button
            onClick={() => handleFiltro("Prosecco")}
            className="hover:text-blue-900 transition"
          >
            Prosecco
          </button>

          <button
            onClick={() => handleFiltro("Rosé Espumante")}
            className="hover:text-blue-900 transition"
          >
            Rosé Espumante
          </button>
        </nav>

        <div className="container mx-auto flex justify-end items-center py-4 px-6 space-x-6">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Buscar"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full border pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-grey-500 focus:outline-none"
            />
            <FiSearch
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>

          <button className="hover:text-grey-600 transition">
            <FiUser size={22} />
          </button>

          <button className="relative hover:text-red-600 transition">
            <FiShoppingBag size={22} />
            <span className="absolute -top-2 -right-2 bg-black-600 text-white text-xs rounded-full px-2">
              0
            </span>
          </button>
          <Link
            to="/carinho"
            className="relative hover:text-red-600 transition"
          >
            <FiShoppingCart size={24} />
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-2">
              {itensCarrinho.length}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
