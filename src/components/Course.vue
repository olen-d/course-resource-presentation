<script setup>
import ImageHeroCourse from '@/components/ImageHeroCourse.vue'
import LocationCourse from '@/components/LocationCourse.vue'
import MapContainerRideWithGPS from '@/components/MapContainerRideWithGPS.vue'
import MetaCourse from '@/components/MetaCourse.vue'
import Statistic from '@/components/Statistic.vue'
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
      <div v-for="image in course.uploadFilesImage" :key="image" class="carousel">
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
    <n-grid x-gap="12" y-gap="12" :cols="24" :item-responsive=true responsive="screen">
      <n-grid-item span="24 m:15">
        <div class="image-hero-course">
          <ImageHeroCourse v-if="heroImage" :imageURI="getImageURI(heroImage)" />
        </div>
      </n-grid-item>
      <n-grid-item offset="m:1" span="24 m:8">
        <div class="headline">
          <h2>
            {{course.title}}
          </h2>
        </div>
        <div class="rating-happiness">
          <n-rate v-if="course.happiness" color="#ff6b25" :readonly="true" :default-value="course.happiness" />
        </div>
        <LocationCourse v-if="course.location" label="location" :location="course.location" :showLabel="true" />
        <n-grid x-gap="12" y-gap="12" cols="2 400:3 550:4" responsive="self">
          <n-grid-item>
            <div class="meta--item-center">
              <MetaCourse v-if="course.length" label="distance" :showLabel="true" :value="`${new Intl.NumberFormat().format(course.length)} miles`" />
            </div>
          </n-grid-item>
          <n-grid-item>
            <div class="meta--item-center">
              <MetaCourse v-if="course.ascent" label="climbing" :showLabel="true" :value="`${new Intl.NumberFormat().format(course.ascent)} feet`" />
            </div>
          </n-grid-item>
          <n-grid-item>
            <div class="meta--item-center">
              <MetaCourse v-if="course.terrain" label="terrain" :showLabel="true" :value="course.terrain" />
            </div>
          </n-grid-item>
          <n-grid-item>
            <div class="meta--item-center">
              <MetaCourse v-if="course.terrain" label="setting" :showLabel="true" :value="course.setting" />
            </div>
          </n-grid-item>
          <n-grid-item>
            <div class="meta--item-center">
              <MetaCourse v-if="course.terrain" label="difficulty" :showLabel="true" :value="course.difficulty" />
            </div>
          </n-grid-item>
        </n-grid>
        <div class="dog-chases">
          <h3>
            <i class="fa-solid fa-dog"></i> Dog Chases
          </h3>
          <n-grid x-gap="12" y-gap="12" cols="3">
            <n-grid-item>
              <Statistic v-if="course.dogStatistics" label="chases" :showLabel="true" :value="course.dogStatistics.totalChases" />
            </n-grid-item>
            <n-grid-item>
              <Statistic v-if="course.dogStatistics" label="dogs" :showLabel="true" :value="course.dogStatistics.totalDogs" />
            </n-grid-item>
            <n-grid-item>
              <Statistic v-if="course.dogStatistics" label="legs" :showLabel="true" :value="course.dogStatistics.totalLegs" />
            </n-grid-item>
          </n-grid>
        </div>
      </n-grid-item>
      <n-grid-item :span="24">
        <SummaryCourse v-if="course.summaryHtml" label="ride report" :showLabel="true" :content="course.summaryHtml" />
      </n-grid-item>
      <n-grid-item span="12 m:6">
        <MetaCourse v-if="course.userFullname" label="posted by" :showLabel="true" :value="course.userFullname" />
      </n-grid-item>
      <n-grid-item span="12 m:6">
        <MetaCourse v-if="course.publishOn" label="published" :showLabel="true" :value="`${new Intl.DateTimeFormat().format(new Date(course.publishOn))}`" />
      </n-grid-item>
      <n-grid-item span="24">
        <ThumbnailsDisplay v-if="course.uploadFilesImage" :filesImage="course.uploadFilesImage" :thumbPath="thumbnailPath" :thumbPrefix="thumbnailPrefix" @emit-thumbnail-click="handleThumbnailClick($event)"/>
      </n-grid-item>
      <n-grid-item span="24">
        <MapContainerRideWithGPS v-if="course.mapLink" :mapLink="course.mapLink" />
      </n-grid-item>
      <n-grid-item span="24 m:8">
        <SupportingCourse v-if="course.facts" icon="fa-solid fa-circle-exclamation" label="be prepared" :showIcon="true" :showLabel="true" :content="course.facts" />
      </n-grid-item>
      <n-grid-item span="24 m:8">
        <SupportingCourse v-if="course.parking" icon="fa-solid fa-square-parking" label="parking" :showIcon="true" :showLabel="true" :content="course.parking" />
      </n-grid-item>
      <n-grid-item span="24 m:8">
        <SupportingCourse v-if="course.creation" icon="fa-solid fa-lightbulb" label="creation" :showIcon="true" :showLabel="true" :content="course.creation" />
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

.dog-chases {
  text-align: center;
}

.dog-chases h3 {
  font-size: 1.5rem;
  font-weight: 500;
  text-transform: uppercase;
  color: #ff6b25;
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

.meta--item-center {
  text-align: center;
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
