import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import CheckoutForm from '../CheckoutForm.vue'

vi.mock('@carre-ivoire/stores', () => ({
  useAuthStore: () => ({
    user: { firstName: 'Sara', lastName: 'Otmane', email: 'sara@test.fr' },
  }),
  useNotificationStore: () => ({ addNotification: vi.fn() }),
}))

vi.mock('@carre-ivoire/composables', async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual = await importOriginal<typeof import('@carre-ivoire/composables')>()
  return {
    ...actual,
    usePublicSettings: () => ({
      settings: { value: null },
      shippingFlatEuros: () => 8,
      shippingFreeFromEuros: () => 70,
      fetch: vi.fn(),
    }),
  }
})

function mountForm() {
  return mount(CheckoutForm, {
    global: { stubs: { Teleport: true } },
  })
}

async function fillValidForm(wrapper: ReturnType<typeof mountForm>) {
  await wrapper.find('#checkout-address').setValue('29 rue de Vauparfonds')
  await wrapper.find('#checkout-postal-code').setValue('28600')
  await wrapper.find('#checkout-city').setValue('LUISANT')
}

describe('CheckoutForm', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('pré-remplit les champs depuis le store auth', () => {
    const wrapper = mountForm()
    const firstNameInput = wrapper.find('#checkout-first-name').element as HTMLInputElement
    expect(firstNameInput.value).toBe('Sara')
  })

  it('n\'émet pas submit si les champs requis sont vides', async () => {
    const wrapper = mountForm()
    await wrapper.find('form').trigger('submit')
    expect(wrapper.emitted('submit')).toBeUndefined()
  })

  it('affiche des erreurs quand les champs requis sont vides', async () => {
    const wrapper = mountForm()
    await wrapper.find('#checkout-first-name').setValue('')
    await wrapper.find('#checkout-last-name').setValue('')
    await wrapper.find('#checkout-email').setValue('')
    await wrapper.find('form').trigger('submit')
    expect(wrapper.text()).toContain('Prénom requis')
    expect(wrapper.text()).toContain('Nom requis')
    expect(wrapper.text()).toContain('Email invalide')
  })

  it('affiche une erreur si l\'email est invalide', async () => {
    const wrapper = mountForm()
    await wrapper.find('#checkout-email').setValue('pas-un-email')
    await wrapper.find('form').trigger('submit')
    expect(wrapper.text()).toContain('Email invalide')
  })

  it('affiche une erreur si le code postal est invalide', async () => {
    const wrapper = mountForm()
    await wrapper.find('#checkout-address').setValue('29 rue de Vauparfonds')
    await wrapper.find('#checkout-postal-code').setValue('abc')
    await wrapper.find('#checkout-city').setValue('LUISANT')
    await wrapper.find('form').trigger('submit')
    expect(wrapper.text()).toContain('Code postal invalide')
  })

  it('émet submit avec le payload complet si le formulaire est valide', async () => {
    const wrapper = mountForm()
    await fillValidForm(wrapper)
    await wrapper.find('form').trigger('submit')

    const emitted = wrapper.emitted('submit')
    expect(emitted).toBeDefined()
    const payload = (emitted![0] as [Record<string, unknown>])[0]
    expect(payload.firstName).toBe('Sara')
    expect(payload.city).toBe('LUISANT')
    expect(payload.deliveryId).toBe('courier')
    expect(typeof payload.deliveryPrice).toBe('number')
  })

  it('met à jour le mode de livraison sélectionné', async () => {
    const wrapper = mountForm()
    const radioInputs = wrapper.findAll('input[type="radio"]')
    await radioInputs[1].setValue('chrono')
    await fillValidForm(wrapper)
    await wrapper.find('form').trigger('submit')

    const payload = (wrapper.emitted('submit')![0] as [Record<string, unknown>])[0]
    expect(payload.deliveryId).toBe('chrono')
  })
})
