import { Auth } from "@/services";
import { useGoogleLogin } from "@react-oauth/google";

const Scope = "https://www.googleapis.com/auth/tasks";
const Flow = "implicit";

export const useGoogleLoginWithStorage = () =>
    useGoogleLogin({
        scope: Scope,
        flow: Flow,
        onSuccess: (response) => Auth.setToken(response.access_token, response.expires_in),
    });
