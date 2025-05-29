import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import type { Theme } from '../types';
import './Navigation.css';

const Navigation: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Check-in Table' },
    { path: '/form', label: 'Check-in Form' },
    { path: '/dashboard', label: 'Dashboard' }
  ];

  const themes: { value: Theme; label: string }[] = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'blue', label: 'Blue' }
  ];

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/">Check-in App</Link>
        </div>
        
        <button 
          className="nav-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`nav-menu ${isMenuOpen ? 'nav-menu-open' : ''}`}>
          <ul className="nav-links">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path}
                  className={location.pathname === item.path ? 'active' : ''}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          
          <div className="theme-selector">
            <label htmlFor="theme-select">Theme:</label>
            <select 
              id="theme-select"
              value={theme} 
              onChange={(e) => setTheme(e.target.value as Theme)}
            >
              {themes.map((themeOption) => (
                <option key={themeOption.value} value={themeOption.value}>
                  {themeOption.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 