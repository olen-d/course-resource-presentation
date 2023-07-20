<script setup>
import WelcomeItem from "./WelcomeItem.vue"

import { onMounted, ref } from 'vue'

import { NGrid, NGridItem } from 'naive-ui'

const welcomeItems = ref([])
const isLoading = ref(true)

onMounted(async () => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/welcome/items`)
  const result = await response.json()
  const { status } = response

  if (status === 200) {
    const { data } = result
    welcomeItems.value = data
    isLoading.value = false
  }
})
</script>

<template>
  <div class="the-welcome">
    <n-grid x-gap="24" y-gap="24" :cols="6" :item-responsive=true responsive="screen">
      <n-grid-item span="xs:6 s:3 l:2">
        <WelcomeItem v-if="!isLoading">
          <template #heading>{{ welcomeItems[0].title }}</template>
          <span v-html="welcomeItems[0].contentHtml"></span>
        </WelcomeItem>
      </n-grid-item>
      <n-grid-item span="xs:6 s:3 l:1">
        <WelcomeItem v-if="!isLoading">
          <template #heading>{{ welcomeItems[1].title }}</template>
          <span v-html="welcomeItems[1].contentHtml"></span>
        </WelcomeItem>
      </n-grid-item>
    </n-grid>
  </div>
</template>

<style scoped>
.the-welcome {
  margin-bottom: 1rem;
}
</style>
