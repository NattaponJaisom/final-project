<script setup>
import MainPage from "./components/MainPage.vue";
</script>

<template>
  <div class="q-pa-md full-width">
    <div class="q-pa-lg">
      <MainPage />
    </div>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

html,
body,
#app {
  background-color: #f8f4f4;
  min-height: 100%;
}
</style>
