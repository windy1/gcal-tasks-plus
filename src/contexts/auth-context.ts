import { createContext } from "react";

interface AuthContextType {
    isAuthenticated: boolean;
    login: () => void;
    signOut: () => void;
}

/**
 * Authentication context for the application. This context provides the authentication state and methods for
 * logging in and logging out.
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
