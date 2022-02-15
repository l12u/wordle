import {
    WordleSlot,
    WordleSolution,
} from ".";

export class WordleGuess {
    slots: WordleSlot[] = [];

    get isEmpty(): boolean {
        return this.slots.every((slot) => slot.state === "empty");
    }

    get isInvalid(): boolean {
        return this.slots.every((slot) => slot.state === "invalid");
    }

    get nextSlot(): WordleSlot | undefined {
        return this.slots.find((slot) => !slot.isLocked && slot.letter === "?");
    }

    get nextSlotReverse(): WordleSlot | undefined {
        for (let i = this.slots.length - 1; i >= 0; i--) {
            const slot = this.slots[i];

            if (slot.isLocked || slot.letter === "?") continue;
            return slot;
        }

        return undefined;
    }

    constructor(fromString: string) {
        this.slots = fromString.split("").map((letter, index) => new WordleSlot(index, letter));
    }

    check(solution: WordleSolution): boolean {
        const occurrences: Record<string, number> = {};

        for (let i = 0; i < this.slots.length; i++) {
            const slot = this.slots.find((s) => s.position === i)!;

            occurrences[slot.letter] = (occurrences[slot.letter] || 0) + 1;

            if (solution.isAt(slot.letter, slot.position)) {
                slot.state = "correct";
                continue;
            }

            if (solution.isIncluded(slot.letter, occurrences[slot.letter])) {
                slot.state = "included";
                continue;
            }

            slot.state = "wrong";
        }

        return this.toString() === solution.word;
    }

    setStates(state: WordleSlot["state"]): void {
        this.slots.forEach((slot) => slot.state = state);
    }

    toString(): string {
        return this.slots.map((slot) => slot.letter).join("");
    }
}