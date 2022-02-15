<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";

    @Component({ })
    export default class App extends Vue {
    }
</script>

<template>

    <div id="app" class="bg-cool-gray-800 min-h-screen text-white">
        <router-view />
    </div>

</template>

<style lang="scss">

    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap');

</style>