import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useNotificationStore } from './notification.store'

describe('useNotificationStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('ajoute une notification avec un id généré', () => {
    const store = useNotificationStore()
    store.addNotification({ type: 'success', message: 'OK' })
    expect(store.notifications).toHaveLength(1)
    expect(store.notifications[0]).toMatchObject({ type: 'success', message: 'OK' })
    expect(store.notifications[0].id).toBeTruthy()
  })

  it('empile plusieurs notifications distinctes', () => {
    const store = useNotificationStore()
    store.addNotification({ type: 'success', message: 'Un' })
    store.addNotification({ type: 'error', message: 'Deux' })
    expect(store.notifications).toHaveLength(2)
  })

  it('retire une notification par id', () => {
    const store = useNotificationStore()
    store.addNotification({ type: 'info', message: 'Test' })
    const id = store.notifications[0].id
    store.removeNotification(id)
    expect(store.notifications).toHaveLength(0)
  })

  it('auto-supprime la notification après 5 secondes', () => {
    const store = useNotificationStore()
    store.addNotification({ type: 'warning', message: 'Expire' })
    expect(store.notifications).toHaveLength(1)
    vi.advanceTimersByTime(5000)
    expect(store.notifications).toHaveLength(0)
  })
})
