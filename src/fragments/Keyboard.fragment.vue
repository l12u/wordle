<script lang="ts">
    import { Component, Prop, Vue } from "vue-property-decorator";

    import { ButtonStyle } from "@/components/Button.component.vue";

    import {
        WordleSolution,
    } from "@/script";

    @Component({ })
    export default class KeyboardFragment extends Vue {
        @Prop({ type: Boolean, required: false, default: false })
        readonly hardmode!: boolean;

        @Prop({ type: Array, required: false, default: () => [] })
        readonly includedKnownLetters!: string[];

        @Prop({ type: Boolean, required: false, default: false })
        readonly isDisabled!: boolean;

        @Prop({ type: Array, required: false, default: () => [] })
        readonly knownLetters!: string[];

        @Prop({ type: WordleSolution, required: true })
        readonly solution!: WordleSolution;

        keyboard = [
            "QWERTZUIOPÜ",
            "ASDFGHJKLÖÄ",
            "⤶YXCVBNMẞ⌫",
        ];

        smallKeyboard = [
            "QWERTZUIOP",
            "ASDFGHJKL",
            "YXCVBNM",
            "⤶ÄÖÜẞ⌫",
        ];

        get classList() {
            return ["", {
                "opacity-50 pointer-events-none": this.isDisabled,
            }];
        }

        getStyle(char: string): ButtonStyle {
            if (this.knownLetters.includes(char)) return this.solution.isIncluded(char, 1) ? "correct" : "wrong";
            if (this.includedKnownLetters.includes(char)) return "included";

            return "default";
        }

        pressKey(char: string): void {
            this.$emit("key-press", char);
        }
    }
</script>

<template>

    <div class="keyboard-fragment space-y-2 w-full xl:w-auto" :class="classList">
        <div v-for="line in keyboard" class="hidden xl:flex" :key="line">
            <WordleButton v-for="char in line.split('')" @click.native="pressKey(char)" class="w-11" :class="{ 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700 flex-1': '⤶⌫'.includes(char) }" :hardmode="hardmode" :theme="getStyle(char)" :key="char" v-text="char" />
        </div>

        <div v-for="line in smallKeyboard" class="flex max-w-full w-full xl:hidden" :key="line">
            <WordleButton v-for="char in line.split('')" @click.native="pressKey(char)" class="flex-1 h-8" :class="{ 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700 flex-1': '⤶⌫'.includes(char) }" :hardmode="hardmode" style="padding: 0" :theme="getStyle(char)" :key="char" v-text="char" />
        </div>
    </div>

</template>

<style lang="scss">

</style>