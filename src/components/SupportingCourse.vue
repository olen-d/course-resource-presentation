<script setup>
const props = defineProps({
  content: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: "label",
  },
  showLabel: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div class="supporting-course">
    <div class="label" v-if="showLabel">
      {{ label }}
    </div>
    <div class="content">
      {{ content }}
    </div>
  </div>
</template>

<style scoped>
.content {
  font-size: 1.1rem;
}

.label {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
  font-weight: 500;
  letter-spacing: 0.1rem;
  text-align: left;
  text-transform: uppercase;
  color: #ff6b25;
}

.supporting-course {
  padding-top: 1.5rem;
}

@media (min-width: 1024px) {
  .label {
    text-align: center;
  }
} 
</style>
