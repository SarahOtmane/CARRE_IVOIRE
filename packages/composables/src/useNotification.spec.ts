import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useNotification } from './useNotification'

describe('useNotification', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('expose un tableau de notifications vide par défaut', () => {
    const { notifications } = useNotification()
    expect(notifications).toHaveLength(0)
  })

  it('success() ajoute une notification de type success', () => {
    const { success, notifications } = useNotification()
    success('Opération réussie !')
    expect(notifications).toHaveLength(1)
    expect(notifications[0].type).toBe('success')
    expect(notifications[0].message).toBe('Opération réussie !')
  })

  it('error() ajoute une notification de type error', () => {
    const { error, notifications } = useNotification()
    error('Une erreur est survenue.')
    expect(notifications).toHaveLength(1)
    expect(notifications[0].type).toBe('error')
    expect(notifications[0].message).toBe('Une erreur est survenue.')
  })

  it('warning() ajoute une notification de type warning', () => {
    const { warning, notifications } = useNotification()
    warning('Attention !')
    expect(notifications).toHaveLength(1)
    expect(notifications[0].type).toBe('warning')
  })

  it('info() ajoute une notification de type info', () => {
    const { info, notifications } = useNotification()
    info('Information.')
    expect(notifications).toHaveLength(1)
    expect(notifications[0].type).toBe('info')
  })

  it('plusieurs notifications peuvent être empilées', () => {
    const { success, error, notifications } = useNotification()
    success('msg1')
    error('msg2')
    expect(notifications).toHaveLength(2)
  })

  it('partage le store entre deux appels à useNotification()', () => {
    const a = useNotification()
    const b = useNotification()
    a.success('partagé')
    expect(b.notifications).toHaveLength(1)
  })
})
