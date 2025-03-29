import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ServiceList from '../components/ServiceList';
import ServiceApproval from '../components/ServiceApproval';
import UserList from '../components/UserList';
import ProtectedRoute from '../components/ProtectedRoute';
import Services from './services';
import Users from './users';

const AdminApp = () => {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Header />
          <Routes>
            <Route path="/admin" element={<ProtectedRoute element={<ServiceList />} />} />
            <Route path="/admin/services" element={<ProtectedRoute element={<Services />} />} />
            <Route path="/admin/users" element={<ProtectedRoute element={<Users />} />} />
            <Route path="*" element={<Navigate to="/admin" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default AdminApp;
