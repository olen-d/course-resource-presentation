<script setup>
import { ref } from 'vue'

const props = defineProps({
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  }
})

const uri = ref('')

uri.value= encodeURI(`https://www.google.com/maps/search/?api=1&query=${props.latitude},${props.longitude}`)
</script>

<template>
  <div class="location-course-show-google-maps">
    <a :href="uri">
      <i class="fa-solid fa-map-location-dot"></i> Show on Google Maps
    </a>
  </div>
</template>

<style scoped>
a {
  padding: 0.3rem;
}

a:link {
  color: #ff6b25;
  text-decoration: none;
}

a:visited {
  color: #ff6b25;
}

a:hover {
  color: #fff;
  background: rgba(255, 107, 37, 0.6);
}

.location-course-show-google-maps {
  margin-bottom: 0.3rem;
  margin-left: -0.3rem;
}

</style>
