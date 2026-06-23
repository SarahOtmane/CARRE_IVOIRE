import { useApi } from './useApi'
import { useLoading } from './useLoading'
import { useNotification } from './useNotification'

export function useNewsletter() {
  const api = useApi()
  const { isLoading, withLoading } = useLoading()
  const { success } = useNotification()

  const subscribe = (email: string) =>
    withLoading(async () => {
      // Les erreurs sont déjà notifiées par l'intercepteur useApi — on ne gère que le succès
      await api.post('/newsletter/subscribe', { email })
      success('Merci, votre inscription est confirmée.')
    })

  return { isLoading, subscribe }
}
