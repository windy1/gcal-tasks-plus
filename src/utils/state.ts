import { Dispatch, SetStateAction } from "react";

export const increment = (dispatch: Dispatch<SetStateAction<number>>) => () =>
    dispatch((prevCount) => prevCount + 1);

export const decrement = (dispatch: Dispatch<SetStateAction<number>>) => () =>
    dispatch((prevCount) => prevCount - 1);

export const useCounter = (dispatch: Dispatch<SetStateAction<number>>) => ({
    increment: increment(dispatch),
    decrement: decrement(dispatch),
});
