<template>
  <div class="exchange-confirm">
    <van-nav-bar 
      title="兌換確認" 
      left-arrow 
      @click-left="$router.back()"
    />

    <div v-if="loading" class="loading-state">
      <van-loading size="24px" vertical>載入中...</van-loading>
    </div>

    <div v-else-if="product" class="content">
      <!-- 商品資訊 -->
      <div class="product-section">
        <van-card>
          <template #thumb>
            <img :src="product.image" :alt="product.name" class="product-thumb" />
          </template>
          <template #title>
            <div class="product-title">{{ product.name }}</div>
          </template>
          <template #desc>
            <div class="product-description">{{ product.description }}</div>
          </template>
          <template #tags>
            <van-tag type="warning">{{ product.points }} 點</van-tag>
            <van-tag v-if="product.stock > 0" type="success">庫存：{{ product.stock }}</van-tag>
            <van-tag v-else type="danger">缺貨</van-tag>
          </template>
        </van-card>
      </div>

      <!-- 用戶點數資訊 -->
      <div class="points-section">
        <van-cell-group title="點數資訊">
          <van-cell title="目前點數" :value="(userStore.userInfo.points || 0).toLocaleString()" />
          <van-cell title="所需點數" :value="(product.points || 0).toLocaleString()" />
          <van-cell 
            title="兌換後剩餘" 
            :value="remainingPoints.toLocaleString()"
            :value-class="remainingPoints < 0 ? 'negative-points' : 'positive-points'"
          />
        </van-cell-group>
      </div>

      <!-- 兌換須知 -->
      <div class="notice-section">
        <van-cell-group title="兌換須知">
          <van-cell>
            <div class="notice-content">
              <p>• 兌換後點數將立即扣除，無法退回</p>
              <p>• 兌換商品將於3-5個工作天內寄送</p>
              <p>• 如有問題請聯繫客服：0800-123-456</p>
              <p>• 兌換紀錄可在「兌換紀錄」中查看</p>
            </div>
          </van-cell>
        </van-cell-group>
      </div>

      <!-- 兌換按鈕 -->
      <div class="exchange-button">
        <van-button 
          type="primary" 
          block 
          size="large"
          :disabled="!canExchange"
          :loading="exchanging"
          @click="handleExchange"
        >
          {{ exchangeButtonText }}
        </van-button>
      </div>
    </div>

    <div v-else class="error-state">
      <van-empty description="商品不存在" />
      <van-button type="primary" @click="$router.push('/products')">
        返回商品列表
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useProductStore } from '../stores/products'
import { showConfirmDialog, showNotify, showSuccessToast } from 'vant'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const productStore = useProductStore()

const product = ref(null)
const exchanging = ref(false)
const loading = ref(true)

const remainingPoints = computed(() => {
  if (!product.value) return 0
  return (userStore.userInfo.points || 0) - (product.value.points || 0)
})

const canExchange = computed(() => {
  if (!product.value) return false
  return product.value.stock > 0 && (userStore.userInfo.points || 0) >= (product.value.points || 0)
})

const exchangeButtonText = computed(() => {
  if (!product.value) return '載入中...'
  if (product.value.stock === 0) return '商品缺貨'
  if ((userStore.userInfo.points || 0) < (product.value.points || 0)) return '點數不足'
  return `確認兌換 (${product.value.points} 點)`
})

const handleExchange = () => {
  showConfirmDialog({
    title: '確認兌換',
    message: `確定要用 ${product.value.points} 點兌換「${product.value.name}」嗎？`,
    confirmButtonText: '確認兌換',
    cancelButtonText: '取消'
  }).then(() => {
    performExchange()
  }).catch(() => {
    // 用戶取消
  })
}

const performExchange = async () => {
  exchanging.value = true
  
  try {
    // 模擬 API 請求延遲
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 扣除點數
    const success = userStore.deductPoints(product.value.points)
    
    if (success) {
      // 減少庫存
      if (productStore.updateProductStock) {
        productStore.updateProductStock(product.value.id, product.value.stock - 1)
      }
      
      // 新增兌換紀錄
      userStore.addExchangeRecord({
        productName: product.value.name,
        points: product.value.points,
        productImage: product.value.image,
        type: 'exchange'
      })
      
      showSuccessToast('兌換成功！')
      
      // 延遲跳轉到兌換紀錄頁面
      setTimeout(() => {
        router.push('/history')
      }, 1500)
    } else {
      showNotify({ type: 'danger', message: '點數不足，兌換失敗' })
    }
  } catch (error) {
    showNotify({ type: 'danger', message: '兌換失敗，請重試' })
  } finally {
    exchanging.value = false
  }
}

onMounted(() => {
  const productId = route.params.id
  console.log('Product ID:', productId) // 調試用
  
  // 模擬載入延遲
  setTimeout(() => {
    product.value = productStore.getProductById(productId)
    console.log('Found product:', product.value) // 調試用
    loading.value = false
    
    if (!product.value) {
      showNotify({ type: 'danger', message: '商品不存在' })
      setTimeout(() => {
        router.back()
      }, 1500)
    }
  }, 500)
})
</script>

<style scoped>
.exchange-confirm {
  min-height: 100vh;
  background-color: #f7f8fa;
}

.content {
  padding-bottom: 100px;
}

.product-section {
  margin-bottom: 8px;
}

.product-thumb {
  width: 80px;
  height: 80px;
  border-radius: 6px;
}

.product-title {
  font-size: 16px;
  font-weight: 600;
  color: #323233;
}

.product-description {
  font-size: 14px;
  color: #969799;
  margin-top: 4px;
}

.points-section {
  margin-bottom: 8px;
}

.negative-points {
  color: #ee0a24 !important;
  font-weight: 600;
}

.positive-points {
  color: #07c160 !important;
  font-weight: 600;
}

.notice-section {
  margin-bottom: 16px;
}

.notice-content p {
  margin: 8px 0;
  font-size: 14px;
  color: #646566;
  line-height: 1.5;
}

.exchange-button {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: white;
  box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.1);
}

.error-state {
  padding: 40px 16px;
  text-align: center;
}

.error-state .van-button {
  margin-top: 16px;
}

.loading-state {
  padding: 100px 16px;
  text-align: center;
}
</style>
