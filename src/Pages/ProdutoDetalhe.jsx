import { useParams, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { FaShoppingCart } from "react-icons/fa";

export default function ProdutoDetalhe() {
  const { id } = useParams();
  const [produto, setProduto] = useState({
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
        setProduto(snapshot.data());
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
      {/* Header */}
      <header className="bg-blue-600 text-white py-4 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center px-6">
          <h1 className="text-2xl font-bold">Minha Loja</h1>
          <nav className="space-x-6 flex items-center">
            <Link to="/" className="hover:underline">
              Home
            </Link>
            <Link to="/produtos" className="hover:underline">
              Produtos
            </Link>
            <Link to="/contato" className="hover:underline">
              Contato
            </Link>
            <Link to="/carrinho" className="relative">
              <FaShoppingCart className="text-2xl" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                0
              </span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="flex-1 container mx-auto px-6 py-12 flex justify-center">
        <div className="    p-10 flex flex-col md:flex-row gap-12 max-w-5xl w-full">
          {/* Imagem */}
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

            {/* Botão de ação */}
            <button
              onClick={() => {
                console.log(
                  "Adicionado ao carrinho:",
                  produto.nome,
                  quantidade,
                );
              }}
              className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition text-lg font-semibold shadow-md"
            >
              Adicionar ao Carrinho
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-600 text-white py-4 mt-10">
        <div className="container mx-auto text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} Minha Loja. Todos os direitos
            reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
