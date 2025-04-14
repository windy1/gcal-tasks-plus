const AccessToken = "access_token";
const ExpiresAt = "expires_at";

export const checkToken = (): string | null => {
    const storedToken = getToken();
    const expiresAtStr = localStorage.getItem(ExpiresAt);

    if (storedToken && expiresAtStr) {
        const expiresAt = parseInt(expiresAtStr, 10);

        if (Date.now() < expiresAt) {
            return storedToken;
        }

        clearToken();
    }

    return null;
};

export const clearToken = () => {
    localStorage.removeItem(AccessToken);
    localStorage.removeItem(ExpiresAt);
};

export const getToken = (): string | null => localStorage.getItem(AccessToken);

export const setToken = (token: string, expiresIn: number) => {
    const expiresAt = Date.now() + expiresIn * 1000;
    localStorage.setItem(AccessToken, token);
    localStorage.setItem(ExpiresAt, expiresAt.toString());
};
