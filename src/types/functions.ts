export type Action<TOutput = void> = () => TOutput;

export type Func<TInput, TOutput = void> = (input: TInput) => TOutput;
