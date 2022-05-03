<template>
  <div class="abpit=item">
    <div class="about-details">
      <h2>
        <slot name="heading"></slot>
      </h2>
      <slot name="details"></slot>
    </div>
  </div>
</template>

<style scoped>
:deep(ul) {
  padding-left: 0rem;
  list-style-type: none;
}
</style>
