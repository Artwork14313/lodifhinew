import React from "react";
import { NavLink } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">Oops! Page not found.</p>
      <NavLink
        to="/"
        className="bg-[#337CCF] text-white px-6 py-3 rounded hover:bg-blue-700 transition"
      >
        Go Home
      </NavLink>
    </div>
  );
}

export default NotFound;
