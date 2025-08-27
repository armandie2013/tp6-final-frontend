import { createContext, useContext, useMemo, useState } from "react";
import { api } from "../lib/api";
import { parseJwt } from "../utils/jwt";

const AuthCtx = createContext();
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Decodificar el JWT para extraer claims (ej: role, sub)
  const claims = useMemo(() => (token ? parseJwt(token) : null), [token]);
  const role = claims?.role || null;

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    setToken(data.token);
  };

  const register = async (email, password) => {
    await api.post("/auth/register", { email, password });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("profileId");
    setToken(null);
  };

  return (
    <AuthCtx.Provider
      value={{
        token,
        isAuth: !!token,
        role,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
}