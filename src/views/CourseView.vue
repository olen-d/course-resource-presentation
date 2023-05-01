<script setup>
import Course from '@/components/Course.vue'

import { useRoute } from 'vue-router'

const route = useRoute()

</script>

<template>
  <div class="course-view">
    <Course :slug="route.params.slug" />
  </div>
</template>
