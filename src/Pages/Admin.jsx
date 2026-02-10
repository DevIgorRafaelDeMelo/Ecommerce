import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Aside from "../Conponetes/Aside.jsx";
import Header from "../Conponetes/Header.jsx";
import ListaProdutos from "./ListaProdutos.jsx";

const loginUser = import.meta.env.VITE_LOGIN_USER;
const loginPass = import.meta.env.VITE_LOGIN_PASS;

export default function Admin() {
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (user === loginUser && pass === loginPass) {
      setIsAuth(true);
    } else {
      alert("Usuário ou senha inválidos!");
    }
  };

  return (
    <>
      {isAuth ? (
        <div className="flex ">
          <Aside />
          <main className="flex-1  ">
            <Routes>
              <Route path="cadastro" element={<ListaProdutos />} />
            </Routes>
          </main>
        </div>
      ) : (
        <div className="flex items-center justify-center h-screen ">
          <form
            onSubmit={handleLogin}
            className="bg-white p-6 rounded shadow-md w-80 space-y-4"
          >
            <h2 className="text-xl font-bold text-center">Login</h2>
            <input
              type="text"
              placeholder="Usuário"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
            <input
              type="password"
              placeholder="Senha"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Entrar
            </button>
          </form>
        </div>
      )}
    </>
  );
}
