import React from "react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center">
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>

        {/* Texto */}
        <p className="mt-4 text-blue-600 font-semibold text-lg">
          Carregando...
        </p>
      </div>
    </div>
  );
}
