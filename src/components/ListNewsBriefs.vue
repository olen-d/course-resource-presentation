<script setup>
import NewsBrief from "./NewsBrief.vue"

import { computed, onMounted, onUnmounted, ref } from 'vue'

import { NGrid, NGridItem } from 'naive-ui'

const isLoading = ref(true)
const newsItems = ref([])
const windowWidth = ref(window.innerWidth)

onMounted(async () => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/news`)
  const result = await response.json()
  const { status } = response

  if (status === 200) {
    const { data } = result
    newsItems.value = data
    isLoading.value = false
  }

  window.addEventListener('resize', handleResize)
})

const handleResize = () => {
  windowWidth.value = window.innerWidth
}

// Computed
const newsItemsToShow = computed(() => {
  const itemsToShow = newsItems.value.slice(0, totalItemsToShow.value)
  return itemsToShow
})

const publishOnDatesFormatted = computed(() => {
  const datesFormatted = newsItemsToShow.value.map(element => {
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

const totalItemsToShow = computed(() => {
  if (windowWidth.value < 640) {
    return 1
  } else if (windowWidth.value < 1280) {
    return 2
  } else {
    return 3
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

</script>
<template>
  <div class="list-news">
    <n-grid x-gap="24" y-gap="24" :cols="6" :item-responsive=true responsive="screen">
      <n-grid-item span="xs:6 s:3 l:2" v-for="({ _id, headline, brief, article }, index) in newsItemsToShow" :key="_id">
        <NewsBrief v-if="!isLoading">
          <template #headline>{{ headline }}</template>
          <template #published>{{ publishOnDatesFormatted[index] }}</template>
          <template #brief>{{ brief }}</template>
          {{ article }}
        </NewsBrief>
      </n-grid-item>
    </n-grid>
  </div>
</template>
