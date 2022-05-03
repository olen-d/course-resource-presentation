<script setup>
const props = defineProps({
  label: {
    type: String,
    default: "label"
  },
  showLabel: {
    type: Boolean,
    default: false
  },
  value: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="meta-course">
    <div class="value">
      {{ value }}
    </div>
    <div class="label" v-if="showLabel">
      {{ label }}
    </div>
  </div>
</template>

<style scoped>
.meta-course {
  margin-bottom: 1rem;
}

.value {
  font-size: 1rem;
  text-transform: capitalize;
}
.label {
  font-size: 0.8rem;
  text-transform: uppercase;
}
</style>
