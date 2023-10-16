<script setup>
import { ref } from 'vue'

import { onBeforeRouteLeave, useRoute } from 'vue-router'

import TheAbout from "@/components/TheAbout.vue"

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
  <div class="about">
    <h1>No. Car. Gravel. &raquo; About</h1>
    <TheAbout />
  </div>
</template>

<style>
</style>
