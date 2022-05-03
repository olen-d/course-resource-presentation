<script setup>
import { h, ref } from "vue"
import { RouterLink } from "vue-router"
import { NMenu } from "naive-ui"

const activeKey = ref(null);

const menuOptions = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            path: "/",
          },
        },
        {
          default: () => "Home",
        }
      ),
    key: "home",
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            path: "/about",
          },
        },
        {
          default: () => "About",
        }
      ),
    key: "about",
  },
];
</script>

<template>
  <div class="wrapper-navbar">
    <n-menu v-model:value="activeKey" mode="horizontal" :options="menuOptions" />
  </div>
</template>

<style scoped>
.wrapper-navbar {
  margin-top: 2rem;
  margin-bottom: 2rem;
}
</style>
