<script setup>
import { ref } from 'vue'

import { onBeforeRouteLeave, useRoute } from 'vue-router'

import TheContact from "@/components/TheContact.vue"

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
  <div class="contact">
    <h1>No. Car. Gravel. &raquo; Contact Us</h1>
    <TheContact />
  </div>
</template>

<style>
</style>
