import { useGoogleLogin } from "@react-oauth/google";

const Scope = "https://www.googleapis.com/auth/tasks";
const Flow = "implicit";

export const useGoogleLoginWithStorage = (setToken: (token: string, expiresIn: number) => void) =>
    useGoogleLogin({
        scope: Scope,
        flow: Flow,
        onSuccess: (response) => setToken(response.access_token, response.expires_in),
    });
