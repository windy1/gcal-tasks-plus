const AccessToken = "access_token";
const ExpiresAt = "expires_at";

/**
 * Type alias for the authentication token.
 */
export type AuthToken = string;

/**
 * Returns the token if it is not expired, otherwise clears it and returns null.
 *
 * @returns AuthToken | null - The token if it is valid, otherwise null.
 */
export const checkToken = (): AuthToken | null => {
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

/**
 * Clears the token and expiration time from local storage.
 */
export const clearToken = () => {
    localStorage.removeItem(AccessToken);
    localStorage.removeItem(ExpiresAt);
};

/**
 * Retrieves the token from local storage.
 *
 * @returns string | null - The token if it exists, otherwise null.
 */
export const getToken = (): AuthToken | null => localStorage.getItem(AccessToken);

/**
 * Sets the token and its expiration time in local storage.
 *
 * @param token - The token to be set.
 * @param expiresIn - The expiration time in seconds.
 */
export const setToken = (token: AuthToken, expiresIn: number) => {
    const expiresAt = Date.now() + expiresIn * 1000;
    localStorage.setItem(AccessToken, token);
    localStorage.setItem(ExpiresAt, expiresAt.toString());
};

/**
 * Checks if the user is authenticated by verifying if a valid token exists.
 *
 * @returns boolean - True if authenticated, otherwise false.
 */
export const isAuthenticated = (): boolean => !!getToken();
