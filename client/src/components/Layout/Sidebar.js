import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <NavLink to="/dashboard" className="sidebar-item">
        Dashboard
      </NavLink>
      <NavLink to="/segments" className="sidebar-item">
        Segments
      </NavLink>
      <NavLink to="/campaigns" className="sidebar-item">
        Campaigns
      </NavLink>
      <NavLink to="/customers" className="sidebar-item">
        Customers
      </NavLink>
    </div>
  );
};

export default Sidebar;