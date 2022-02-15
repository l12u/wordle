<script lang="ts">
    import { Component, Prop, Vue } from "vue-property-decorator";

    import {
        WordleSlot,
    } from "@/script";

    @Component({ })
    export default class SlotComponent extends Vue {
        @Prop({ type: WordleSlot, required: true })
        readonly content!: WordleSlot;

        get classList() {
            return ["border-2 flex font-sans-alt font-black h-12 items-center justify-center shadow-md text-2xl w-12 xl:h-16 xl:text-4xl xl:w-16", {
                "border-blue-gray-500": this.content.isEmpty || this.content.isUnknown,
                "border-dashed border-blue-500 text-blue-500": this.content.isLocked,
                "bg-cool-gray-900 border-cool-gray-900": this.content.isWrong,
                "bg-green-500 border-green-500": this.content.isCorrect,
                "bg-amber-500 border-amber-500": this.content.isIncluded,
                "border-red-500 text-red-500": this.content.isInvalid,
            }];
        }
    }
</script>

<template>

    <div class="card h-12 relative w-12
        xl:h-16 xl:w-16" :class="{ ready: content.isEmpty || content.isUnknown || content.isInvalid, turning: !content.isEmpty && !content.isUnknown && !content.isInvalid }">

        <div class="wordle-slot absolute" :class="classList" style="backface-visibility: hidden; transform: rotateX(180deg)">
            <span class="leading-none" v-text="content.letter === '?' ? '' : content.letter" />
        </div>

        <div class="absolute bg-cool-gray-900 border-2 border-cool-gray-900" :class="classList" style="backface-visibility: hidden">
        </div>
    </div>

</template>

<style lang="scss">

    @keyframes turning {
        from {
            transform: rotateX(0);
        }
        to {
            transform: rotateX(180deg);
        }
    }

    .card {
        transform-style: preserve-3d;
    }

    .ready {
        transform: rotateX(180deg);
    }

    .turning {
        animation: turning 1s ease-in-out;
        animation-fill-mode: forwards;
    }

</style>