import React, { useEffect, useState } from 'react';
import './styles/CustomerList.css'

const CustomerList = () => {
  const [mounted, setMounted] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setCount(prev => (prev + 1) % 4);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="coming-soon-page">
      <div className={`content-container ${mounted ? 'mounted' : ''}`}>
        <h1 className="main-heading">
          Coming Soon
        </h1>
        <div className="subheading">
          Something amazing is brewing
          <span className="dot-animation">
            {'.'.repeat(count + 1)}
          </span>
        </div>
        <div className="features-container">
          {[
            'Innovative Features',
            'Beautiful Design',
            'Amazing Experience'
          ].map((text, index) => (
            <div
              key={text}
              className={`feature-item ${mounted ? 'mounted' : ''}`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <span className="feature-tag">
                {text}
              </span>
            </div>
          ))}
        </div>
        <div className={`newsletter-container ${mounted ? 'mounted' : ''}`}>
          <div className="form-container">
            <input
              type="email"
              placeholder="Enter your email"
              className="email-input"
            />
            <button className="notify-button">
              Notify Me
            </button>
          </div>
        </div>
      </div>
      <div className="background-decoration">
        <div className="decoration-circle decoration-circle-1"></div>
        <div className="decoration-circle decoration-circle-2"></div>
      </div>
    </div>
  );
};

export default CustomerList;