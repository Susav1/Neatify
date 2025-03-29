// /frontend/admin/components/Header.tsx
import React from "react";

const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button className="bg-red-500 py-2 px-4 rounded">Logout</button>
      </div>
    </header>
  );
};

export default Header;
