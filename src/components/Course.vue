<script setup>
import ImageHeroCourse from '@/components/ImageHeroCourse.vue'
import LocationCourse from '@/components/LocationCourse.vue'
import MapContainerRideWithGPS from '@/components/MapContainerRideWithGPS.vue'
import MetaCourse from '@/components/MetaCourse.vue'
import SummaryCourse from '@/components/SummaryCourse.vue'
import SupportingCourse from '@/components/SupportingCourse.vue'
import ThumbnailsDisplay from '@/components/ThumbnailsDisplay.vue'

import { onMounted, ref } from 'vue'

import {
  NCarousel,
  NGrid,
  NGridItem,
  NModal,
  NRate
} from 'naive-ui'

const props = defineProps({
  slug: String
})

let imagePath = ''
let imagePrefix = ''

const getImageURI = fileImage => {
  return `${import.meta.env.VITE_IMAGES_HOST}/${imagePath}/${imagePrefix}${fileImage}`
}

const getThumbnailURI = fileImage => {
  return `${import.meta.env.VITE_IMAGES_HOST}/${thumbnailPath}/${thumbnailPrefix}${fileImage}`
}

const handleThumbnailClick = event => {
  imageIndex.value = event
  showModal.value = true
}

const course = ref({})
const imageIndex = ref(0)
const heroImage = ref('')
const showModal = ref(false)
const thumbnailPath = ref('')
const thumbnailPrefix = ref('')

onMounted(async () => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/courses/${props.slug}`)
  const result = await response.json()
  const { status } = response

  if (status === 200) {
    const {
      data,
      paths: {
        pathFilesImages,
        pathFilesThumbnails
      }, 
      prefixes: {
        prefixFilesImages,
        prefixFilesThumbnails
      }
    } = result

    course.value = data[0]
    // Set the thumbnail path & prefix from the API data
    imagePath = pathFilesImages
    imagePrefix =prefixFilesImages
    thumbnailPath.value = pathFilesThumbnails
    thumbnailPrefix.value = prefixFilesThumbnails
  }
  heroImage.value = course.value.uploadFilesImage[0]

  // Add the course title to the page title
  document.title = `${course.value.title} \u00ab ${document.title}`
})
</script>

<template>
  <n-modal :close-on-esc="true" v-model:show="showModal">
    <n-carousel :default-index="imageIndex" :show-arrow="true">
      <div v-for="image in course.uploadFilesImage" class="carousel">
        <div class="wrapper-carousel-img">
        <img
          class="carousel-img"
          :src="getImageURI(image)"
        />
        </div>
      </div>
    </n-carousel>
  </n-modal>
  <div class="course">
    <n-grid x-gap="12" y-gap="12" :cols="24">
      <n-grid-item :span="15">
        <div class="image-hero-course">
          <ImageHeroCourse v-if="heroImage" :imageURI="getImageURI(heroImage)" />
        </div>
        <SummaryCourse v-if="course.summaryHtml" label="ride report" :showLabel="true" :content="course.summaryHtml" />
      </n-grid-item>
      <n-grid-item offset="1" :span="8">
        <div class="headline">
          <h2>
            {{course.title}}
          </h2>
        </div>
        <div class="rating-happiness">
          <n-rate v-if="course.happiness" color="#ff6b25" :readonly="true" :default-value="course.happiness" />
        </div>
        <LocationCourse v-if="course.location" label="location" :location="course.location" :showLabel="true" />
        <n-grid x-gap="12" y-gap="12" cols="1 s:2 l:3" responsive="screen">
          <n-grid-item>
            <MetaCourse v-if="course.length" label="distance" :showLabel="true" :value="`${new Intl.NumberFormat().format(course.length)} miles`" />
          </n-grid-item>
          <n-grid-item>
            <MetaCourse v-if="course.ascent" label="ascent" :showLabel="true" :value="`${new Intl.NumberFormat().format(course.ascent)} feet`" />
          </n-grid-item>
          <n-grid-item>
            <MetaCourse v-if="course.terrain" label="terrain" :showLabel="true" :value="course.terrain" />
          </n-grid-item>
          <n-grid-item>
            <MetaCourse v-if="course.terrain" label="setting" :showLabel="true" :value="course.setting" />
          </n-grid-item>
          <n-grid-item>
            <MetaCourse v-if="course.terrain" label="difficulty" :showLabel="true" :value="course.difficulty" />
          </n-grid-item>
        </n-grid>
        <SupportingCourse v-if="course.facts" label="be prepared" :showLabel="true" :content="course.facts" />
        <SupportingCourse v-if="course.parking" label="parking" :showLabel="true" :content="course.parking" />
        <SupportingCourse v-if="course.creation" label="inspiration" :showLabel="true" :content="course.creation" />
      </n-grid-item>
      <n-grid-item span="3">
        <MetaCourse v-if="course.userFullname" label="posted by" :showLabel="true" :value="course.userFullname" />
      </n-grid-item>
      <n-grid-item :offset="1" span="3">
        <MetaCourse v-if="course.publishOn" label="published on" :showLabel="true" :value="`${new Intl.DateTimeFormat().format(new Date(course.publishOn))}`" />
      </n-grid-item>
      <n-grid-item span="24">
        <ThumbnailsDisplay v-if="course.uploadFilesImage" :filesImage="course.uploadFilesImage" :thumbPath="thumbnailPath" :thumbPrefix="thumbnailPrefix" @emit-thumbnail-click="handleThumbnailClick($event)"/>
      </n-grid-item>
      <n-grid-item span="24">
        <MapContainerRideWithGPS v-if="course.mapLink" :mapLink="course.mapLink" />
      </n-grid-item>
    </n-grid>
  </div>
</template>

<style scoped>
:global(.n-carousel) {
  background: none;
  box-shadow: none;
}
:global(.n-modal-mask) {
  background-color: rgba(32, 32, 32, 0.95);
}

.carousel {
  padding-top: 15px;
  padding-bottom: 15px;
  width: 100%;
  text-align: center;
}

.carousel-img {
  border-radius: 10px;
  width: auto;
  max-height: 800px;
}

.headline {
  text-align: center;
}

.headline h2 {
  margin-top: 0;
  font-size: 1.6rem;
  text-transform: uppercase;
  color: #ff6b25;
}

.rating-happiness {
  margin-bottom: 1rem;
  text-align: center;
}

.wrapper-carousel-img {
  display: inline-block;
  padding: 30px;
  background: #ffe;
  box-shadow: 10px 10px 5px 3px rgba(8, 8, 8, 0.5);
}
</style>
