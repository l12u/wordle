import Vue from "vue";
import App from "@/App.vue";
import router from "@/router";
import store from "@/store";
import "@/assets/tailwind.css";

Vue.config.productionTip = false;

import WordleButton from "@/components/Button.component.vue";

Vue.component("WordleButton", WordleButton);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");
