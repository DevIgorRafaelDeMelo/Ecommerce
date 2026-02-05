import React, { useEffect, useState } from "react";
import { db, storage } from "../../firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaCube,
  FaSpinner,
  FaSave,
} from "react-icons/fa";

export default function ListaProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensagem, setMensagem] = useState("");
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [mostrarInativos, setMostrarInativos] = useState(false);
  const [mostrarEdicao, setMostrarEdicao] = useState(false);
  const [novaImagem, setNovaImagem] = useState(null);
  const [isOpen1, setIsOpen1] = useState(false);
  const [nome, setNome] = useState("");
  const [valorVenda, setValorVenda] = useState("");
  const [quantidadeFardo, setQuantidadeFardo] = useState("");
  const [imagem, setImagem] = useState(null);
  const [itens, setItens] = useState([]);
  const [tipoBebida, setTipoBebida] = useState("");
  const [loadingSave, setLoadingSave] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "itens"), (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProdutos(lista);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleEditar = async (id, dadosAtualizados, novaImagem) => {
    try {
      let imagemUrl = dadosAtualizados.imagemUrl;

      if (novaImagem) {
        const storageRef = ref(storage, `imagens/${novaImagem.name}`);
        await uploadBytes(storageRef, novaImagem);
        imagemUrl = await getDownloadURL(storageRef);
      }

      const produtoRef = doc(db, "itens", id);
      await updateDoc(produtoRef, {
        nome: dadosAtualizados.nome,
        valorVenda: parseFloat(dadosAtualizados.valorVenda).toFixed(2),
        quantidadeFardo: dadosAtualizados.quantidadeFardo,
        tipoBebida: dadosAtualizados.tipoBebida,
        imagemUrl,
        atualizadoEm: new Date(),
      });

      setMensagem("Produto atualizado com sucesso!");
      setMostrarEdicao(false);
    } catch (error) {
      console.error("Erro ao editar produto:", error);
      setMensagem("Erro ao editar produto.");
    }
  };

  const handleInativar = async (id) => {
    try {
      const produtoRef = doc(db, "itens", id);
      await updateDoc(produtoRef, {
        ativo: false,
        atualizadoEm: new Date(),
      });

      setMensagem("Produto marcado como inativo!");
    } catch (error) {
      console.error("Erro ao inativar produto:", error);
      setMensagem("Erro ao inativar produto.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSave(true);

    if (!nome || !valorVenda || !quantidadeFardo || !imagem) {
      setMensagem("Preencha todos os campos e selecione uma imagem!");
      setLoadingSave(false);
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
      setIsOpen1(false);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      setMensagem("Erro ao salvar item!");
      setLoadingSave(false);
      setIsOpen1(false);
    }
  };

  const produtosFiltrados = mostrarInativos
    ? produtos
    : produtos.filter((p) => p.ativo);

  useEffect(() => {
    if (mensagem) {
      const timer = setTimeout(() => {
        setMensagem(""); // limpa a mensagem após 3 segundos
      }, 3000);

      return () => clearTimeout(timer); // limpa o timer se o componente desmontar
    }
  }, [mensagem]);

  if (loading) {
    return <p className="text-center">Carregando...</p>;
  }

  return (
    <div className="mt-20 w-full px-6 py-8 ">
      <h2 className="text-3xl font-extrabold mb-8 text-center text-blue-700 tracking-wide relative">
        Produtos Cadastrados
        <span className="block w-16 h-1 bg-blue-600 mx-auto mt-2 rounded-full"></span>
      </h2>

      <div className="fixed bottom-4 right-4">
        <button
          onClick={() => setIsOpen1(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition-transform hover:scale-105"
        >
          <FaPlus className="text-lg" /> Adicionar Item
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          checked={mostrarInativos}
          onChange={(e) => setMostrarInativos(e.target.checked)}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label className="text-gray-700 font-medium">
          Mostrar produtos inativos
        </label>
      </div>

      {produtos.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
          <span className="text-4xl text-gray-400 mb-2">📭</span>
          <p className="text-gray-600 font-medium">
            Nenhum produto cadastrado ainda.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          {produtosFiltrados.length === 0 ? (
            <div className="flex flex-col items-center justify-center bg-white  p-6 rounded-xl shadow-sm">
              <p className="text-gray-600 font-medium">
                Nenhum produto cadastrado ainda.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-xl shadow">
                <thead>
                  <tr className="bg-blue-600 text-white text-left">
                    <th className="px-4 py-3">Imagem</th>
                    <th className="px-4 py-3">Nome</th>
                    <th className="px-4 py-3">Valor</th>
                    <th className="px-4 py-3">Fardos</th>
                    <th className="px-4 py-3">Tipo</th>
                    <th className="px-4 py-3 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {produtosFiltrados.map((produto, index) => (
                    <tr
                      key={produto.id}
                      className={`${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-gray-100 transition`}
                    >
                      <td className="px-4 py-3">
                        {produto.imagemUrl ? (
                          <img
                            src={produto.imagemUrl}
                            alt={produto.nome}
                            className="h-16 w-16 object-cover rounded-lg border border-gray-200"
                          />
                        ) : (
                          <div className="h-16 w-16 flex items-center justify-center bg-gray-200 rounded-lg">
                            <span className="text-gray-400 text-sm">
                              Sem imagem
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        {produto.nome}
                        {!produto.ativo && (
                          <span className="ml-2 text-xs text-red-500 font-medium">
                            (Inativo)
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-green-600 font-medium">
                        R$ {produto.valorVenda}
                      </td>
                      <td className="px-4 py-3 text-blue-600 font-medium">
                        <FaCube /> {produto.quantidadeFardo}
                      </td>
                      <td className="px-4 py-3 text-blue-600 font-medium">
                        {produto.tipoBebida}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => {
                              setProdutoSelecionado(produto);
                              setMostrarEdicao(true);
                            }}
                            className="flex items-center gap-2 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition"
                          >
                            <FaEdit /> Editar
                          </button>
                          <button
                            onClick={() => {
                              setProdutoSelecionado(produto);
                              setMostrarConfirmacao(true);
                            }}
                            className="flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition"
                          >
                            <FaTrash /> Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {mostrarConfirmacao && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Confirmar exclusão
            </h3>

            {/* Dados do produto */}
            <div className="flex items-center gap-4 mb-6">
              {produtoSelecionado?.imagemUrl ? (
                <img
                  src={produtoSelecionado.imagemUrl}
                  alt={produtoSelecionado.nome}
                  className="h-16 w-16 object-cover rounded-lg border border-gray-200"
                />
              ) : (
                <div className="h-16 w-16 flex items-center justify-center bg-gray-200 rounded-lg">
                  <span className="text-gray-400 text-sm">Sem imagem</span>
                </div>
              )}

              <div className="space-y-1">
                <p className="font-semibold text-gray-900">
                  {produtoSelecionado?.nome}
                </p>
              </div>
            </div>

            <p className="text-gray-600 mb-6">
              Tem certeza que deseja excluir este produto?
            </p>

            {/* Botões de ação */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setMostrarConfirmacao(false)}
                className="px-4 py-2 rounded-lg bg-gray-300 text-gray-800 hover:bg-gray-400 transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  handleInativar(produtoSelecionado.id);
                  setMostrarConfirmacao(false);
                }}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {mostrarEdicao && produtoSelecionado && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-[420px]">
            {/* Cabeçalho */}
            <h3 className="text-2xl font-bold text-blue-700 mb-6 flex items-center gap-2">
              <FaEdit /> Editar Produto
            </h3>

            {/* Formulário */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditar(
                  produtoSelecionado.id,
                  produtoSelecionado,
                  novaImagem,
                );
              }}
              className="space-y-5"
            >
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  value={produtoSelecionado.nome}
                  onChange={(e) =>
                    setProdutoSelecionado({
                      ...produtoSelecionado,
                      nome: e.target.value,
                    })
                  }
                  className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Valor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor de Venda (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={produtoSelecionado.valorVenda}
                  onChange={(e) =>
                    setProdutoSelecionado({
                      ...produtoSelecionado,
                      valorVenda: e.target.value,
                    })
                  }
                  className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Quantidade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantidade de Fardos
                </label>
                <input
                  type="number"
                  value={produtoSelecionado.quantidadeFardo}
                  onChange={(e) =>
                    setProdutoSelecionado({
                      ...produtoSelecionado,
                      quantidadeFardo: e.target.value,
                    })
                  }
                  className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Tipo da bebida */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo da Bebida
                </label>
                <select
                  value={produtoSelecionado.tipoBebida}
                  onChange={(e) =>
                    setProdutoSelecionado({
                      ...produtoSelecionado,
                      tipoBebida: e.target.value,
                    })
                  }
                  className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Selecione o tipo</option>
                  <option value="Cerveja">Cerveja</option>
                  <option value="Refrigerante">Refrigerante</option>
                  <option value="Suco">Suco</option>
                  <option value="Água">Água</option>
                </select>
              </div>

              {/* Upload nova imagem */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Imagem do Produto
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNovaImagem(e.target.files[0])}
                  className="w-full"
                />

                {/* Pré-visualização */}
                {(novaImagem || produtoSelecionado.imagemUrl) && (
                  <div className="mt-3 flex justify-center">
                    <img
                      src={
                        novaImagem
                          ? URL.createObjectURL(novaImagem)
                          : produtoSelecionado.imagemUrl
                      }
                      alt="Pré-visualização"
                      className="h-24 w-24 object-cover rounded-lg border border-gray-300 shadow"
                    />
                  </div>
                )}
              </div>

              {/* Botões */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setMostrarEdicao(false)}
                  className="px-4 py-2 rounded-lg bg-gray-300 text-gray-800 hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isOpen1 && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-[420px]">
            {/* Cabeçalho do modal */}
            <h3 className="text-2xl font-bold text-blue-700 mb-6 flex items-center gap-2">
              <FaPlus /> Cadastro de Produto
            </h3>

            {/* Formulário de cadastro */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Nome */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Nome do Produto
                </label>
                <input
                  type="text"
                  placeholder="Digite o nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Valor */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Valor de Venda (R$)
                </label>
                <input
                  type="number"
                  placeholder="Digite o valor"
                  value={valorVenda}
                  onChange={(e) => setValorVenda(e.target.value)}
                  className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Quantidade */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Quantidade de Fardos
                </label>
                <input
                  type="number"
                  placeholder="Digite a quantidade"
                  value={quantidadeFardo}
                  onChange={(e) => setQuantidadeFardo(e.target.value)}
                  className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Tipo da bebida */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Tipo da Bebida
                </label>
                <select
                  value={tipoBebida}
                  onChange={(e) => setTipoBebida(e.target.value)}
                  className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Selecione o tipo</option>
                  <option value="Cerveja">Cerveja</option>
                  <option value="Refrigerante">Refrigerante</option>
                  <option value="Suco">Suco</option>
                  <option value="Água">Água</option>
                </select>
              </div>

              <label className="block text-sm font-medium text-gray-700">
                Imagem do Produto
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImagem(e.target.files[0])}
                className="block w-full text-sm text-gray-700 
               file:mr-4 file:py-2 file:px-4
               file:rounded-lg file:border-0
               file:text-sm file:font-semibold
               file:bg-blue-600 file:text-white
               hover:file:bg-blue-700 cursor-pointer"
              />

              {/* Pré-visualização da imagem */}
              {imagem && (
                <div className="mt-3 flex justify-center">
                  <img
                    src={URL.createObjectURL(imagem)}
                    alt="Pré-visualização"
                    className="h-24 w-24 object-cover rounded-lg border border-gray-300 shadow"
                  />
                </div>
              )}

              {/* Botões */}
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen1(false)}
                  className="px-4 py-2 rounded-lg bg-gray-300 text-gray-800 hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>
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
      )}

      {mensagem && (
        <div
          className={`fixed top-20 right-10 px-4 py-3 rounded-lg shadow-lg text-sm font-medium transition-opacity duration-500 z-100 ${
            mensagem.toLowerCase().includes("sucesso")
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {mensagem}
        </div>
      )}
    </div>
  );
}
