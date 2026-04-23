import { useCallback, useState } from "react";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      // Aquí iría la lógica de login
      setIsAuthenticated(true);
      setUser({ email });
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  return { isAuthenticated, user, loading, login, logout };
};
