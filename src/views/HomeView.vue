<script setup>
import { ref } from 'vue'

import { onBeforeRouteLeave, useRoute } from 'vue-router'

import ListNewsBriefs from "@/components/ListNewsBriefs.vue"
import TheCourseCards from "@/components/TheCourseCards.vue"
import TheWelcome from "@/components/TheWelcome.vue"

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
  <div class="home">
    <h1>No. Car. Gravel.</h1>
    <ListNewsBriefs />
    <TheWelcome />
    <TheCourseCards />
  </div>
</template>
