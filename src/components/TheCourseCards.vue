<script setup>
import { computed, onMounted, ref } from 'vue'

import { useRouter } from 'vue-router'

import SelectInteractive from '@/components/form-fields/SelectInteractive.vue'

import { NButton, NCard, NGrid, NGridItem, NModal, NSpace } from 'naive-ui'
import { ConstructionFilled } from '@vicons/material';

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

const advisories = ref([])
const courses = ref([])
const orderBy = ref(-1)
const orderByIcon = ref('fa fa-sort-amount-asc')
const showModalLocation = ref(false)
const sortBy = ref(null)
const sortByPrev = ref('nothing')
const userLatitude = ref(0)
const userLongitude = ref(0)

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
    label: 'Length',
    value: 'length',
    description: ''
  },
  {
    label: 'Popularity',
    value: 'popularity',
    description: ''
  },
  {
    label: 'Distance to Me',
    value: 'proximity',
    description: ''
  }
]

onMounted(async () => {
  const getPopularCoursesSlugs = async () => {
    const popularResponse = await fetch(`${import.meta.env.VITE_ANALYTICS_API_BASE_URL}/v1/pages/routes/total-time-views`, {
      keepalive: true,
      method: 'GET',
      headers: {
        'api-key': import.meta.env.VITE_ANALYTICS_API_KEY
      }
    })
    const { status: popularStatus } = popularResponse
    if (popularStatus === 200) {
      const popularResult = await popularResponse.json()
      const { data } = popularResult
      const popularCourses = data.filter(element => { return element.route.includes('/courses/') })
      const popularCoursesSlugs = popularCourses.map(element => { return { 'slug': element.route.slice(9), 'total_time': element.total_time, 'total_views': element.total_views } })
      return popularCoursesSlugs
    }
  }

  const advisoriesResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/advisories/published/courses/ids`)
  const advisoriesResult = await advisoriesResponse.json()
  const { status: advisoriesStatus } = advisoriesResponse

  if (advisoriesStatus === 200) {
    const { data } = advisoriesResult
    advisories.value = data
  }

  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/courses`)
  const result = await response.json()
  const { status } = response

  if (status === 200) {
    const { data, paths: { pathFilesCourses, pathFilesThumbnails }, prefixes: { prefixFilesThumbnails } } = result

    // Set the thumbnail path & prefix from the API data
    courseFilePath = pathFilesCourses
    thumbnailPath = pathFilesThumbnails
    thumbnailPrefix = prefixFilesThumbnails

    const popularCoursesSlugs = await getPopularCoursesSlugs()

    const returnAdvisories = _id => {
      const index = advisories.value.findIndex(element => element === _id)
      return index !== -1
    }

    const returnViews = slug => {
      const index = popularCoursesSlugs.findIndex(element => element.slug === slug)
      return index === -1 ? 0 : popularCoursesSlugs[index].total_views
    }
    const filtered = data.map(element => {
      return (({ _id, slug: key, title, length, ascent, brief, uploadFilesCourse, uploadFilesImage, publishOn, location: { latitude, longitude, city, state }, difficultyLevel }) => ({ key, title, length, ascent, brief, uploadFilesCourse, uploadFilesImage, publishOn, latitude, longitude, city, state, difficultyLevel, totalViews: returnViews(key), hasAdvisory: returnAdvisories(_id) }))(element)
    })
    courses.value.push(...filtered)
  }
})

const handleSortSelected = async event => {
  const { inputValue } = event
  if (inputValue === 'proximity') {
    const result = await navigator.permissions.query({ name: 'geolocation' })
    const { state } = result
    if (state === 'granted') {
      updateSortBy(inputValue)
    } else {
      showModalLocation.value = true
    }
  } else {
    updateSortBy(inputValue)
  }
}

const updateSortBy = inputValue => {
  sortBy.value = inputValue
}

const updateSortByPrev = inputValue => {
  sortByPrev.value = inputValue
}

const submitLocation = async () => {
  showModalLocation.value = false
  const location = await getLocation()
  const { latitude, longitude } = location
  userLatitude.value = latitude
  userLongitude.value = longitude
  updateSortBy('proximity')
}

