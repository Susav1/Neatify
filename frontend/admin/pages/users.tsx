// /frontend/admin/pages/users.tsx
import React, { useEffect, useState } from "react";
import { getUsers } from "../api/adminApi";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

interface User {
  _id: string;
  name: string;
  email: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getUsers();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <div className="p-6">
          <h2 className="text-xl font-semibold">Manage Users</h2>
          <table className="min-w-full mt-4 table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2">User Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">
                    <button className="bg-blue-500 text-white px-3 py-1 rounded">View</button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded ml-2">Block</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
