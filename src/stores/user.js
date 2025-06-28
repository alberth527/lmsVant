import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const isLoggedIn = ref(false)
  const userInfo = ref({
    username: '',
    points: 0
  })
  const exchangeHistory = ref([])

  // 假登入數據
  const mockUsers = {
    'test1': { username: '張小明', points: 1500 },
    'test2': { username: '李小華', points: 2000 },
    'admin': { username: '管理員', points: 5000 }
  }

  const login = (username, password) => {
    // 簡易驗證邏輯
    if (mockUsers[username] && password === '123456') {
      isLoggedIn.value = true
      userInfo.value = { ...mockUsers[username] }
      
      // 添加一些測試兌換紀錄
      exchangeHistory.value = [
        {
          id: 1,
          productName: '星巴克咖啡券',
          points: 300,
          productImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=150&h=150&fit=crop&crop=center',
          type: 'exchange',
          date: '2024/12/28 14:30:00'
        },
        {
          id: 2,
          productName: '全家便利商店100元券',
          points: 200,
          productImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=150&h=150&fit=crop&crop=center',
          type: 'exchange',
          date: '2024/12/27 10:15:00'
        }
      ]
      
      return true
    }
    return false
  }

  const logout = () => {
    isLoggedIn.value = false
    userInfo.value = { username: '', points: 0 }
    exchangeHistory.value = []
  }

  const deductPoints = (points) => {
    if (userInfo.value.points >= points) {
      userInfo.value.points -= points
      return true
    }
    return false
  }

  const addExchangeRecord = (record) => {
    exchangeHistory.value.unshift({
      ...record,
      id: Date.now(),
      date: new Date().toLocaleString('zh-TW')
    })
  }

  return {
    isLoggedIn,
    userInfo,
    exchangeHistory,
    login,
    logout,
    deductPoints,
    addExchangeRecord
  }
})