<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";

    import {
        Wordle,
        WordleSlot,
    } from "@/script";

    import SlotComponent from "@/components/Slot.component.vue";
    import KeyboardFragment from "@/fragments/Keyboard.fragment.vue";

    @Component({
        components: {
            KeyboardFragment,
            WordleSlot: SlotComponent,
        },
    })
    export default class WordleView extends Vue {
        wordle: Wordle = new Wordle();

        get isHardmodeChangeable(): boolean {
            return this.wordle.state.guesses.findIndex((guess) => guess.isEmpty) < 3 && !this.wordle.state.isCompleted;
        }

        created(): void {
            if (this.$store.state.seed && this.$store.state.seed === this.wordle.seed && this.$store.state.guesses) {
                this.wordle = new Wordle({ seed: this.$store.state.seed, storedGuesses: this.$store.state.guesses });
            } else {
                this.$store.commit("playSeed", this.wordle.seed);
            }

            this.wordle.state.hardmode = this.$store.state.hardmode ?? false;
        }

        async copyPattern(): Promise<void> {
            await this.wordle.copyPattern();
        }

        onKeyPressed(key: string): void {
            if (key === "⤶") {
                const guess = this.wordle.submitGuess();
                if (!guess) return;

                this.$store.commit("addGuess", guess);
            } else if (key === "⌫") {
                this.wordle.removeLetter();
            } else {
                this.wordle.enterLetter(key);
            }
        }

        toggleHardmode(): void {
            this.wordle.state.hardmode = !this.wordle.state.hardmode;
            this.$store.commit("setHardmode", this.wordle.state.hardmode);
        }

        toggleIsLocked(slot: WordleSlot): void {
            if (slot.state !== "unknown") return;

            slot.isLocked = !slot.isLocked;
        }
    }
</script>

<template>

    <div id="wordle-view" class="flex flex-col h-screen items-center justify-between max-w-7xl mx-auto p-2
        xl:p-8">

        <section class="flex items-center justify-between mb-4 w-full
            xl:block xl:mb-8 xl:text-center">

            <div class="font-bold tracking-widest uppercase
                xl:text-4xl">Wordle</div>
            <div class="font-medium text-blue-gray-500
                xl:text-lg">Seed #{{ wordle.seed }}</div>
        </section>

        <section class="text-center">
            <div class="p-4 space-y-2 text-center">

                <article v-for="(guess, index) in wordle.state.guesses" class="flex space-x-2" :class="{ invalid: guess.isInvalid }" :key="guess + `-${index}`">
                    <WordleSlot v-for="slot in guess.slots" @click.native="toggleIsLocked(slot)" :content="slot" :key="`${slot.position}-${slot.letter}`" />
                </article>

                <article class="flex space-x-2" v-if="wordle.state.isCompleted && !wordle.state.isSolved">
                    <div v-for="(letter, i) in wordle.solution.word.split('')" class="border-2 border-dashed border-green-500 flex font-sans-alt font-black h-12 items-center justify-center shadow-md text-green-500 text-2xl w-12
                        xl:h-16 xl:text-4xl xl:w-16" v-html="letter" :key="`solution-${i}`" />
                </article>
            </div>

            <WordleButton v-if="wordle.state.isCompleted" @click.native="copyPattern()">Pattern kopieren</WordleButton>
        </section>

        <section class="flex flex-col items-center space-y-4 w-full
            xl:space-y-8 xl:w-auto">

            <KeyboardFragment @key-press="onKeyPressed($event)" :hardmode="wordle.state.hardmode" :includedKnownLetters="wordle.state.includedKnownLetters" :isDisabled="wordle.state.isCompleted" :knownLetters="wordle.state.knownLetters" :solution="wordle.solution" />

            <div class="flex items-center justify-between w-full">
                <WordleButton class="opacity-50 pointer-events-none">🎨</WordleButton>

                <img class="h-6" src="@/assets/wordmark.png" />

                <WordleButton @click.native="toggleHardmode()" :class="{ 'opacity-50 pointer-events-none': !isHardmodeChangeable }" :theme="wordle.state.hardmode ? 'active' : 'default'">💪</WordleButton>
            </div>
        </section>
    </div>

</template>

<style lang="scss" scoped>

    @keyframes invalidBounce {
        0% {
            transform: translateX(0px);
        }
        20% {
            transform: translateX(12px);
        }
        40% {
            transform: translateX(-12px);
        }
        60% {
            transform: translateX(12px);
        }
        80% {
            transform: translateX(-12px);
        }
        100% {
            transform: translateX(0px);
        }
    }

    .invalid {
        animation: invalidBounce .4s ease-in-out;
    }

</style>