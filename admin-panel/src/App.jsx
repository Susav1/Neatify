import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import HamburgerButton from "./components/hamburgerButton";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import UserManagement from "./components/UserManagement";
import Login from "./components/Login";
import CreateService from "./components/CreateService";
import CleanerManagement from "./components/CleanerManagement";
import CreateCategory from "./components/CreateCategory";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <div className="app">
        {isLoggedIn ? (
          <>
            <HamburgerButton isOpen={isSidebarOpen} toggle={toggleSidebar} />
            <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />
            <div className={`content ${isSidebarOpen ? "sidebar-open" : ""}`}>
              <Header />
              <div className="main-content">
                <Routes>
                  {/* <Route path="/dashboard" element={<Dashboard />} /> */}
                  <Route path="/user-management" element={<UserManagement />} />
                  <Route path="/create-service" element={<CreateService />} />

                  <Route
                    path="/cleaner-management"
                    element={<CleanerManagement />}
                  />
                  <Route path="/create-category" element={<CreateCategory />} />
                  {/* <Route path="/" element={<Navigate to="/dashboard" />} /> */}
                </Routes>
              </div>
            </div>
          </>
        ) : (
          <Routes>
            <Route
              path="/login"
              element={<Login setIsLoggedIn={setIsLoggedIn} />}
            />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </div>
    </Router>
  );
};

export default App;
