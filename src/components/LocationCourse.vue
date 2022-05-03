<script setup>
const props = defineProps({
  label: {
    type: String,
    default: "location"
  },
  location: {
    type: Object,
    required: true
  },
  showLabel: {
    type: Boolean,
    default: false}
})
</script>

<template>
  <div class="location-course">
    <div class="location">
      {{location.city}}, {{location.state}}
    </div>
    <div class="label" v-if="showLabel">
      {{ label }}
    </div>
  </div>
</template>

<style scoped>
.label {
  font-size: 0.8rem;
  text-transform: uppercase;
}
.location-course {
  margin-top: 1.5rem;
  margin-bottom: 2rem;
  text-align: center;
}
.location {
  font-size: 1.25rem;
}
</style>
