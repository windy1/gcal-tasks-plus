import { Action } from "@/types";
import { createContext } from "react";

interface AuthContextType {
    /**
     * The authentication state of the user.
     */
    isAuthenticated: boolean;
    /**
     * The function to log in the user.
     */
    login: Action;
    /**
     * The function to log out the user.
     */
    signOut: Action;
}

/**
 * Authentication context for the application. This context provides the authentication state and methods for
 * logging in and logging out.
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
