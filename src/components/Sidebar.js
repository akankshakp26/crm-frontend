import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <h2>CRM System</h2>
      <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/leads">Leads</Link></li>
        <li><Link to="/pipeline">Pipeline</Link></li>
        {/* Updated: Role 'employee' is now 'client' */}
        {(user?.role === "admin" || user?.role === "manager" || user?.role === "client") && (
          <li><Link to="/tasks">Tasks</Link></li>
        )}
        {(user?.role === "admin" || user?.role === "manager") && (
          <li><Link to="/clients">Clients</Link></li>
        )}
      </ul>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Sidebar;