<script setup>
const props = defineProps({
  links: {
    type: Array,
    default: null
  }
})
</script>

<template>
  <div class="list-links">
    <div v-if="props.links && props.links.length > 0" class="links">
      <ul v-for="link in props.links" class="footer-links" :key="link._id">
        <li>
          <i v-if="link.icon" :class="link.icon"></i><a :href="link.uri">{{ link.anchor }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
a {
  padding: 0.3rem;
}

a:link {
  color: #ccc;
  text-decoration: none;
}

a:visited {
  color: #ccc;
}

a:hover {
  color: #fff;
  background: rgba(255, 107, 37, 0.3);
}

.links {
  font-size: 1.1rem;
}

i {
  padding-right: 1rem;
}

ul {
  padding-left: 0rem;
  list-style-type: none;
}
</style>
