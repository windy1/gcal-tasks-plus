export const handleTokenExpiration = (setToken: (token: string) => void) => {
    const storedToken = localStorage.getItem("access_token");
    const expiresAtStr = localStorage.getItem("expires_at");

    if (storedToken && expiresAtStr) {
        const expiresAt = parseInt(expiresAtStr, 10);
        if (Date.now() < expiresAt) {
            setToken(storedToken);
        } else {
            localStorage.removeItem("access_token");
            localStorage.removeItem("expires_at");
        }
    }
};
