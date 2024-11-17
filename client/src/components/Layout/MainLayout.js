import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import '../styles/MainLayout.css';

const MainLayout = ({ children }) => {
  return (
    <div className="main-layout">
      <Navbar />
      <div className="content-wrapper">
        <Sidebar />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;