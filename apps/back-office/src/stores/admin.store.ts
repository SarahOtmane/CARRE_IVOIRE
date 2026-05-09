import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import {
    createAdminSeedState,
    loadAdminState,
    saveAdminState,
    resetAdminState,
    type AdminState,
} from '@/data/admin'

export const useAdminStore = defineStore('admin', () => {
    const state = ref<AdminState>(loadAdminState())

    const counts = computed(() => ({
        categories: state.value.categories.length,
        products: state.value.products.filter((product) => product.status !== 'archived').length,
        orders: state.value.orders.length,
        customers: state.value.customers.length,
        lowStock: state.value.products.filter((product) => product.stock < 10).length,
        newOrders: state.value.orders.filter((order) => order.status === 'Nouvelle').length,
    }))

    function setState(nextState: AdminState) {
        state.value = nextState
        saveAdminState(nextState)
    }

    function resetState() {
        const nextState = resetAdminState()
        state.value = nextState
    }

    function ensureSeed() {
        if (!state.value.products.length) {
            setState(createAdminSeedState())
        }
    }

    return {
        state,
        counts,
        setState,
        resetState,
        ensureSeed,
    }
})