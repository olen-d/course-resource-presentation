<script setup>
const props = defineProps({
  imageURI: String
})
</script>

<template>
  <img :src="imageURI">
</template>

<style scoped>
img {
  width: 100%;
  height: 600px;
  object-position: center;
  object-fit: cover;
}
</style>
