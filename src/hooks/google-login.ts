import { useGoogleLogin } from "@react-oauth/google";
import { Auth } from "@/constants";

const Scope = "https://www.googleapis.com/auth/tasks.readonly";
const Flow = "implicit";

export const useGoogleLoginWithStorage = (setToken: (token: string) => void) =>
    useGoogleLogin({
        scope: Scope,
        flow: Flow,
        onSuccess: (response) => {
            const expiresAt = Date.now() + response.expires_in * 1000;
            localStorage.setItem(Auth.AccessToken, response.access_token);
            localStorage.setItem(Auth.ExpiresAt, expiresAt.toString());
            setToken(response.access_token);
        },
    });
