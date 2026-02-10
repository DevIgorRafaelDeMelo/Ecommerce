import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";
import Header from "../Conponetes/Header";
import Footer from "../Conponetes/Footer";

export default function Home() {
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "itens"), (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProdutos(lista.filter((p) => p.ativo));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const produtosFiltrados = produtos.filter((p) => {
    const matchNome = p.nome.toLowerCase().includes(busca.toLowerCase());
    const matchTipo = filtro ? p.tipoBebida === filtro : true;
    return matchNome && matchTipo;
  });

  return (
    <div className="min-h-screen flex flex-col ">
      <Header setFiltro={setFiltro} busca={busca} setBusca={setBusca} />

      <main className="flex-1 container mx-auto px-6 py-16 ">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12 relative">
          Produtos Disponíveis
          <span className="block w-24 h-1 bg-gray-600 mx-auto mt-2 rounded-full"></span>
        </h2>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4  border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : produtosFiltrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-white border border-gray-200 p-8 rounded-xl shadow-md">
            <span className="text-4xl text-gray-400 mb-2">📭</span>
            <p className="text-gray-600 font-medium">
              Nenhum produto encontrado.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8">
            {produtosFiltrados.map((produto) => (
              <div className=" overflow-hidden  transition transform hover:-translate-y-1">
                {produto.desconto && (
                  <span className="absolute top-3 left-3 bg-black text-white text-xs font-bold px-3 py-1 shadow-md">
                    -{produto.desconto}% OFF
                  </span>
                )}

                {produto.imagemUrl ? (
                  <img
                    src={produto.imagemUrl}
                    alt={produto.nome}
                    className="h-56 w-40 m-auto object-cover"
                  />
                ) : (
                  <div className="h-56 w-full flex items-center justify-center bg-gray-200">
                    <span className="text-gray-400">Sem imagem</span>
                  </div>
                )}

                <div className="p-4 flex flex-col gap-2">
                  <h3 className="text-lg font-bold text-gray-900 truncate">
                    {produto.nome}
                  </h3>

                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 line-through text-sm">
                      R$ {produto.precoOriginal}
                    </span>
                    <span className="text-black-600 font-semibold text-xl">
                      R$ {produto.valorVenda}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500">
                    3x de R$ {(produto.valorVenda / 3).toFixed(2)} sem juros
                  </p>

                  {produto.desconto > 0 ? (
                    <span className="text-black font-bold text-sm">
                      -{produto.desconto}% OFF
                    </span>
                  ) : (
                    <span className="text-gray-500 text-sm">Preço normal</span>
                  )}

                  {produto.esgotado ? (
                    <span className="text-black font-bold text-sm mt-2">
                      ESGOTADO
                    </span>
                  ) : (
                    <button className="mt-3 w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-900 transition">
                      <Link
                        to={`/produto/${produto.id}`}
                        className="block w-full h-full"
                      >
                        Comprar
                      </Link>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
