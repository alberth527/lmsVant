<template>
  <div class="exchange-history">
    <van-nav-bar 
      title="兌換紀錄" 
      left-arrow 
      @click-left="$router.back()"
    />

    <div class="content">
      <!-- 統計資訊 -->
      <div class="stats-section">
        <van-cell-group title="兌換統計">
          <van-cell title="總兌換次數" :value="exchangeHistory.length" />
          <van-cell title="總消耗點數" :value="totalPointsUsed.toLocaleString()" />
          <van-cell title="目前剩餘點數" :value="(userStore.userInfo.points || 0).toLocaleString()" />
        </van-cell-group>
      </div>

      <!-- 篩選選項 -->
      <div class="filter-section">
        <van-tabs v-model:active="activeTab">
          <van-tab title="全部" name="all"></van-tab>
          <van-tab title="處理中" name="processing"></van-tab>
          <van-tab title="已完成" name="completed"></van-tab>
        </van-tabs>
      </div>

      <!-- 兌換紀錄列表 -->
      <div class="history-list">
        <div v-if="filteredHistory.length === 0" class="empty-state">
          <van-empty description="暫無兌換紀錄" />
          <van-button type="primary" @click="$router.push('/products')">
            立即兌換
          </van-button>
        </div>

        <div v-else>
          <van-card
            v-for="record in filteredHistory"
            :key="record.id"
            :thumb="record.productImage"
            :title="record.productName"
            :desc="formatDate(record.date)"
            class="history-item"
          >
            <template #tags>
              <van-tag 
                type="success"
                class="status-tag"
              >
                兌換成功
              </van-tag>
            </template>
            
            <template #footer>
              <div class="record-footer">
                <div class="points-info">
                  <van-icon name="gold-coin-o" size="16" color="#ff9500" />
                  <span class="points-text">{{ record.points }} 點</span>
                </div>
                <div class="record-time">
                  {{ formatTime(record.date) }}
                </div>
              </div>
            </template>
          </van-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

const activeTab = ref('all')

const exchangeHistory = computed(() => {
  return userStore.exchangeHistory || []
})

const filteredHistory = computed(() => {
  if (activeTab.value === 'all') {
    return exchangeHistory.value
  }
  return exchangeHistory.value.filter(record => {
    if (activeTab.value === 'processing') {
      return record.status === '處理中'
    }
    if (activeTab.value === 'completed') {
      return record.status === '已完成'
    }
    return true
  })
})

const totalPointsUsed = computed(() => {
  return exchangeHistory.value.reduce((total, record) => total + (record.points || 0), 0)
})

const getStatusType = (status) => {
  switch (status) {
    case '處理中': return 'warning'
    case '已完成': return 'success'
    case '已取消': return 'danger'
    default: return 'default'
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const formatTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('zh-TW', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 模擬一些兌換紀錄變成已完成狀態
onMounted(() => {
  // 模擬部分舊紀錄已完成
  setTimeout(() => {
    const history = exchangeStore.exchangeHistory
    if (history.length > 1) {
      // 將第二筆之後的紀錄設為已完成
      for (let i = 1; i < history.length; i++) {
        history[i].status = '已完成'
      }
    }
  }, 2000)
})
</script>

<style scoped>
.exchange-history {
  min-height: 100vh;
  background-color: #f7f8fa;
}

.content {
  padding-bottom: 16px;
}

.stats-section {
  margin-bottom: 8px;
}

.filter-section {
  background: white;
  margin-bottom: 8px;
}

.history-list {
  padding: 0 16px;
}

.empty-state {
  padding: 40px 0;
  text-align: center;
}

.empty-state .van-button {
  margin-top: 16px;
}

.history-item {
  margin-bottom: 12px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.status-tag {
  margin-bottom: 8px;
}

.record-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.points-info {
  display: flex;
  align-items: center;
  gap: 4px;
}

.points-text {
  font-size: 14px;
  font-weight: 600;
  color: #ff9500;
}

.record-time {
  font-size: 12px;
  color: #969799;
}

:deep(.van-card__thumb) {
  width: 60px;
  height: 60px;
  border-radius: 6px;
}

:deep(.van-card__title) {
  font-size: 16px;
  font-weight: 600;
}

:deep(.van-card__desc) {
  font-size: 14px;
  color: #969799;
}
</style>
