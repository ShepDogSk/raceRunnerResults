import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {currentYear} Race Runner Management System. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

