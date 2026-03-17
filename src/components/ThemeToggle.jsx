import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      onClick={toggleTheme}
      className="glass-panel"
      style={{
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        padding: 0,
        position: 'relative',
        transition: 'all 0.3s ease',
        background: 'var(--border-glass)',
        overflow: 'hidden'
      }}
      aria-label="Toggle Theme"
    >
      <div style={{
        position: 'absolute',
        transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: theme === 'dark' ? 'translateY(0)' : 'translateY(40px)',
        color: 'var(--primary)'
      }}>
        <Moon size={22} fill="currentColor" />
      </div>
      <div style={{
        position: 'absolute',
        transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: theme === 'light' ? 'translateY(0)' : 'translateY(-40px)',
        color: 'var(--warning)'
      }}>
        <Sun size={22} fill="currentColor" />
      </div>
    </button>
  );
};

export default ThemeToggle;
