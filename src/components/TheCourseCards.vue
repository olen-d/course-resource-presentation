<script setup>
import { computed, onMounted, ref } from 'vue'

import { useRouter } from 'vue-router'

import SelectInteractive from '@/components/form-fields/SelectInteractive.vue'

import { NButton, NCard, NGrid, NGridItem, NSpace } from 'naive-ui'

const router = useRouter()

let courseFilePath = ''
let thumbnailPath = ''
let thumbnailPrefix = ''

const getCourseFileURI = courseFile => {
  return `${import.meta.env.VITE_COURSE_FILES_HOST}/${courseFilePath}/${courseFile}`
}

const getThumbnailURI = fileImage => {
  return `${import.meta.env.VITE_IMAGES_HOST}/${thumbnailPath}/${thumbnailPrefix}${fileImage}`
}

const handleClick = key => {
  router.push({ path: `/courses/${key}` })
}

const toggleSortOrder = () => {
  if (orderBy.value === 1) {
    orderBy.value = -1
    orderByIcon.value = 'fa fa-sort-amount-asc'
  } else {
    orderBy.value = 1
    orderByIcon.value = 'fa fa-sort-amount-desc'
  }
}

const courses = ref([])
const orderBy = ref(-1)
const orderByIcon = ref('fa fa-sort-amount-asc')
const sortBy = ref('publishOn')
const options = [
  {
    label: 'Ascent',
    value: 'ascent',
    description: ''
  },
  {
    label: 'Date Published',
    value: 'publishOn',
    description: ''
  },
  {
    label: 'Difficulty',
    value: 'difficulty',
    description: ''
  },
  {
    label: 'Distance',
    value: 'length',
    description: ''
  }
]

onMounted(async () => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/courses`)
  const result = await response.json()
  const { status } = response

  if (status === 200) {
    const { data, paths: { pathFilesCourses, pathFilesThumbnails }, prefixes: { prefixFilesThumbnails } } = result

    // Set the thumbnail path & prefix from the API data
    courseFilePath = pathFilesCourses
    thumbnailPath = pathFilesThumbnails
    thumbnailPrefix = prefixFilesThumbnails

    const filtered = data.map(element => {
      return (({ slug: key, title, length, ascent, brief, uploadFilesCourse, uploadFilesImage, publishOn, location: { city, state }, difficultyLevel }) => ({ key, title, length, ascent, brief, uploadFilesCourse, uploadFilesImage, publishOn, city, state, difficultyLevel }))(element)
    })
    courses.value.push(...filtered)
  }
})

const updateSortBy = event => {
  const { inputValue } = event
  sortBy.value = inputValue
}

const sortedCourses = computed(() => {
  const sorted = courses.value.toSorted((a, b) => {
    if (sortBy.value === 'ascent') {
      return a.ascent - b.ascent
    } else if (sortBy.value === 'difficulty') {
      const difficultyLevel1 = a.difficultyLevel[0].rating
      const difficultyLevel2 = b.difficultyLevel[0].rating
      if (difficultyLevel1 !== difficultyLevel2) {
        return difficultyLevel1 - difficultyLevel2
      } else {
        // Tiebreaker is the average grade
        const length1 = a.length * 5280
        const length2 = b.length * 5280
        const ascent1 = a.ascent
        const ascent2 = b.ascent
        const runSquared1 = Math.pow(length1, 2) - Math.pow(ascent1, 2)
        const run1 = Math.sqrt(runSquared1)
        const grade1 = ascent1 / run1 * 100
        const runSquared2 = Math.pow(length2, 2) - Math.pow(ascent2, 2)
        const run2 = Math.sqrt(runSquared2)
        const grade2 = ascent2 / run2 * 100
        return grade1 - grade2
      }
    } else if (sortBy.value === 'length') {
      return a.length - b.length
    } else if (sortBy.value === 'publishOn') {
      const d1 = new Date(a.publishOn)
      const d2 = new Date(b.publishOn)
      return d1 - d2
    }
  })
  return orderBy.value === -1 ? sorted.reverse() : sorted
})

</script>

<template>
  <div class="collate-bar">
    <n-grid x-gap="24" y-gap="24" :cols="12" :item-responsive="true" responsive="screen">
      <n-grid-item span="xs:10 s:5 m:3 xl:2">
        <select-interactive
          inputName="sortCourses"
          placeholder="Sort Courses By..."
          :labeltext="null"
          :options="options"
          @update-select-values="updateSortBy($event)"
        />
      </n-grid-item>
      <n-grid-item>
        <div class="sort-order">
          <n-button text @click="toggleSortOrder" style="font-size: 24px" color="#aaaaaa">
            <i :class="orderByIcon"></i>
          </n-button>
        </div>
      </n-grid-item>
    </n-grid>
  </div>
  <div class="the-route-cards">
    <n-grid x-gap="24" y-gap="24" :cols="12" :item-responsive=true responsive="screen">
      <n-grid-item span="xs:12 s:6 m:4 xl:3" v-for="{ key, title, length, ascent, brief, uploadFilesCourse = [], uploadFilesImage = [], publishOn, city, state } in sortedCourses" :key="key">
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
            <n-space>
              <n-button @click="handleClick(key)" type="primary">
                View Course
              </n-button>
              <n-button type="secondary"
                tag="a"
                :href="getCourseFileURI(uploadFilesCourse[0])"
                download
              >
                Download Course
              </n-button>
            </n-space>
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
.sort-order {
  padding-top: 30px;
}
</style>
