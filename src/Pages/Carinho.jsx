import React, { useContext } from "react";
import { CarrinhoContext } from "../Context/Carrinho";
import Header from "../Conponetes/Header";
import Footer from "../Conponetes/Footer";

export default function Carrinho({ onClose }) {
  const { itensCarrinho, atualizarQuantidade } = useContext(CarrinhoContext);

  return (
    <div className=" w-full h-full bg-white shadow-lg  flex flex-col">
      <Header />
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold mb-6">Carrinho de Compras</h1>

        {itensCarrinho.length === 0 ? (
          <p className="text-gray-600">Seu carrinho está vazio.</p>
        ) : (
          <div className="flex items-center justify-between border-b py-4">
            <div className="flex items-center gap-4 w-1/3">
              <img
                src={
                  itensCarrinho.imagemUrl || "https://via.placeholder.com/80"
                }
                alt={itensCarrinho.nome}
                className="w-20 h-20 object-cover rounded-md shadow"
              />
              <div>
                <h3 className="text-sm font-semibold text-gray-700">Produto</h3>
                <p className="text-gray-900">{itensCarrinho.nome}</p>
              </div>
            </div>

            <div className="flex itensCarrinhos-center gap-2 w-1/3 justify-center">
              <h3 className="text-sm font-semibold text-gray-700">
                Quantidade
              </h3>
              <button
                onClick={() =>
                  atualizarQuantidade(
                    itensCarrinho.id,
                    itensCarrinho.quantidade - 1,
                  )
                }
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                -
              </button>
              <input
                type="number"
                value={itensCarrinho.quantidade}
                min="1"
                readOnly
                className="w-12 text-center border rounded"
              />
              <button
                onClick={() =>
                  atualizarQuantidade(
                    itensCarrinho.id,
                    itensCarrinho.quantidade + 1,
                  )
                }
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                +
              </button>
            </div>

            <div className="flex flex-col itensCarrinhos-end w-1/3">
              <h3 className="text-sm font-semibold text-gray-700">Valores</h3>
              <p className="text-gray-600">
                Unitário: R$ 12
              </p>
              <p className="text-green-600 font-bold">
                Total: R${" "}
                {(
                  itensCarrinho.valorUnitario * itensCarrinho.quantidade
                ).toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
