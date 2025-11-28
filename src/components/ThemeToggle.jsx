import { useState, useEffect } from 'react';
import { MdLightMode, MdDarkMode } from 'react-icons/md';

export function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('theme');
    console.log('ThemeToggle initial state from localStorage:', stored);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    
    console.log('ThemeToggle useEffect - Current theme:', theme);
    console.log('HTML classList before:', root.classList.toString());
    
    if (theme === 'dark') {
      root.classList.add('dark');
      console.log('✅ Dark mode enabled');
    } else {
      root.classList.remove('dark');
      console.log('✅ Light mode enabled');
    }
    
    console.log('HTML classList after:', root.classList.toString());
    
    localStorage.setItem('theme', theme);
    console.log('Theme saved to localStorage:', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      const newTheme = prev === 'dark' ? 'light' : 'dark';
      console.log('🔄 Toggling theme from', prev, 'to', newTheme);
      return newTheme;
    });
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-6 right-6 p-3 rounded-full bg-white dark:bg-slate-800 border-2 border-gray-300 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all duration-200 shadow-lg hover:shadow-xl z-[9999]"
      aria-label="Alternar tema"
      style={{ zIndex: 9999 }}
      title={`Mudar para modo ${theme === 'dark' ? 'claro' : 'escuro'}`}
    >
      {theme === 'dark' ? (
        <MdLightMode className="w-6 h-6 text-yellow-400" />
      ) : (
        <MdDarkMode className="w-6 h-6 text-gray-700" />
      )}
    </button>
  );
}
