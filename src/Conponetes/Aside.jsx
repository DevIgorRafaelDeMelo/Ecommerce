import React from "react";
import { Link } from "react-router-dom";

export default function Aside() {
  return (
    <aside className="w-64 h-screen bg-gradient-to-b from-blue-600 to-blue-800 text-white shadow-lg fixed left-0 top-0 pt-24">
      <h2 className="text-xl font-bold mb-6 px-4 border-b border-blue-400 pb-2">
        Menu
      </h2>
      <nav className="space-y-2 px-2">
        <Link
          to="/admin/cadastro"
          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors font-medium"
        >
          Produtos
        </Link>
      </nav>
    </aside>
  );
}
