import { useGoogleLogin } from "@react-oauth/google";

const Scope = "https://www.googleapis.com/auth/tasks";
const Flow = "implicit";

/**
 * Returns a Google login function that sets the token in local storage.
 *
 * @param setToken - A function to set the token and its expiration time in local storage.
 * @returns A function to initiate the Google login process.
 */
export const useGoogleLoginWithStorage = (setToken: (token: string, expiresIn: number) => void) =>
    useGoogleLogin({
        scope: Scope,
        flow: Flow,
        onSuccess: (response) => setToken(response.access_token, response.expires_in),
    });
