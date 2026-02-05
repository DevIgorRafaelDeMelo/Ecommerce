import React from "react";
import { FaArrowLeft } from "react-icons/fa";

export default function Modal({ isOpen, onClose, children, title }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 relative text-center">
        {/* Botão fechar */}
        <button
          onClick={onClose}
          className="absolute top-40 left-40 flex items-center gap-2 text-blue-600 hover:text-blue-800 transition font-semibold"
        >
          <FaArrowLeft /> Voltar
        </button>

        {/* Título opcional */}
        {title && (
          <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
            {title}
          </h2>
        )}

        {/* Conteúdo do modal */}
        {children}
      </div>
    </div>
  );
}
