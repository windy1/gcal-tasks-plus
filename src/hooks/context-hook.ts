import React, { Context } from "react";

export const useContext = <TContext>(context: Context<TContext>) => {
    const ctx = React.useContext(context);

    if (!ctx) {
        throw new Error("useContext must be used within a Provider");
    }

    return ctx;
};
