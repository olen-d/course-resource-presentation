import { onMounted, onUnmounted, ref, watchEffect } from 'vue'

export function useTrackTimeOnPage (isLeavingRoute, routePath, routeTitle) {
  const sessionId = sessionStorage.getItem('laSessionId')

  const isSaved = ref(false)
  const timeStart = ref(0)

  if (document.visibilityState === 'visible' ) { timeStart.value = Date.now() }

  const handleVisibilityChange = async () => {
    if (document.visibilityState === 'visible') {
      timeStart.value = Date.now()
      isSaved.value = false
    } else if (document.visibilityState === 'hidden') {
      const timeOnPage = Date.now() - timeStart.value
      if (timeOnPage >= 8000) {
        createPageRecord(timeOnPage)
      } 
    }
  }

  const createPageRecord = async timeOnPage => {
    try {
      const data = {
        'route': routePath,
        'pageName': routeTitle,
        'pageStartTime': timeStart.value,
        sessionId,
        timeOnPage
      }

      const response = await fetch(`${import.meta.env.VITE_ANALYTICS_API_BASE_URL}/v1/pages`, {
        keepalive: true,
        method: 'POST',
        headers: {
          'api-key': import.meta.env.VITE_ANALYTICS_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()
      const { status } = response

      if (status === 200 && result.status === 'ok') {
        isSaved.value = true
      } else {
        isSaved.value = false
      }
    } catch (error) {
      console.log(error)
    }
  }

  watchEffect(() => {
    if (isLeavingRoute.value) {
      const timeOnPage = Date.now() - timeStart.value
      if (timeOnPage >= 8000 && !isSaved.value) { createPageRecord(timeOnPage) }
    }
  })

  onMounted(() => {
    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange
    )
  })

  onUnmounted(() => {
    document.removeEventListener(
      'visibilitychange',
      handleVisibilityChange
    )
  })
}
