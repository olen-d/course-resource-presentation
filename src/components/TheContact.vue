<script setup>
import FormContact from '@/components/FormContact.vue'

import { NGrid, NGridItem } from 'naive-ui'
</script>

<template>
<n-grid x-gap="24" y-gap="24" :cols="6" :item-responsive=true responsive="screen">
  <n-grid-item span="6 s:3 l:2">
    <FormContact />
  </n-grid-item>
</n-grid>
</template>
