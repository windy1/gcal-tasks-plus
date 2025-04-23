/**
 * Returns true if the application is running in debug mode, false otherwise.
 *
 * @returns True if in debug mode, false otherwise.
 */
export const isDebugMode = () => import.meta.env.VITE_DEBUG_MODE === "true";
