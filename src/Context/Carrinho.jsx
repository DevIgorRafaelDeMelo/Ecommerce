import React, { createContext, useState, useEffect } from "react";

export const CarrinhoContext = createContext();

export function CarrinhoProvider({ children }) {
  const [itensCarrinho, setItensCarrinho] = useState(() => {
    const saved = localStorage.getItem("carrinho");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("carrinho", JSON.stringify(itensCarrinho));
  }, [itensCarrinho]);

  const adicionarAoCarrinho = (produto, quantidade) => {
    setItensCarrinho((prev) => {
      const existente = prev.find((i) => i.id === produto.id);
      if (existente) {
        return prev.map((i) =>
          i.id === produto.id
            ? {
                ...i,
                quantidade: i.quantidade + quantidade,
                valorTotal: i.valorUnitario * (i.quantidade + quantidade),
              }
            : i,
        );
      }
      return [
        ...prev,
        {
          id: produto.id,
          nome: produto.nome,
          quantidade,
          valorUnitario: produto.valorVenda,
          valorTotal: produto.valorVenda * quantidade,
          imagemUrl: produto.imagemUrl || "",
        },
      ];
    });
  };

  const atualizarQuantidade = (id, novaQtd) => {
    if (novaQtd < 1) return;
    setItensCarrinho((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantidade: novaQtd,
              valorTotal: item.valorUnitario * novaQtd,
            }
          : item,
      ),
    );
  };

  const removerItem = (id) => {
    setItensCarrinho((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <CarrinhoContext.Provider
      value={{
        itensCarrinho,
        adicionarAoCarrinho,
        atualizarQuantidade,
        removerItem,
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
}
