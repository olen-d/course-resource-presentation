<script setup>
import ListLinks from '@/components/ListLinks.vue'
import ListRoutes from '@/components/ListRoutes.vue'

const props = defineProps({
  content: {
    type: [Array, String],
    default: null
  },
  label: {
    type: String,
    default: "label",
  },
  links: {
    type: Array,
    default: null
  },
  routes: {
    type: Array,
    default: null
  },
  showLabel: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div class="content-footer">
    <h2 v-if="showLabel">
      {{ label }}
    </h2>
    <div v-if="props.content" class="content">
      {{ content }}
    </div>
    <ListRoutes :routes="routes" />
    <ListLinks :links="links" />
    <!-- <div v-if="props.links && props.links.length > 0" class="links">
      <ul v-for="link in props.links" class="footer-links" :key="link._id">
        <li>
          <i v-if="link.icon" :class="link.icon"></i><a :href="link.uri">{{ link.anchor }}</a>
        </li>
      </ul>
    </div> -->
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

.content, 
.links {
  font-size: 1.1rem;
}

.content-footer {
  padding-top: 1.5rem;
  color: #ccc;
}

i {
  padding-right: 1rem;
}

ul {
  padding-left: 0rem;
  list-style-type: none;
}

</style>
