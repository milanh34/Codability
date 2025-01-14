import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeSelector = () => {
  const { theme, currentTheme, setCurrentTheme } = useTheme();

  const toggleTheme = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setCurrentTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <button
      className="nav-button"
      onClick={toggleTheme}
      title={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} theme`}
      style={{
        backgroundColor: theme?.buttons?.primary?.bg || '#ccccff',
        color: theme?.buttons?.primary?.text || '#000000',
      }}
      onMouseOver={(e) =>
        (e.currentTarget.style.backgroundColor =
          theme?.buttons?.primary?.hoverBg || '#9999ff')
      }
      onMouseOut={(e) =>
        (e.currentTarget.style.backgroundColor =
          theme?.buttons?.primary?.bg || '#ccccff')
      }
    >
      {currentTheme === 'light' ? (
        <Moon className="icon" />
      ) : (
        <Sun className="icon" />
      )}
    </button>
  );
};

export default ThemeSelector;
