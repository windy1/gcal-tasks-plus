import { useEffect, useState } from "react";
import { AuthStorage } from "@/services";
import { useGoogleLoginWithStorage } from "@/hooks";
import { AuthContext } from "@/contexts";
import { WithChildren } from "@/types";

const AuthCheckIntervalMs = 30000;

/**
 * Authentication provider for the application. This provider manages the authentication state and provides methods for
 * logging in and logging out.
 *
 * @param props - The props for the provider.
 * @returns JSX.Element - The AuthProvider component.
 */
export const AuthProvider = ({ children }: WithChildren) => {
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
        const checkAuth = () => {
            if (!AuthStorage.checkToken()) {
                signOut();
            }
        };

        const interval = setInterval(checkAuth, AuthCheckIntervalMs);

        return () => clearInterval(interval);
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
