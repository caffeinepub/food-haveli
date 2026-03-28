import { createContext, useContext, useState } from "react";

export type Role = null | "owner" | "restaurant" | "customer";

interface AuthContextValue {
  role: Role;
  login: (role: NonNullable<Role>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>(null);

  const login = (r: NonNullable<Role>) => setRole(r);
  const logout = () => setRole(null);

  return (
    <AuthContext.Provider value={{ role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
