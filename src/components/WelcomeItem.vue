<template>
  <div class="welcome-item">
    <i>
      <slot name="icon"></slot>
    </i>
    <div class="welcome-details">
      <h2>
        <slot name="heading"></slot>
      </h2>
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
</style>
