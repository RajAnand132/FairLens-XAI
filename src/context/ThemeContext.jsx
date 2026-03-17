import React, { createContext, useContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Detect system preference
  const getSystemTheme = () => 
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || getSystemTheme();
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    const root = window.document.documentElement;
    
    if (theme === 'dark') {
      root.classList.remove('light-theme');
    } else {
      root.classList.add('light-theme');
    }
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
