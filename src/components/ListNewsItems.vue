<script setup>
import NewsItem from "./NewsItem.vue"

import { computed, onMounted, ref } from 'vue'

import { NGrid, NGridItem } from 'naive-ui'

const newsItems = ref([])
const isLoading = ref(true)

onMounted(async () => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/news`)
  const result = await response.json()
  const { status } = response

  if (status === 200) {
    const { data } = result
    newsItems.value = data
    isLoading.value = false
  }
})

const publishOnDatesFormatted = computed(() => {
  const datesFormatted = newsItems.value.map(element => {
    const dateToFormat = new Date(element.publishOn)
      const options = {
        year: 'numeric',
        month: 'long',
        weekday: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }
      const dateFormatted = new Intl.DateTimeFormat('en-US', options).format(dateToFormat)
      return dateFormatted
  })
  return datesFormatted
})

</script>
<template>
  <div class="list-news">
    <n-grid x-gap="24" y-gap="24" :cols="6" :item-responsive=true responsive="screen">
      <n-grid-item span="xs:6 s:3 l:2">
        <NewsItem v-if="!isLoading">
          <template #headline>{{ newsItems[0].headline }}</template>
          <template #published>{{ publishOnDatesFormatted[0] }}</template>
          <template #brief>{{ newsItems[0].brief }}</template>
          {{ newsItems[0].article }}
        </NewsItem>
      </n-grid-item>
    </n-grid>
  </div>
</template>
