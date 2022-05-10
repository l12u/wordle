import { Acceptable, Guessable } from "@/words";

import {
    DEFAULT_OPTIONS,
    DEFAULT_STATE,
    WordleGuess,
    WordleOptions,
    WordleState,
} from ".";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜẞ";

export class Wordle {
    nextGuess?: WordleGuess;
    private options: WordleOptions;
    solution: WordleSolution;
    state: WordleState = DEFAULT_STATE;

    get seed(): number {
        return this.options.seed;
    }

    constructor(options?: Partial<WordleOptions>) {
        this.options = {
            ...DEFAULT_OPTIONS,
            ...options,
            seed: this.getCurrentSeed(),
        } as WordleOptions;

        this.solution = new WordleSolution(this.getWordFromSeed());

        if (options?.seed === this.options.seed && this.options.storedGuesses.length > 0) {
            this.restoreState();
        } else {
            this.resetState();
        }
    }

    public async copyPattern(): Promise<void> {
        const currentGuess = this.state.guesses.findIndex((guess) => guess.isEmpty);
        let pattern = `:l12u: Wordle #${this.seed} (${currentGuess !== -1 ? currentGuess : "X"}/${this.options.maxGuesses}${this.state.hardmode ? "*" : ""})\n`;

        for (let g = 0; g < (currentGuess === -1 ? this.options.maxGuesses : currentGuess); g++) {
            pattern += "\n";

            for (let i = 0; i < this.options.wordLength; i++) {
                const slot = this.state.guesses[g].slots[i];

                if (slot.isCorrect) {
                    pattern += "🟩";
                } else if (slot.isIncluded) {
                    pattern += "🟨";
                } else {
                    pattern += "⬛";
                }
            }
        }

        pattern += `\n\n ${window.location.origin}`;

        await navigator.clipboard.writeText(pattern);
    }

    public enterLetter(letter: string): void {
        if (!this.nextGuess || !this.nextGuess.nextSlot) return;

        this.nextGuess.nextSlot.letter = letter;
    }

    private getCurrentSeed(): number {
        const today = new Date();
        const dayCounts = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
        const month = today.getMonth();
        const day = today.getDate();
        const year = today.getFullYear();

        let dayOfYear = dayCounts[month] + day;

        function isLeapYear(year: number): boolean {
            if ((year & 3) !== 0) return false;
            return ((year % 100) !== 0 || (year % 400) === 0);
        }

        if (month > 1 && isLeapYear(year)) dayOfYear++;
        const yearsSince2022 = year - 2022;
        let yearOffset = yearsSince2022 * 365;

        for (let y = 2022; y < year; y++) {
            if (isLeapYear(y)) yearOffset++;
        }

        return dayOfYear + yearOffset;
    }

    private getWordFromSeed(): string {
        return Guessable[this.options.wordLength][this.options.seed % Guessable[this.options.wordLength].length];
    }

    private prepareNextGuess(): void {
        this.nextGuess = this.state.guesses.find((guess) => guess.isEmpty);
        this.nextGuess?.setStates("unknown");
    }

    public removeLetter(): void {
        if (!this.nextGuess || !this.nextGuess.nextSlotReverse) return;

        this.nextGuess.nextSlotReverse.letter = "?";
    }

    private resetState(): void {
        this.state.guesses = [];

        for (let i = 0; i < this.options.maxGuesses; i++) {
            this.state.guesses.push(new WordleGuess("?".repeat(this.options.wordLength)));
        }

        this.prepareNextGuess();
    }

    private restoreState(): void {
        this.state.guesses = this.options.storedGuesses.map((guess) => new WordleGuess(guess));

        this.state.includedKnownLetters = [];
        this.state.knownLetters = [];

        let isSolved = false;

        this.state.guesses.forEach((guess) => {
            isSolved = guess.check(this.solution);

            guess.slots.forEach((slot) => {
                const collection = slot.isIncluded ? this.state.includedKnownLetters : this.state.knownLetters;
                if (!collection.includes(slot.letter)) collection.push(slot.letter);
            });
        });

        const remainingTries = this.options.maxGuesses - this.state.guesses.length;
        for (let i = 0; i < remainingTries; i++) {
            this.state.guesses.push(new WordleGuess("?".repeat(this.options.wordLength)));
        }

        if (!isSolved) this.prepareNextGuess();

        this.state.isCompleted = isSolved || this.nextGuess === undefined;
        this.state.isSolved = isSolved;
    }

    public submitGuess(): string | undefined {
        if (!this.nextGuess || this.state.isCompleted) return;

        const guess = this.nextGuess.toString();
        if (!Acceptable[this.options.wordLength].includes(guess) && !Guessable[this.options.wordLength].includes(guess)) {
            this.nextGuess.setStates("invalid");
            setTimeout(() => this.nextGuess?.setStates("unknown"), 400);
            return;
        }

        const isSolved = this.nextGuess.check(this.solution);

        this.nextGuess.slots.forEach((slot) => {
            const collection = slot.isIncluded ? this.state.includedKnownLetters : this.state.knownLetters;
            if (!collection.includes(slot.letter)) collection.push(slot.letter);
        });

        if (!isSolved) this.prepareNextGuess();

        this.state.isCompleted = isSolved || this.nextGuess === undefined;
        this.state.isSolved = isSolved;

        return guess;
    }
}

export class WordleSolution {
    public includes: Record<string, number[]>;

    constructor(public word: string) {
        this.includes = ALPHABET.split("").reduce((acc, cur) => {
            acc[cur] = [];

            if (!word.includes(cur)) return acc;

            for (let i = 0; i < word.length; i++) {
                if (word[i] === cur) acc[cur].push(i);
            }

            return acc;
        }, {} as WordleSolution["includes"]);
    }

    count(letter: string): number {
        return this.includes[letter].length;
    }

    isAt(letter: string, position: number): boolean {
        return this.includes[letter].includes(position);
    }

    isIncluded(letter: string, count: number): boolean {
        return this.includes[letter].length > 0 && count <= this.includes[letter].length;
    }
}
