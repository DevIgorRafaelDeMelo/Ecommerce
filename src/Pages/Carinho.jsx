import React, { useContext } from "react";
import { CarrinhoContext } from "../Context/Carrinho";
import Header from "../Conponetes/Header";
import Footer from "../Conponetes/Footer";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";

export default function Carrinho() {
  const { itensCarrinho, atualizarQuantidade, removerItem } =
    useContext(CarrinhoContext);

  const [endereco, setEndereco] = useState("");
  const [frete, setFrete] = useState(null);

  const totalProdutos = itensCarrinho.reduce(
    (acc, item) => acc + item.valorTotal,
    0,
  );

  const calcularFrete = () => {
    if (!window.google) {
      alert("API do Google Maps ainda não carregou.");
      return;
    }

    const service = new window.google.maps.DistanceMatrixService();

    service.getDistanceMatrix(
      {
        origins: ["São Sebastião do Caí, RS"],
        destinations: [endereco],
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === "OK") {
          const distanciaKm =
            response.rows[0].elements[0].distance.value / 1000;

          let valorFrete =
            distanciaKm <= 20 ? totalProdutos * 0.1 : totalProdutos * 0.2;

          if (valorFrete < 45) valorFrete = 45;

          setFrete(valorFrete);
        } else {
          alert("Não foi possível calcular a distância.");
        }
      },
    );
  };

  return (
    <div className="w-full h-full bg-white shadow-lg flex flex-col">
      <Header />
      <div className="container mx-auto px-6 mt-10 py-12">
        <h1 className="text-2xl text-center mb-6 font-light tracking-widest">
          Carrinho de Compras
        </h1>

        <div className="grid grid-cols-3 pb-4 font-semibold text-black text-center">
          <div className="text-left">Produtos</div>
          <div>Quantidade</div>
          <div className="flex flex-col items-end pr-4">
            <p className="text-black">Valor total</p>
          </div>
        </div>

        {itensCarrinho.length === 0 ? (
          <p className="text-gray-600">Seu carrinho está vazio.</p>
        ) : (
          <div className="space-y-6">
            {itensCarrinho.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between  pb-4"
              >
                <div className="flex items-center gap-4 w-1/3">
                  <img
                    src={item.imagemUrl || "https://via.placeholder.com/80"}
                    alt={item.nome}
                    className="w-20 h-20 object-cover  shadow"
                  />
                  <div>
                    <p className="font-semibold text-gray-700">{item.nome}</p>
                  </div>
                </div>

                <div className="flex flex-col items-center w-1/3">
                  <div className="flex items-center border   overflow-hidden shadow-sm">
                    <button
                      onClick={() =>
                        atualizarQuantidade(item.id, item.quantidade - 1)
                      }
                      className="px-3 py-2  hover:bg-gray-100 transition"
                    >
                      −
                    </button>
                    <span className="px-4 py-2 text-gray-900 font-light">
                      {item.quantidade}
                    </span>
                    <button
                      onClick={() =>
                        atualizarQuantidade(item.id, item.quantidade + 1)
                      }
                      className="px-3 py-2   hover:bg-gray-100 transition"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-8 w-1/3 text-sm">
                  {/* Valor unitário */}
                  <div className="text-right">
                    <p className="text-gray-500">Valor Unitário</p>
                    <p className="font-semibold text-gray-700">
                      R$ {parseFloat(item.valorUnitario).toFixed(2)}
                    </p>
                  </div>

                  {/* Valor total */}
                  <div className="text-right">
                    <p className="text-gray-500">Total</p>
                    <p className="font-semibold text-gray-700">
                      R$ {item.valorTotal.toFixed(2)}
                    </p>
                  </div>

                  {/* Botão remover */}
                  <button
                    onClick={() => removerItem(item.id)}
                    className="flex items-center gap-2 text-black-600 hover:text-black-800 transition"
                  >
                    <FaTrash className="h-4 w-4" />
                    <span className="text-xs font-medium">Remover</span>
                  </button>
                </div>
              </div>
            ))}
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-2">
                Informe sua cidade/endereço:
              </label>
              <input
                type="text"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-gray-700"
              />
              <button
                onClick={calcularFrete}
                className="mt-2 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition"
              >
                Calcular Frete
              </button>
            </div>

            <div className="border-t pt-6 mt-6 w-[50vh] p-6 ml-auto">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold text-gray-900">
                  R${" "}
                  {itensCarrinho
                    .reduce((acc, item) => acc + item.valorTotal, 0)
                    .toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Frete:</span>
                <span className="font-semibold text-gray-900">
                  {frete !== null
                    ? `R$ ${frete.toFixed(2)}`
                    : "Calcule para visualizar"}
                </span>
              </div>

              <div className="flex justify-between mb-4">
                <span className="text-gray-600">Total:</span>
                <span className="text-xl font-bold text-gray-900">
                  R$ {(totalProdutos + (frete || 0)).toFixed(2)}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-6">
                Ou até 4x de{" "}
                <span className="font-semibold text-gray-800">
                  R${" "}
                  {(
                    itensCarrinho.reduce(
                      (acc, item) => acc + item.valorTotal,
                      0,
                    ) / 4
                  ).toFixed(2)}
                </span>{" "}
                sem juros
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => alert("Compra iniciada!")}
                  className="w-full px-6 py-3 bg-black text-white shadow-md hover:bg-gray-800 transition font-semibold"
                >
                  Iniciar Compra
                </button>
                <button
                  onClick={() => alert("Ver mais produtos")}
                  className="w-full px-6 py-3 text-gray-800 underline hover:text-gray-900 transition"
                >
                  Ver mais produtos
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
