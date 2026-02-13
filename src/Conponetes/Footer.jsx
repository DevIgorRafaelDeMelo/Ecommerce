import React from "react";

export default function Footer() {
  return (
    <footer className="  bg-gray-800 text-white mt-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 py-10 px-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Sobre Nós</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Somos especialistas em bebidas alcoólicas premium. Qualidade,
            tradição e sofisticação para todos os momentos.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Categorias</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>
              <a href="/whisky" className="hover:text-red-500 transition">
                Whisky
              </a>
            </li>
            <li>
              <a href="/vodka" className="hover:text-red-500 transition">
                Vodka
              </a>
            </li>
            <li>
              <a href="/cerveja" className="hover:text-red-500 transition">
                Cerveja
              </a>
            </li>
            <li>
              <a href="/vinho" className="hover:text-red-500 transition">
                Vinho
              </a>
            </li>
            <li>
              <a href="/gin" className="hover:text-red-500 transition">
                Gin
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Contato</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li> Rua das Bebidas, 123 - Porto Alegre/RS</li>
            <li> (51) 99999-9999</li>
            <li> contato@voidworks.com</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} VoidWorks - Todos os direitos reservados.
      </div>
    </footer>
  );
}
