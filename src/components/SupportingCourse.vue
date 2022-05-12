<script setup>
const props = defineProps({
  content: {
    type: String,
    required: true
  },
    icon: {
    type: String,
    default: "fa-solid fa-arrow-right",
  },
  label: {
    type: String,
    default: "label",
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
  <div class="supporting-course">
    <div class="heading" v-if="showIcon || showLabel">
      <i v-if="showIcon" :class="icon"></i>
      <span v-if="showIcon && showLabel">&nbsp;</span>
      <span class="label" v-if="showLabel">
        {{ label }}
      </span>
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

.heading {
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
  .heading {
    text-align: center;
  }
} 
</style>
