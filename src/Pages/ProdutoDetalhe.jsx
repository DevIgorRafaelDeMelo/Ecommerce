import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Header from "../Conponetes/Header";
import Footer from "../Conponetes/Footer";
import { CarrinhoContext } from "../Context/Carrinho";

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
                className="w-4/5 h-1/2 object-cover rounded-lg shadow-md mx-auto"
              />
            ) : (
              <div className="w-4/5 h-64 flex items-center justify-center bg-gray-200 rounded-lg mx-auto">
                <span className="text-gray-400">Sem imagem</span>
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
                {produto.nome}
              </h2>
              <p className="text-lg text-gray-600 mb-2">
                Categoria: {produto.tipoBebida}
              </p>
              <p className="text-green-600 font-bold text-3xl mb-6">
                R$ {produto.valorVenda}
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
                  className="border rounded-lg px-4 py-2 w-24 text-center focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <p className="text-xl font-bold text-gray-800">
                Total: R$ {valorTotal.toFixed(2)}
              </p>
            </div>

            <button
              onClick={() => adicionarAoCarrinho(produto, quantidade)}
              className="w-full bg-blue-900 text-white py-4 rounded-lg hover:bg-blue-700 transition text-lg font-semibold shadow-md"
            >
              Adicionar ao Carrinho
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
