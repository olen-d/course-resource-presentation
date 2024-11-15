<script setup>
const props = defineProps({
  advisories: {
    type: Array
  },
  icon: {
    type: String,
    default: "fa-solid fa-arrow-right",
  },
  showIcon: {
    type: Boolean,
    default: false
  },
})
</script>

<template>
  <div class="course-advisory">
    <h3>
      <i :class="icon"></i> Closures
    </h3>
    <div class="course-advisory-information" v-for="{_id, facility, from, to, condition, startDate, endDate, isPublished} in advisories" :key=_id>
      <div class="course-advisory-information-headline">
        {{ facility }}
        {{ to ? ' from ' : 'at' }}
        {{ from  }}
        {{ to && ' to ' }}
        {{ to }}
      </div>
      <div class="course-advisory-information-label">
        {{ condition }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.course-advisory {
  text-align: center;
}

.course-advisory h3 {
  font-size: 1.5rem;
  font-weight: 500;
  text-transform: uppercase;
  color: #ff6b25;
}

.course-advisory-information {
  margin-bottom: 2rem;
}
.course-advisory-information-headline {
  font-size: 1rem;

}

.course-advisory-information-label {
  font-size: 0.8rem;
  text-transform: uppercase;
}
</style>
