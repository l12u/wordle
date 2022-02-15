export class WordleSlot {
    isLocked: boolean = false;
    state: "empty" | "unknown" | "invalid" | "included" | "correct" | "wrong" = "empty";

    get isCorrect(): boolean {
        return this.state === "correct";
    }

    get isEmpty(): boolean {
        return this.state === "empty";
    }

    get isIncluded(): boolean {
        return this.state === "included";
    }

    get isInvalid(): boolean {
        return this.state === "invalid";
    }

    get isUnknown(): boolean {
        return this.state === "unknown";
    }

    get isWrong(): boolean {
        return this.state === "wrong";
    }

    constructor(public readonly position: number, public letter: string) { }
}