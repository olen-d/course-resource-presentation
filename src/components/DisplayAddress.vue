<script setup>
import LocationCourseShowGoogleMaps from '@/components/LocationCourseShowGoogleMaps.vue'

const props = defineProps({
  icon: {
    type: String,
    default: "fa-solid fa-arrow-right",
  },
  label: {
    type: String,
    default: "label",
  },
  location: {
    type: Object,
    required: true
  },
  showCoordinates: {
    type: Boolean,
    default: true
  },
    showIcon: {
    type: Boolean,
    default: false
  },
    showLabel: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div class="display-address">
    <div class="heading" v-if="showIcon || showLabel">
      <h3>
        <i v-if="showIcon" :class="icon"></i>
        <span v-if="showIcon && showLabel">&nbsp;</span>
        <span class="label" v-if="showLabel">
          {{ label }}
        </span>
      </h3>
    </div>
    {{ location.address }}<br />
    {{ location.city }},&nbsp;{{ location.state }}&nbsp;{{ location.postcode }}
    <div class="coordinates">
      {{ location.latitude }}, {{ location.longitude }}
    </div>
    <LocationCourseShowGoogleMaps :latitude="location.latitude" :longitude ="location.longitude" />
  </div>
</template>

<style scoped>
.display-address {
  font-size: 1.1rem;
}

.coordinates {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.heading h3 {
  font-weight: 500;
  text-transform: uppercase;
  color: #ff6b25;
}

@media (min-width: 1024px) {
  .heading h3 {
    text-align: left;
  }
} 
</style>
