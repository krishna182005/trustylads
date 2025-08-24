import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  actualTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'system',
  storageKey = 'trustylads-theme',
}) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Get theme from localStorage or use default
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey) as Theme;
      return stored || defaultTheme;
    }
    return defaultTheme;
  });

  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');

  // Function to get system theme preference
  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  };

  // Update actual theme based on theme setting
  useEffect(() => {
    const updateActualTheme = () => {
      if (theme === 'system') {
        setActualTheme(getSystemTheme());
      } else {
        setActualTheme(theme);
      }
    };

    updateActualTheme();

    // Listen for system theme changes
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => updateActualTheme();
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove previous theme classes
    root.classList.remove('light', 'dark');
    
    // Add current theme class
    root.classList.add(actualTheme);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        actualTheme === 'dark' ? '#000000' : '#ffffff'
      );
    }
  }, [actualTheme]);

  // Set theme and persist to localStorage
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, newTheme);
    }
  };

  // Toggle between light and dark (ignores system)
  const toggleTheme = () => {
    if (theme === 'system') {
      // If currently system, toggle to opposite of current system preference
      const systemTheme = getSystemTheme();
      setTheme(systemTheme === 'dark' ? 'light' : 'dark');
    } else {
      // Toggle between light and dark
      setTheme(theme === 'light' ? 'dark' : 'light');
    }
  };

  const value: ThemeContextType = {
    theme,
    actualTheme,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook to use theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

// Hook for theme-aware styling
export const useThemeStyles = () => {
  const { actualTheme } = useTheme();
  
  const getThemeClasses = (lightClasses: string, darkClasses: string) => {
    return actualTheme === 'dark' ? darkClasses : lightClasses;
  };
  
  const isDark = actualTheme === 'dark';
  const isLight = actualTheme === 'light';
  
  return {
    isDark,
    isLight,
    getThemeClasses,
    theme: actualTheme,
  };
};

// Component for theme-aware conditional rendering
interface ThemeAwareProps {
  light?: React.ReactNode;
  dark?: React.ReactNode;
  children?: (theme: 'light' | 'dark') => React.ReactNode;
}

export const ThemeAware: React.FC<ThemeAwareProps> = ({ light, dark, children }) => {
  const { actualTheme } = useTheme();
  
  if (children) {
    return <>{children(actualTheme)}</>;
  }
  
  return <>{actualTheme === 'dark' ? dark : light}</>;
};

// Theme toggle button component
interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  className = '', 
  size = 'md' 
}) => {
  const { actualTheme, setTheme } = useTheme();
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };
  
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };
  
  return (
    <button
      onClick={() => setTheme(actualTheme === 'dark' ? 'light' : 'dark')}
      className={`
        ${sizeClasses[size]} 
        rounded-lg border border-gray-300 dark:border-gray-600
        bg-white dark:bg-gray-800 
        text-gray-900 dark:text-gray-100
        hover:bg-gray-100 dark:hover:bg-gray-700
        transition-colors duration-200
        flex items-center justify-center
        ${className}
      `}
      title={`Switch to ${actualTheme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {actualTheme === 'dark' ? (
        // Sun icon for light mode
        <svg className={iconSizes[size]} fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        // Moon icon for dark mode
        <svg className={iconSizes[size]} fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </button>
  );
};

export default ThemeContext;