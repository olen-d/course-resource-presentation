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
    type: Number,
    required: true
  }
})
</script>

<template>
  <div class="statistic">
    <div class="value">
      {{ value }}
    </div>
    <div class="label" v-if="showLabel">
      {{ label }}
    </div>
  </div>
</template>

<style scoped>
.statistic {
  margin-bottom: 1rem;
}

.value {
  color: #999;
  font-size: 2rem;
}

.label {
  font-size: 0.8rem;
  text-transform: uppercase;
}
</style>