const cancelLocation = () => {
  updateSortByPrev(sortBy.value)
  showModalLocation.value = false
}

const getLocation = () => {
  return new Promise((resolve, reject) => {
    if ('geolocation' in navigator) {
      function success (position) {
        const { coords: { latitude, longitude}, } = position
        resolve({
          latitude,
          longitude
        })
      }

      function error () {
        reject({
          error: 'Forbidden. User did not allow location access.'
        });
      }
      navigator.geolocation.getCurrentPosition(success, error)
    } else {
      reject({
        error: 'Not Found. Browser does not support location access.'
      })
    }
  })
}

const degreesToRadians = degrees => {
  const radians = (degrees * Math.PI)/180
  return radians
}

const getDistance = (startCoords, endCoords) => {
  const { latitude: startLatDegrees, longitude: startLonDegrees } = startCoords
  const { latitude: endLatDegrees, longitude: endLonDegrees } = endCoords

  const startLatRadians = degreesToRadians(startLatDegrees)
  const startLonRadians = degreesToRadians(startLonDegrees)
  const endLatRadians = degreesToRadians(endLatDegrees)
  const endLonRadians = degreesToRadians(endLonDegrees)

  const radius = 6571 // Radius of Earth in KM

  // Haversine equation
  const distance = Math.acos(Math.sin(startLatRadians) * Math.sin(endLatRadians) +
  Math.cos(startLatRadians) * Math.cos(endLatRadians) *
  Math.cos(startLonRadians - endLonRadians)) * radius

  return distance
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
    } else if (sortBy.value === 'proximity') {
      const userLocation = { latitude: userLatitude.value, longitude: userLongitude.value }
      const distance1 = getDistance( userLocation, { latitude: a.latitude, longitude: a.longitude })
      const distance2 = getDistance( userLocation, { latitude: b.latitude, longitude: b.longitude })
      return distance2 - distance1
    } else if (sortBy.value === 'popularity') {
      return a.totalViews - b.totalViews
    } else if (sortBy.value === 'publishOn' || sortBy.value === null) {
      const d1 = new Date(a.publishOn)
      const d2 = new Date(b.publishOn)
      return d1 - d2
    }
  })
  return orderBy.value === -1 ? sorted.reverse() : sorted
})

</script>

<template>
  <n-modal
    v-model:show="showModalLocation"
    preset="dialog"
    title="Permission to Access Location"
    content="To show courses by their distance to you, we need permission to access your location. To grant it, please click the continue button and then allow www.nocargravel.cc to access your location in the next dialog."
    positive-text="Continue"
    negative-text="Cancel"
    @positive-click="submitLocation"
    @negative-click="cancelLocation"
  />
  <div class="collate-bar">
    <n-grid x-gap="24" y-gap="24" :cols="12" :item-responsive="true" responsive="screen">
      <n-grid-item span="xs:10 s:5 m:3 xl:2">
        <select-interactive
          inputName="sortCourses"
          placeholder="Sort Courses By..."
          :labeltext="null"
          :options="options"
          :prevValue="sortByPrev"
          @update-select-values="handleSortSelected($event)"
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
      <n-grid-item span="xs:12 s:6 m:4 xl:3" v-for="{ key, title, length, ascent, brief, uploadFilesCourse = [], uploadFilesImage = [], publishOn, city, state, hasAdvisory } in sortedCourses" :key="key">
        <n-card :="$props" :title="title">
          <template #header-extra>
            {{ city }}, {{ state }}
          </template>
          <template #cover>
            <img :src="getThumbnailURI(uploadFilesImage[0])">
          </template>
          <div v-if="hasAdvisory" class="advisory"><i class="fa-solid fa-circle-exclamation"></i> Road Closures</div>
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
.advisory {
  margin-bottom: 1rem;
  font-size: 1rem;
  color: #ff6b25;
}
.n-card {
  width: 100%;
}
.sort-order {
  padding-top: 30px;
}
</style>
