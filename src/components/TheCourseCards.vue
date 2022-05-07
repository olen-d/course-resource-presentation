<script setup>
import { onMounted, ref } from 'vue'

import { useRouter } from 'vue-router'

import { NButton, NCard, NGrid, NGridItem } from 'naive-ui'

const router = useRouter()

let thumbnailPath = ''
let thumbnailPrefix = ''

const getThumbnailURI = fileImage => {
  return `${import.meta.env.VITE_IMAGES_HOST}/${thumbnailPath}/${thumbnailPrefix}${fileImage}`
}

const handleClick = (key) => {
  router.push({ path: `/courses/${key}` })
}

// Get the courses
const courses = ref([])

onMounted(async () => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/courses`)
  const result = await response.json()
  const { status } = response

  if (status === 200) {
    const { data, paths: { pathFilesThumbnails }, prefixes: { prefixFilesThumbnails } } = result

    // Set the thumbnail path & prefix from the API data
    thumbnailPath = pathFilesThumbnails
    thumbnailPrefix = prefixFilesThumbnails

    const filtered = data.map(element => {
      return (({ slug: key, title, length, ascent, brief, uploadFilesImage, publishOn, location: { city, state } }) => ({ key, title, length, ascent, brief, uploadFilesImage, publishOn, city, state }))(element)
    })
    courses.value.push(...filtered)
  }
})
</script>

<template>
  <div class="the-route-cards">
    <n-grid x-gap="24" y-gap="24" :cols="12" :item-responsive=true responsive="screen">
      <n-grid-item span="xs:12 s:6 m:4 xl:3" v-for="{ key, title, length, ascent, brief, uploadFilesImage = [], publishOn, city, state } in courses" :key="key">
        <n-card :="$props" :title="title">
          <template #header-extra>
            {{ city }}, {{ state }}
          </template>
          <template #cover>
            <img :src="getThumbnailURI(uploadFilesImage[0])">
          </template>
          {{ brief }}
          <template #footer>
            Length: {{ new Intl.NumberFormat().format(length) }} miles<br />
            Ascent: {{ new Intl.NumberFormat().format(ascent) }} feet<br />
            Posted: {{ new Intl.DateTimeFormat().format(new Date(publishOn)) }}<br />
          </template>
          <template #action>
            <n-button @click="handleClick(key)" type="primary">
              View Course
            </n-button>
          </template>
        </n-card>
      </n-grid-item>
    </n-grid>
  </div>
</template>

<style scoped>
.n-card {
  width: 100%;
}
</style>
