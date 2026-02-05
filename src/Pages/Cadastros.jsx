import React, { useState, useEffect } from "react";
import { db, storage } from "../../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Loading from "../Conponetes/Loading";
import { FaSave, FaSpinner } from "react-icons/fa";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [valorVenda, setValorVenda] = useState("");
  const [quantidadeFardo, setQuantidadeFardo] = useState("");
  const [imagem, setImagem] = useState(null);
  const [itens, setItens] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(true);
  const [tipoBebida, setTipoBebida] = useState("");
  const [loadingSave, setLoadingSave] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSave(true);

    if (!nome || !valorVenda || !quantidadeFardo || !imagem) {
      setMensagem("Preencha todos os campos e selecione uma imagem!");
      return;
    }

    try {
      const storageRef = ref(storage, `imagens/${imagem.name}`);
      await uploadBytes(storageRef, imagem);

      const url = await getDownloadURL(storageRef);

      const novoItem = {
        nome,
        tipoBebida,
        valorVenda: parseFloat(valorVenda).toFixed(2),
        quantidadeFardo,
        imagemUrl: url,
        criadoEm: new Date(),
        ativo: true,
      };

      await addDoc(collection(db, "itens"), novoItem);

      setItens([...itens, novoItem]);
      setMensagem("Item cadastrado com sucesso!");

      setNome("");
      setValorVenda("");
      setQuantidadeFardo("");
      setTipoBebida("");
      setImagem(null);
      setLoadingSave(false);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      setMensagem("Erro ao salvar item!");
      setLoadingSave(false);
    }
  };

  useEffect(() => {
    const carregarItens = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "itens"));
        const lista = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setItens(lista);
      } catch (error) {
        console.error("Erro ao carregar itens:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarItens();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen min-w-screen bg-gradient-to-br from-blue-50 via-gray-100 to-gray-200 px-6">
      {mensagem && (
        <div
          className={`fixed top-10 right-10 px-2 py-3 rounded-lg shadow-lg text-sm font-medium transition-opacity duration-500 ${
            mensagem.includes("sucesso")
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {mensagem}
        </div>
      )}
      <div className="w-full max-w-lg bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-10">
        <h1 className="text-3xl font-extrabold mb-8 text-center text-blue-700 flex items-center justify-center gap-2">
          Cadastro de Item
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nome do item
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite o nome"
              className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tipo de bebida
            </label>
            <select
              value={tipoBebida}
              onChange={(e) => setTipoBebida(e.target.value)}
              className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
            >
              <option value="">Selecione...</option>
              <option value="Cerveja"> Cerveja</option>
              <option value="Suco"> Suco</option>
              <option value="Cachaça"> Cachaça</option>
              <option value="Vodka"> Vodka</option>
              <option value="Outros"> Outros</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Valor de venda
            </label>
            <input
              type="number"
              value={valorVenda}
              onChange={(e) => setValorVenda(e.target.value)}
              placeholder="Digite o valor"
              className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Quantidade de fardos
            </label>
            <input
              type="number"
              value={quantidadeFardo}
              onChange={(e) => setQuantidadeFardo(e.target.value)}
              placeholder="Digite a quantidade"
              className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Imagem do produto
            </label>
            <input
              type="file"
              onChange={(e) => setImagem(e.target.files[0])}
              className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold shadow-md disabled:opacity-70"
            >
              {loadingSave ? (
                <>
                  <FaSpinner className="animate-spin" /> Gravando...
                </>
              ) : (
                <>
                  <FaSave /> Salvar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
