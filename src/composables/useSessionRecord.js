import { onMounted, onUnmounted, ref } from 'vue'

export function useSessionRecord () {
  const [{ domInteractive, fetchStart, redirectStart, responseEnd }] = performance.getEntriesByType('navigation')

  const sessionId = crypto.randomUUID()
  const sessionStartTime = Date.now()
  const referrer = document.referrer
  const device = null
  const userAgent = window.navigator.userAgent
  const language = window.navigator.language
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const latency = responseEnd - fetchStart
  const pageLoad = domInteractive - redirectStart

  const isSaved = ref(false)
  const timeStart = ref(0)

  sessionStorage.setItem('laSessionId', sessionId)

  if (document.visibilityState === 'visible' ) { timeStart.value = Date.now() }

  async function handleVisibilitychange() {
    if (document.visibilityState === 'visible') {
      timeStart.value = Date.now()
    } else if (document.visibilityState === 'hidden') {
      const timeVisible = (Date.now() - timeStart.value) / 1000
      if (timeVisible >= 8 && !isSaved.value) {
        try {
          const data = {
            device,
            language,
            latency,
            pageLoad,
            referrer,
            sessionId,
            sessionStartTime,
            timezone,
            userAgent
          }
          const response = await fetch(`${import.meta.env.VITE_ANALYTICS_API_BASE_URL}/v1/sessions`, {
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
    }
  }

  onMounted(() => {
    document.addEventListener(
      'visibilitychange',
      handleVisibilitychange
    )
  })

  onUnmounted(() => {
    document.removeEventListener(
      'visibilitychange',
      handleVisibilitychange
    )
  })
}
