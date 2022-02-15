<script lang="ts">
    import { Component, Prop, Vue } from "vue-property-decorator";

    export type ButtonStyle = "default" | "included" | "correct" | "wrong" | "active";

    @Component({ })
    export default class ButtonComponent extends Vue {
        @Prop({ type: Boolean, required: false, default: false })
        readonly hardmode!: boolean;

        @Prop({ type: String, required: false, default: "default" })
        readonly theme!: ButtonStyle;

        get classList() {
            return ["border cursor-pointer font-medium px-4 py-2 rounded-md shadow-md text-sm", {
                "bg-cool-gray-700 border-cool-gray-900 inline-block hover:bg-cool-gray-600 active:bg-cool-gray-800": this.isDefault,
                "bg-rose-500 border-rose-900 inline-block hover:bg-rose-600 active:bg-rose-800": this.isActive,
                "bg-amber-500 border-transparent hover:bg-amber-600 active:bg-amber-700": this.isIncluded,
                "bg-green-500 border-transparent hover:bg-green-600 active:bg-green-700": this.isCorrect,
                "bg-cool-gray-900 border-transparent": this.isWrong,
                "pointer-events-none": this.isWrong && this.hardmode,
            }];
        }

        get isActive(): boolean {
            return this.theme === "active";
        }

        get isDefault(): boolean {
            return this.theme === "default";
        }

        get isIncluded(): boolean {
            return this.theme === "included";
        }

        get isCorrect(): boolean {
            return this.theme === "correct";
        }

        get isWrong(): boolean {
            return this.theme === "wrong";
        }
    }
</script>

<template>

    <button @click="void 0" class="wordle-button" :class="classList">
        <slot />
    </button>

</template>

<style lang="scss">

    .wordle-button {
        text-shadow: 0 1px 2px #0004;

        &[disabled] {
            opacity: .5;
            pointer-events: none;
        }

        & + & {
            margin-left: 8px;
        }
    }

</style>