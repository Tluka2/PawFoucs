export function useNotification() {
  function sendNotification(title: string, body: string) {
    try {
      if (!('Notification' in window)) return
      if (Notification.permission === 'granted') {
        new Notification(title, { body })
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((perm) => {
          if (perm === 'granted') {
            new Notification(title, { body })
          }
        })
      }
    } catch {
      // Notification API not available, silent fallback
    }
  }

  return { sendNotification }
}
