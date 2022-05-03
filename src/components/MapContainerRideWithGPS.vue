<script setup>
const props = defineProps({
  mapLink: {
    type: String,
    required: true
  }
})
</script>

<template>
  <iframe :src="mapLink" style="width: 1px; min-width: 100%; height: 700px; border: none;" scrolling="no"></iframe>
</template>
