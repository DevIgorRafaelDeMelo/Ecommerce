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
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

export default function Header({ filtro, setFiltro, busca, setBusca }) {
  const { itensCarrinho } = useContext(CarrinhoContext);
  const navigate = useNavigate();

  const aplicarFiltro = () => {
    navigate(
      `/?busca=${encodeURIComponent(busca)}${filtro ? `&filtro=${encodeURIComponent(filtro)}` : ""}`,
    );
  };

  const handleFiltro = (tipo) => {
    setFiltro(tipo);
    navigate(`/?filtro=${encodeURIComponent(tipo)}`);
  };

  const [menuOpen, setMenuOpen] = useState(false);

  const itens = [
    "Brut",
    "Extra Brut",
    "Nature (Brut Nature)",
    "Seco",
    "Demi-Sec",
    "Doce / Moscatel",
    "Prosecco",
    "Rosé Espumante",
  ];

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
          onClick={() => {
            setFiltro(null);
            setBusca("");
          }}
          className="container mx-auto flex justify-center py-4"
        >
          <img
            src={Logo}
            alt="CVA Group Distribuidora"
            className="h-22 object-contain"
          />
        </Link>

        <div>
          <nav className="hidden md:flex justify-center space-x-8 text-sm font-medium text-gray-700">
            {itens.map((item) => (
              <button
                key={item}
                onClick={() => handleFiltro(item)}
                className="hover:text-blue-900 transition"
              >
                {item}
              </button>
            ))}
          </nav>
        </div>

        <div className="container mx-auto flex justify-end items-center py-4 px-6 space-x-6">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Buscar"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  aplicarFiltro();
                }
              }}
              className="w-full border pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-grey-500 focus:outline-none"
            />

            <FiSearch
              className="absolute left-3 top-2.5 text-gray-400 cursor-pointer"
              size={18}
              onClick={aplicarFiltro}
            />
          </div>

          <button className="hover:text-grey-600 transition">
            <FiUser size={22} />
          </button>

          <Link to="/" className="relative hover:text-red-600 transition">
            <FiShoppingBag
              onClick={() => {
                setFiltro(null);
                setBusca("");
              }}
              size={22}
            />
            <span className="absolute -top-2 -right-2 bg-black-600 text-white text-xs rounded-full px-2">
              0
            </span>
          </Link>
          <Link
            to="/carinho"
            className="relative hover:text-red-600 transition"
          >
            <FiShoppingCart size={24} />
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-2">
              {itensCarrinho.length}
            </span>
          </Link>

          <button
            className="md:hidden text-gray-700 mb-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {menuOpen && (
          <nav className="flex flex-col space-y-4 text-center text-sm font-medium text-gray-700 md:hidden pb-4">
            {itens.map((item) => (
              <button
                key={item}
                onClick={() => {
                  handleFiltro(item);
                  setMenuOpen(false);
                }}
                className="hover:text-blue-900 transition py-2"
              >
                {item}
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
