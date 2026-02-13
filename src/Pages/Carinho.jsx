import React, { useContext } from "react";
import { CarrinhoContext } from "../Context/Carrinho";
import Header from "../Conponetes/Header";
import Footer from "../Conponetes/Footer";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase";
import { Link } from "react-router-dom";

export default function Carrinho({ setFiltro, busca, setBusca }) {
  const { itensCarrinho, atualizarQuantidade, removerItem } =
    useContext(CarrinhoContext);
  const [endereco, setEndereco] = useState("");
  const [frete, setFrete] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const totalProdutos = itensCarrinho.reduce(
    (acc, item) => acc + item.valorTotal,
    0,
  );

  const [nome, setNome] = useState("");
  const [enderecoCompleto, setEnderecoCompleto] = useState("");
  const [telefone, setTelefone] = useState("");
  const [documento, setDocumento] = useState("");

  const finalizarPedido = async () => {
    if (!frete) {
      alert("Precisa calcular frete antes de finalizar o pedido!");
      return;
    }

    if (!nome || !enderecoCompleto || !telefone || !documento) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      await addDoc(collection(db, "pedidos"), {
        nome,
        enderecoCompleto,
        telefone,
        documento,
        frete,
        totalProdutos,
        totalFinal: totalProdutos + frete,
        itens: itensCarrinho,
        data: new Date(),
      });

      const mensagem = ` Olá! Quero finalizar meu pedido:

 Nome: ${nome}
 Telefone: ${telefone}
 Endereço: ${enderecoCompleto}
 CPF/CNPJ: ${documento}

 Itens:
${itensCarrinho
  .map((item) => {
    const quantidade = Number(item.quantidade) || 0;
    return `• ${item.nome} — Quantidade: ${quantidade}`;
  })
  .join("\n")}

 Valor dos produtos: R$${totalProdutos.toFixed(2)}
 Frete: R$${frete.toFixed(2)}
 Total: R$${(totalProdutos + frete).toFixed(2)}
`;

      const numeroWhats = "5551998927775";
      const url = `https://wa.me/${numeroWhats}?text=${encodeURIComponent(mensagem)}`;

      window.open(url, "_blank");
      setShowModal(false);
    } catch (error) {
      console.error("Erro ao salvar pedido:", error);
      alert("Não foi possível salvar o pedido.");
    }
  };

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
          const destino = response.destinationAddresses[0];

          let valorFrete = 0;

          if (destino.includes("São Sebastião do Caí")) {
            valorFrete = 30;
          } else {
            valorFrete = 30 + totalProdutos * 0.1;
          }

          setFrete(valorFrete);
        } else {
          alert("Não foi possível calcular a distância.");
        }
      },
    );
  };
  return (
    <div className="w-full min-h-screen bg-white shadow-lg flex flex-col">
      <Header setFiltro={setFiltro} busca={busca} setBusca={setBusca} />

      {/* conteúdo principal ocupa o espaço disponível */}
      <main className="flex-1 container mx-auto px-4 sm:px-6 mt-10 py-8 sm:py-12">
        <h1 className="text-xl sm:text-2xl text-center mb-6 font-light tracking-widest">
          Carrinho de Compras
        </h1>

        <div className="hidden sm:grid grid-cols-3 pb-4 font-semibold text-black text-center">
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
                className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 pb-4 "
              >
                <div className="flex items-center gap-4 w-full sm:w-1/3">
                  <img
                    src={item.imagemUrl || "https://via.placeholder.com/80"}
                    alt={item.nome}
                    className="w-20 h-20 object-cover shadow"
                  />
                  <div>
                    <p className="font-semibold text-gray-700">{item.nome}</p>
                    <p className="text-sm text-gray-500">{item.descricao}</p>
                  </div>
                </div>

                <div className="flex flex-col items-center w-full sm:w-1/3">
                  <div className="flex items-center border overflow-hidden shadow-sm">
                    <button
                      onClick={() =>
                        atualizarQuantidade(item.id, item.quantidade - 1)
                      }
                      className="px-3 py-2 hover:bg-gray-100 transition"
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
                      className="px-3 py-2 hover:bg-gray-100 transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center sm:justify-end gap-4 w-full sm:w-1/3 text-sm">
                  <div className="text-center sm:text-right">
                    <p className="text-gray-500">Valor Unitário</p>
                    <p className="font-semibold text-gray-700">
                      R$ {parseFloat(item.valorUnitario).toFixed(2)}
                    </p>
                  </div>

                  <div className="text-center sm:text-right">
                    <p className="text-gray-500">Total</p>
                    <p className="font-semibold text-gray-700">
                      R$ {item.valorTotal.toFixed(2)}
                    </p>
                  </div>

                  <button
                    onClick={() => removerItem(item.id)}
                    className="flex items-center gap-2 text-red-600 hover:text-red-800 transition"
                  >
                    <FaTrash className="h-4 w-4" />
                    <span className="text-xs font-medium">Remover</span>
                  </button>
                </div>
              </div>
            ))}

            <div className="mt-10 ">
              <label className="block text-sm text-gray-600 mb-2">
                Informe sua Cidade e Estado:
              </label>
              <input
                type="text"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                placeholder="São Sebastião do Caí / RS"
                className="border px-3 py-2 text-gray-700 w-full sm:w-auto"
              />
              <button
                onClick={calcularFrete}
                className="mt-2 px-4 py-2 md:ms-8 bg-gray-800 text-white hover:bg-gray-900 transition w-full sm:w-auto"
              >
                Calcular Frete
              </button>

              <div className="border-t mt-6 p-6 sm:w-[70vh] sm:ml-auto">
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
                      : "Calcule o frete"}
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
                    R$
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
                    onClick={() => setShowModal(true)}
                    className={`w-full px-6 py-3 font-semibold shadow-md transition 
          ${frete ? "bg-black text-white hover:bg-gray-800" : "bg-gray-400 text-gray-200 cursor-not-allowed"}`}
                    disabled={!frete}
                  >
                    Finalizar Pedido
                  </button>

                  <Link
                    to="/"
                    onClick={() => setFiltro(null)}
                    className="w-full px-6 py-3 text-center text-gray-800 underline hover:text-gray-900 transition"
                  >
                    Ver mais produtos
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-70 backdrop-blur-sm z-50">
          <div className="bg-white p-6 -lg   w-96 relative border border-gray-200">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-6 text-center text-gray-800">
              Preencher Dados do Cliente
            </h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome completo
                </label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full border  px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <input
                  type="text"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  className="w-full border  px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Endereço completo
                </label>
                <input
                  type="text"
                  value={enderecoCompleto}
                  onChange={(e) => setEnderecoCompleto(e.target.value)}
                  className="w-full border  px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CPF ou CNPJ
                </label>
                <input
                  type="text"
                  value={documento}
                  onChange={(e) => setDocumento(e.target.value)}
                  className="w-full border  px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700  hover:bg-gray-300 transition"
              >
                Cancelar
              </button>
              <button
                onClick={finalizarPedido}
                className="px-4 py-2 bg-black text-white  hover:bg-gray-800 transition"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
