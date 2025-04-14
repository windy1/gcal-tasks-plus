import React, { useEffect, useState } from "react";
import { Auth } from "@/services";
import { useGoogleLoginWithStorage } from "@/hooks";
import { AuthContext } from "@/contexts/auth";

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isAuthenticated, setAuthenticated] = useState<boolean>(Auth.isAuthenticated());

    const login = useGoogleLoginWithStorage((token, expiresIn) => {
        Auth.setToken(token, expiresIn);
        setAuthenticated(true);
    });

    const signOut = () => {
        Auth.clearToken();
        setAuthenticated(false);
    };

    useEffect(() => {
        Auth.checkToken();
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
