<script setup>
const props = defineProps({
  content: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: "label"
  },
  showLabel: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div class="summary-course">
    <div class="label" v-if="showLabel">
      {{ label }}
    </div>
    <div class="content" v-html="content"></div>
  </div>
</template>

<style scoped>
:deep(h3) {
  font-weight: 500;
  letter-spacing: 0.1rem;
  text-align: left;
  text-transform: uppercase;
  color: #ff6b25;
}

.summary-course {
  margin-top: 4rem;
}

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
  .content {
    column-count: 2;
    column-gap: 12px;
    orphans: 2;
  }
} 
</style>
