<script setup>
import { useSlots } from 'vue'

import { NCollapse, NCollapseItem } from 'naive-ui'

const props = defineProps({

})

const slots = useSlots()

</script>
<template>
  <div class="news-item">
    <i>
      <slot name="icon"></slot>
    </i>
    <div class="news-headline" v-if="slots.headline">
      <h2>
        <slot name="headline"></slot>
      </h2>
    </div>
    <div class="news-published" v-if="slots.published">
      <slot name="published"></slot>
    </div>
    <div class="news-brief" v-if="slots.brief">
      <slot name="brief"></slot>
    </div>
    <div class="news-article-wrapper" v-if="slots.default">
      <n-collapse arrow-placement="right">
        <n-collapse-item title="Read more" name="1">
          <div class="news-article">
            <slot></slot>
          </div>
        </n-collapse-item>
      </n-collapse>
    </div>
  </div>
</template>

<style scoped>
.news-brief {
  margin-bottom: 0.5rem;
}
.news-headline h2 {
  margin-bottom: 0.5rem;
}
.news-published {
  margin-bottom: 0.5rem;
  color: #8f8f8f;
}
</style>
