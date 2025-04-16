import React, { Context } from "react";

/**
 * Helper hook to use a context. This hook will throw an error if the context is not provided.
 *
 * @param context - The context to use.
 * @returns Context value of the provided context.
 * @throws Error if the context is not provided.
 */
export const useContext = <TContext>(context: Context<TContext>) => {
    const ctx = React.useContext(context);

    if (!ctx) {
        throw new Error("useContext must be used within a Provider");
    }

    return ctx;
};
