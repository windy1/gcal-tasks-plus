import React, { useEffect, useState } from "react";
import { AuthStorage } from "@/services";
import { useGoogleLoginWithStorage } from "@/hooks";
import { AuthContext } from "@/contexts";

interface AuthProviderProps {
    children: React.ReactNode;
}

/**
 * Authentication provider for the application. This provider manages the authentication state and provides methods for
 * logging in and logging out.
 *
 * @param props - The props for the provider.
 * @returns JSX.Element - The AuthProvider component.
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isAuthenticated, setAuthenticated] = useState<boolean>(AuthStorage.isAuthenticated());

    const login = useGoogleLoginWithStorage((token, expiresIn) => {
        AuthStorage.setToken(token, expiresIn);
        setAuthenticated(true);
    });

    const signOut = () => {
        AuthStorage.clearToken();
        setAuthenticated(false);
    };

    useEffect(() => {
        AuthStorage.checkToken();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                login,
                signOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
