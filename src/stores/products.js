import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProductStore = defineStore('products', () => {
  const products = ref([
    {
      id: 1,
      name: '星巴克咖啡券',
      points: 300,
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=150&h=150&fit=crop&crop=center',
      description: '星巴克任一飲品兌換券，使用期限3個月',
      stock: 50
    },
    {
      id: 2,
      name: '全家便利商店100元券',
      points: 200,
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=150&h=150&fit=crop&crop=center',
      description: '全家便利商店100元商品兌換券',
      stock: 30
    },
    {
      id: 3,
      name: '誠品書店200元券',
      points: 400,
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=150&h=150&fit=crop&crop=center',
      description: '誠品書店200元圖書兌換券',
      stock: 20
    },
    {
      id: 4,
      name: '電影票券',
      points: 500,
      image: 'https://images.unsplash.com/photo-1489599849877-2b6c0e6a3dcc?w=150&h=150&fit=crop&crop=center',
      description: '威秀影城電影票券一張',
      stock: 15
    },
    {
      id: 5,
      name: 'iPad Air',
      points: 15000,
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=150&h=150&fit=crop&crop=center',
      description: 'Apple iPad Air 64GB WiFi版',
      stock: 2
    },
    {
      id: 6,
      name: 'AirPods Pro',
      points: 8000,
      image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=150&h=150&fit=crop&crop=center',
      description: 'Apple AirPods Pro 無線耳機',
      stock: 5
    },
    {
      id: 7,
      name: '7-11購物金500元',
      points: 500,
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=150&h=150&fit=crop&crop=center',
      description: '7-11便利商店購物金，全台門市可使用',
      stock: 100
    },
    {
      id: 8,
      name: 'Netflix月卡',
      points: 400,
      image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=150&h=150&fit=crop&crop=center',
      description: 'Netflix一個月高級方案',
      stock: 25
    }
  ])

  const getProductById = (id) => {
    return products.value.find(product => product.id === parseInt(id))
  }

  const updateProductStock = (id, newStock) => {
    const product = getProductById(id)
    if (product) {
      product.stock = newStock
    }
  }

  return {
    products,
    getProductById,
    updateProductStock
  }
})