<script setup>
import HelloWorld from '@/components/HelloWorld.vue'
import TheFooter from '@/components/TheFooter.vue'
import TheNavBar from '@/components/TheNavBar.vue'

import { useSessionRecord } from '@/composables/useSessionRecord.js'

import { NLayout, NLayoutContent, NLayoutFooter, NLayoutHeader } from 'naive-ui'

useSessionRecord()

</script>

<template>
  <n-layout>
    <n-layout-header>
      <TheNavBar />
    </n-layout-header>
    <n-layout-content>
      <div class="wrapper-content">
        <RouterView />
      </div>
    </n-layout-content>
    <n-layout-footer>
      <TheFooter />
    </n-layout-footer>
  </n-layout>
</template>

<style>
@import "@/assets/base.css";
</style>
