import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useExchangeStore = defineStore('exchange', () => {
  const exchangeHistory = ref([])

  const addExchange = (exchange) => {
    const newExchange = {
      id: Date.now(),
      ...exchange,
      date: new Date().toISOString()
    }
    exchangeHistory.value.unshift(newExchange)
  }

  const getExchangeHistory = () => {
    return exchangeHistory.value
  }

  return {
    exchangeHistory,
    addExchange,
    getExchangeHistory
  }
})
