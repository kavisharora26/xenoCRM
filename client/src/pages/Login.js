import React from 'react';
import './styles/Login.css';
import gLogo from "../images/Google__logo.svg";

const Login = () => {
  const handleGoogleLogin = () => {
    window.location.href = 'https://crm-gc6q.onrender.com/auth/google';
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Welcome to Xeno CRM</h1>
        <p>Please sign in to continue</p>
        <button onClick={handleGoogleLogin} className="google-login-button">
          <img 
            src={gLogo} 
            alt="Google Logo" 
          />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;