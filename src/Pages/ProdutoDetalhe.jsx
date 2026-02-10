import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Header from "../Conponetes/Header";
import Footer from "../Conponetes/Footer";
import { CarrinhoContext } from "../Context/Carrinho";
import { Link } from "react-router-dom";

export default function ProdutoDetalhe() {
  const { adicionarAoCarrinho } = useContext(CarrinhoContext);

  const { id } = useParams();

  const [produto, setProduto] = useState({
    id: "",
    nome: "",
    valorVenda: 0,
    imagemUrl: "",
    tipoBebida: "",
  });

  const [quantidade, setQuantidade] = useState(1);
  const valorTotal = quantidade * produto.valorVenda;
  const [showModal, setShowModal] = useState(false);

  const handleAdicionar = () => {
    adicionarAoCarrinho(produto, quantidade);
    setShowModal(true);
  };

  useEffect(() => {
    const fetchProduto = async () => {
      const produtoRef = doc(db, "itens", id);
      const snapshot = await getDoc(produtoRef);
      if (snapshot.exists()) {
        setProduto({ id: snapshot.id, ...snapshot.data() });
      }
    };
    fetchProduto();
  }, [id]);

  if (!produto) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-1 container mx-auto px-6 py-12 flex justify-center">
        <div className="    p-10 flex flex-col md:flex-row gap-12 max-w-5xl w-full">
          <div className="flex-1 flex items-center justify-center">
            {produto.imagemUrl ? (
              <img
                src={produto.imagemUrl}
                alt={produto.nome}
                className="w-4/5  object-cover shadow-md mx-auto"
              />
            ) : (
              <div className="w-4/5 h-64 flex items-center justify-center bg-gray-200 rounded-lg mx-auto">
                <span className="text-gray-400">Sem imagem</span>
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                {produto.nome}
              </h2>

              <p className="text-sm uppercase text-gray-500 mb-2">
                Categoria:{" "}
                <span className="font-semibold text-gray-700">
                  {produto.tipoBebida}
                </span>
              </p>

              <p className="text-3xl font-bold text-blue-900 mb-6">
                R$ {produto.valorVenda}{" "}
                <span className="text-base font-medium text-gray-500">
                  / UN
                </span>
              </p>

              <p className="text-gray-700 mb-6 leading-relaxed">
                Uma bebida alcoólica selecionada para momentos especiais. Ideal
                para festas, encontros com amigos ou para apreciar com requinte.
                Aproveite a qualidade e tradição que só a nossa loja oferece.
              </p>

              <div className="flex items-center gap-4 mb-6">
                <label className="text-gray-700 font-medium">Quantidade:</label>
                <input
                  type="number"
                  min="1"
                  value={quantidade}
                  onChange={(e) => setQuantidade(Number(e.target.value))}
                  className="border rounded-lg px-4 py-2 w-24 text-center focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                />
              </div>

              <p className="text-sm text-gray-600 mb-2">
                Unidade por fardo:{" "}
                <span className="font-semibold">{produto.quantidadeFardo}</span>
              </p>

              <p className="text-xl font-bold text-gray-800 mb-6">
                Total:{" "}
                <span className="text-blue-900">
                  R$ {valorTotal.toFixed(2)}
                </span>
              </p>
            </div>

            <button
              onClick={handleAdicionar}
              className="w-full bg-gradient-to-r from-gray-800 to-gray-800 text-white py-4 rounded-lg hover:from-gray-900 hover:to-gray-900 transition text-lg font-semibold shadow-lg"
            >
              Adicionar ao Carrinho
            </button>
          </div>
        </div>
      </main>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white shadow-2xl p-10 w-[600px] max-w-2xl text-center transform transition-all scale-100 animate-fadeIn">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              Item adicionado ao carrinho!
            </h3>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Seu produto foi adicionado com sucesso. Deseja continuar
              explorando mais opções ou ir direto para o carrinho?
            </p>
            <div className="flex justify-center gap-6">
              <Link
                to="/"
                onClick={() => setShowModal(false)}
                className="px-6 py-3 bg-gray-100   hover:bg-gray-200 transition font-medium shadow-sm text-gray-800"
              >
                Continuar comprando
              </Link>
              <Link
                to="/carinho"
                className="px-6 py-3 bg-gray-600 text-white  hover:bg-gray-700 transition font-semibold shadow-md"
              >
                Ir para o carrinho
              </Link>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
