<script setup>
const props = defineProps({
  routes: {
    type: Array,
    default: null
  }
})
</script>

<template>
  <div class="list-routes">
    <div v-if="props.routes && props.routes.length > 0" class="routes">
      <ul v-for="route in props.routes" class="footer-links" :key="route._id">
        <li>
          <i v-if="route.icon" :class="route.icon"></i><router-link :to="{ name: route.name }">{{ route.anchor }}</router-link>
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

.routes {
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
