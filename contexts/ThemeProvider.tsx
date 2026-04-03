import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

type Theme = "light" | "dark";

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: "light",
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  const toggleTheme = () => {
    console.log("toggleTheme called");
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const colorScheme = useColorScheme();
    
    useEffect(() => {
      
      if(colorScheme && theme !== colorScheme){
        
        toggleTheme();
      }
    }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
