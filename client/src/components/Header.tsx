import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

interface HeaderProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated, onLogout }) => {
  return (
    <header className="header">
      <div className="container header-content">
        <Link to="/" className="logo">
          <h1>Race Runner</h1>
        </Link>
        <nav className="nav">
          <ul>
            <li>
              <Link to="/results">Results</Link>
            </li>
            {isAuthenticated ? (
              <>
                <li>
                  <Link to="/admin/dashboard">Dashboard</Link>
                </li>
                <li>
                  <Link to="/admin/categories">Categories</Link>
                </li>
                <li>
                  <Link to="/admin/runners">Runners</Link>
                </li>
                <li>
                  <Link to="/admin/tags">NFC Tags</Link>
                </li>
                <li>
                  <Link to="/admin/nfc-logs">NFC Logs</Link>
                </li>
                <li>
                  <button onClick={onLogout} className="btn-logout">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login" className="btn-login">
                  Admin Login
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;

