export type WordleOptions = {
    maxGuesses: number,
    seed: number,
    storedGuesses: string[],
    wordLength: number,
};

export const DEFAULT_OPTIONS: Partial<WordleOptions> = {
    maxGuesses: 6,
    wordLength: 5,
};