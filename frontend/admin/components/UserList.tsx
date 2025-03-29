// /frontend/admin/components/UserList.tsx
import React, { useEffect, useState } from "react";
import { getUsers } from "../api/adminApi";

interface User {
  _id: string;
  name: string;
  email: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getUsers();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold">User List</h2>
      <table className="min-w-full mt-4 table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">User Name</th>
            <th className="px-4 py-2">Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td className="px-4 py-2">{user.name}</td>
              <td className="px-4 py-2">{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
