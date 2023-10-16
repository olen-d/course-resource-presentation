<script setup>
import { ref } from 'vue'

import { onBeforeRouteLeave, useRoute } from 'vue-router'

import Course from '@/components/Course.vue'

// Begin analytics
import { useTrackTimeOnPage } from '@/composables/useTrackTimeOnPage.js'

const route = useRoute()
const isLeavingRoute = ref(false)

const { fullPath: routePath, meta: { title: routeTitle } } = route

useTrackTimeOnPage(isLeavingRoute, routePath, routeTitle)

onBeforeRouteLeave((to, from) => {
  isLeavingRoute.value = true
})
// End analytics

</script>

<template>
  <div class="course-view">
    <Course :slug="route.params.slug" />
  </div>
</template>
