/**
 * Represents a function that takes no arguments and returns a value of type TOutput.
 */
export type Action<TOutput = void> = () => TOutput;

/**
 * Represents a function that takes an input of type TInput and returns a value of type TOutput.
 */
export type Func<TInput, TOutput = void> = (input: TInput) => TOutput;
