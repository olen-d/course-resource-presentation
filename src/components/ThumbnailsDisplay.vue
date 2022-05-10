<script setup>
import { NGrid, NGridItem } from 'naive-ui'

const emits = defineEmits(['emitThumbnailClick'])

const props = defineProps({
  filesImage: {
    type: Array,
    required: true
  },
  thumbPath: {
    type: String,
    required: true
  },
  thumbPrefix: {
    type: String,
    required: true
  }
})

const getThumbURI = fileImage => {
  return `${import.meta.env.VITE_IMAGES_HOST}/${props.thumbPath}/${props.thumbPrefix}${fileImage}`
}

const handleThumbnailClick = index => {
  emits('emitThumbnailClick', index)
}

</script>

<template>
  <div class="thumbnails-display">
    <n-grid x-gap="12" y-gap="12" :cols="24" :item-responsive=true responsive="screen">
      <n-grid-item v-for="(file, index) in props.filesImage" :key="file" span="12 s:8 m:6">
        <img :src="getThumbURI(file)" @click="handleThumbnailClick(index)" />
      </n-grid-item>
    </n-grid>
  </div>
</template>

<style scoped>
img {
  width: 100%;
  object-position: center;
  object-fit: cover;
}

.thumbnails-display {
  margin-top: 4rem;
}
</style>
