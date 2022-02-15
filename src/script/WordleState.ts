import {
    WordleGuess,
} from ".";

export type WordleState = {
    guesses: WordleGuess[],
    hardmode: boolean,
    includedKnownLetters: string[],
    knownLetters: string[],
    isCompleted: boolean,
    isSolved: boolean,
};

export const DEFAULT_STATE: WordleState = {
    guesses: [],
    hardmode: false,
    includedKnownLetters: [],
    knownLetters: [],
    isCompleted: false,
    isSolved: false,
};