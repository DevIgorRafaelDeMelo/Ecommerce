import React from "react";
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/5511999999999" // coloque seu número aqui
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 flex items-center gap-2 px-6 py-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-lg shadow-blue-500/40 transition transform hover:scale-105 z-50"
    >
      <FaWhatsapp className="text-2xl" />
      Fale Conosco
    </a>
  );
}
