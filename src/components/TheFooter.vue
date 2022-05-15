<script setup>
import { onMounted, ref } from 'vue'

import ContentFooter from '@/components/ContentFooter.vue'

import { NGrid, NGridItem } from "naive-ui"

// Get the links
const links = ref([])
const linksInspiration = ref([])
const linksSocial = ref([])

onMounted(async () => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/links`)
  const result = await response.json()
  const { status } = response

  if (status === 200) {
    const { data } = result

    const filtered = data.map(element => {
      return (({ _id: key, anchor, uri, icon, category, order }) => ({ key, anchor, uri, icon, category, order }))(element)
    })
    links.value.push(...filtered)

    const filteredInspiration = filtered.filter(element => { return element.category === 'inspiration' })
    linksInspiration.value.push(...filteredInspiration)

    const filteredSocial = filtered.filter(element => { return element.category === 'socialMedia' })
    linksSocial.value.push(...filteredSocial)
  }
})

const contentSite = "Bringing the freshest quality gravel and mixed-surface routes to bicycle riders in North Carolina and the southeast since 2022."

// const linksInspiration = [
//   { anchor: 'Gravel Happens', icon: 'fa-solid fa-link', URI: 'http://www.gravelhappens.com/' },
//   { anchor: 'Rollin\' Appalachia', icon: 'fa-solid fa-link', URI: 'https://ridewithgps.com/ambassadors/247-rollin-appalachia' },
//   { anchor: 'Southeast Cycling Routes', icon: 'fa-solid fa-link', URI: 'https://southeastcyclingroutes.com/' }
// ]

const linksSite = [
  { anchor: 'Contact', icon: 'fa-solid fa-envelope', URI: '#' },
  { anchor: 'GitHub', icon: 'fa-brands fa-github', URI: 'https://github.com/olen-d/course-resource-presentation' }
]
</script>

<template>
  <div class="footer">
    <n-grid x-gap="12" y-gap="12" cols="16" :item-responsive=true responsive="screen">
      <n-grid-item :offset="1" span="16 m:4">
        <ContentFooter
          :content="contentSite"
          label="No. Car. Gravel."
          :links="linksSite"
          :showLabel="true"
        />
      </n-grid-item>
      <n-grid-item :offset="1" span="16 m:4">
        <ContentFooter
          label="Follow"
          :links="linksSocial"
          :showLabel="true"
        />
      </n-grid-item>
      <n-grid-item :offset="1" span="16 m:4">
        <ContentFooter
          label="Inspiration"
          :links="linksInspiration"
          :showLabel="true"
        />
      </n-grid-item>
      <n-grid-item :offset="1" span="14">
        <div class="footer-copyright">
          Copyright &copy; 2022 <a href="https://www.olen.dev">Olen Daelhousen</a>
        </div>
      </n-grid-item>
    </n-grid>
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

.footer {
  margin-top: 5rem;
  background-color: #444;
  color: #ccc;
}

.footer-copyright {
  padding-top: 2rem;
  margin-bottom: 3rem;
  border-top: 1px solid #555;
  font-size: 1.1rem;
  text-align: center;
}
</style>
