import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";

const vuexLocal = new VuexPersistence({
    key: "wordle",
    storage: window.localStorage,
});

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        guesses: [] as string[],
        hardmode: false,
        seed: 0,
    },
    mutations: {
        addGuess(state, guess: string): void {
            state.guesses.push(guess);
        },
        playSeed(state, newSeed: number): void {
            state.guesses = [];
            state.seed = newSeed;
        },
        setHardmode(state, active: boolean): void {
            state.hardmode = active;
        },
    },
    actions: {
    },
    modules: {
    },
    plugins: [vuexLocal.plugin],
});