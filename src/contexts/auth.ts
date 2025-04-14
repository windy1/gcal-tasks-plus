import { createContext } from "react";

interface AuthContextType {
    isAuthenticated: boolean;
    login: () => void;
    signOut: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
