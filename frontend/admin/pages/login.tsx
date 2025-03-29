import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('/api/admin/login', { password }); // Replace with your backend URL
      localStorage.setItem("adminToken", response.data.token);
      navigate('/admin');
    } catch (error) {
      alert('Login failed');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl mb-4">Admin Login</h2>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter admin password"
          className="border p-2 w-full mb-4"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 w-full">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;
