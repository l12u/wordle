import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

import WordleView from "@/views/Wordle.view.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        path: "/",
        name: "wordle",
        component: WordleView,
    },
];

const router = new VueRouter({
    mode: "hash",
    base: process.env.BASE_URL,
    routes,
});

export default router;