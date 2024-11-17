import React, { useContext } from 'react';
import { AuthContext } from '../../App.js';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, handleLogout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>Xeno CRM</h1>
      </div>
      <div className="navbar-user">
        {user && (
          <>
            <img src={user.picture} alt={user.name} className="user-avatar" />
            <span className="user-name">{user.name}</span>
            <button 
              onClick={handleLogout} 
              className="logout-button"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;