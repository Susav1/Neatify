// /frontend/admin/components/Sidebar.tsx
import React from "react";
import { Link } from "react-router-dom";

const Sidebar: React.FC = () => {
  return (
    <nav className="bg-gray-800 text-white w-64 p-4">
      <ul>
        <li>
          <Link to="/admin" className="block py-2 px-4 hover:bg-gray-700">Dashboard</Link>
        </li>
        <li>
          <Link to="/admin/services" className="block py-2 px-4 hover:bg-gray-700">Manage Services</Link>
        </li>
        <li>
          <Link to="/admin/users" className="block py-2 px-4 hover:bg-gray-700">Manage Users</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
