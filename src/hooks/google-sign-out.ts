import { Auth } from "@/constants";

export const handleGoogleSignOut = (setToken: (token: string | null) => void) => {
    setToken(null);
    localStorage.removeItem(Auth.AccessToken);
    localStorage.removeItem(Auth.ExpiresAt);
};
