import React from "react";
import { useContext } from "react";
import { CarrinhoContext } from "../Context/Carrinho";
import {
  FiSearch,
  FiUser,
  FiShoppingBag,
  FiShoppingCart,
} from "react-icons/fi";
import { Link } from "react-router-dom";

export default function Header({ setFiltro, busca, setBusca }) {
  const { itensCarrinho } = useContext(CarrinhoContext);

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
        <div className="container mx-auto flex justify-center py-4">
          <div className="text-3xl font-extrabold tracking-tight cursor-pointer">
            TOO BASIC
          </div>
        </div>

        <nav className="flex justify-center space-x-8 text-sm font-medium text-gray-700">
          <button
            onClick={() => setFiltro("Whisky")}
            className="hover:text-red-600 transition"
          >
            Whisky
          </button>
          <button
            onClick={() => setFiltro("Vodka")}
            className="hover:text-red-600 transition"
          >
            Vodka
          </button>
          <button
            onClick={() => setFiltro("Cerveja")}
            className="hover:text-red-600 transition"
          >
            Cerveja
          </button>
          <button
            onClick={() => setFiltro("Vinho")}
            className="hover:text-red-600 transition"
          >
            Vinho
          </button>
          <button
            onClick={() => setFiltro("Gin")}
            className="hover:text-red-600 transition"
          >
            Gin
          </button>
          <button
            onClick={() => setFiltro("Rum")}
            className="hover:text-red-600 transition"
          >
            Rum
          </button>
          <button
            onClick={() => setFiltro("Tequila")}
            className="hover:text-red-600 transition"
          >
            Tequila
          </button>
          <button
            onClick={() => setFiltro("Licor")}
            className="hover:text-red-600 transition"
          >
            Licor
          </button>
          <button
            onClick={() => setFiltro("Espumante")}
            className="hover:text-red-600 transition"
          >
            Espumante
          </button>
          <button
            onClick={() => setFiltro("Destilados")}
            className="hover:text-red-600 transition"
          >
            Destilados
          </button>
        </nav>

        <div className="container mx-auto flex justify-end items-center py-4 px-6 space-x-6">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Buscar"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full border pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
            <FiSearch
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>

          <button className="hover:text-red-600 transition">
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
