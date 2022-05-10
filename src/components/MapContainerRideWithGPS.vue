<script setup>
const props = defineProps({
  mapLink: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="map-container-ride-with-gps">
    <iframe :src="mapLink" style="width: 1px; min-width: 100%; height: 700px; border: none;" scrolling="no"></iframe>
  </div>
</template>

<style scoped>
.map-container-ride-with-gps {
  margin-top: 4rem;
}
</style>
