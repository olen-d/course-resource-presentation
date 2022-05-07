<script setup>
import AboutItem from '@/components/AboutItem.vue'

import { onMounted, ref } from 'vue'
import { NGrid, NGridItem } from 'naive-ui'

const aboutItems = ref([])
const isLoading = ref(true)

onMounted(async () => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/about/items`)
  const result = await response.json()
  const { status } = response

  if (status === 200) {
    const { data } = result
    aboutItems.value = data
    isLoading.value = false
  }
})
</script>

<template>
<n-grid x-gap="24" y-gap="24" :cols="6" :item-responsive=true responsive="screen">
  <n-grid-item span="6 s:3 l:2">
    <AboutItem v-if="!isLoading">
      <template #heading>{{ aboutItems[0].title }}</template>
      <template #details><span v-html="aboutItems[0].contentHtml"></span></template>
    </AboutItem>
  </n-grid-item>
  <n-grid-item span="6 s:3 l:1">
    <AboutItem v-if="!isLoading">
      <template #heading>{{ aboutItems[1].title }}</template>
      <template #details><span v-html="aboutItems[1].contentHtml"></span></template>
    </AboutItem>
  </n-grid-item>
  <n-grid-item span="6 s:3 l:1">
    <AboutItem v-if="!isLoading">
      <template #heading>{{ aboutItems[2].title }}</template>
      <template #details><span v-html="aboutItems[2].contentHtml"></span></template>
    </AboutItem>
  </n-grid-item>
  <n-grid-item span="6 s:3 l:2">
    <AboutItem v-if="!isLoading">
      <template #heading>{{ aboutItems[3].title }}</template>
      <template #details><span v-html="aboutItems[3].contentHtml"></span></template>
    </AboutItem>
  </n-grid-item>
</n-grid>
</template>
