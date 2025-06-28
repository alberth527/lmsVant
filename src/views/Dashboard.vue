<template>
    <div class="dashboard">
        <van-nav-bar title="會員中心" right-text="登出" @click-right="handleLogout" />

        <!-- 用戶資訊卡片 -->
        <div class="user-info">
            <van-card>
                <template #thumb>
                    <van-icon name="user-circle-o" size="60" color="#1989fa" />
                </template>
                <template #title>
                    <div class="user-name">{{ userStore.userInfo.username }}</div>
                </template>
                <template #desc>
                    <div class="user-id">會員等級：黃金會員</div>
                </template>
            </van-card>
        </div>

        <!-- 點數資訊 -->
        <div class="points-section">
            <van-cell-group title="我的點數">
                <van-cell>
                    <template #title>
                        <div class="points-info">
                            <van-icon name="gold-coin-o" size="24" color="#ff9500" />
                            <span class="points-label">目前點數</span>
                        </div>
                    </template>
                    <template #value>
                        <div class="points-value">{{ userStore.userInfo.points.toLocaleString() }}</div>
                    </template>
                </van-cell>
            </van-cell-group>
        </div>

        <!-- 功能選單 -->
        <div class="menu-section">
            <van-cell-group title="功能選單">
                <van-cell title="兌換商品" is-link @click="$router.push('/products')">
                    <template #icon>
                        <van-icon name="gift-o" size="20" color="#07c160" />
                    </template>
                </van-cell>
                <van-cell title="兌換紀錄" is-link @click="$router.push('/history')">
                    <template #icon>
                        <van-icon name="orders-o" size="20" color="#1989fa" />
                    </template>
                </van-cell>
            </van-cell-group>
        </div>

        <!-- 快速兌換推薦 -->
        <div class="recommend-section">
            <van-cell-group title="推薦兌換">
                <div class="recommend-grid">
                    <div v-for="product in recommendProducts" :key="product.id" class="recommend-item"
                        @click="$router.push(`/exchange/${product.id}`)">
                        <img :src="product.image" :alt="product.name" />
                        <div class="recommend-info">
                            <div class="recommend-name">{{ product.name }}</div>
                            <div class="recommend-points">{{ product.points }} 點</div>
                        </div>
                    </div>
                </div>
            </van-cell-group>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useProductStore } from '../stores/products'
import { showConfirmDialog, showNotify } from 'vant'

const router = useRouter()
const userStore = useUserStore()
const productStore = useProductStore()

// 推薦商品（點數較低的前4個）
const recommendProducts = computed(() => {
    return productStore.products
        .filter(p => p.stock > 0)
        .sort((a, b) => a.points - b.points)
        .slice(0, 4)
})

const handleLogout = () => {
    showConfirmDialog({
        title: '確認登出',
        message: '確定要登出嗎？',
    }).then(() => {
        userStore.logout()
        showNotify({ type: 'success', message: '已登出' })
        router.push('/login')
    }).catch(() => {
        // 取消操作
    })
}
</script>

<style scoped>
.dashboard {
    min-height: 100vh;
    background-color: #f7f8fa;
}

.user-info {
    padding: 16px;
    background: white;
    margin-bottom: 8px;
}

.user-name {
    font-size: 18px;
    font-weight: 600;
    color: #323233;
}

.user-id {
    font-size: 14px;
    color: #969799;
    margin-top: 4px;
}

.points-section {
    margin-bottom: 8px;
}

.points-info {
    display: flex;
    align-items: center;
    gap: 8px;
}

.points-label {
    font-size: 16px;
    color: #323233;
}

.points-value {
    font-size: 20px;
    font-weight: 600;
    color: #ff9500;
}

.menu-section {
    margin-bottom: 8px;
}

.recommend-section {
    margin-bottom: 16px;
}

.recommend-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    padding: 16px;
}

.recommend-item {
    background: white;
    border-radius: 8px;
    padding: 12px;
    text-align: center;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: transform 0.2s;
}

.recommend-item:active {
    transform: scale(0.98);
}

.recommend-item img {
    width: 60px;
    height: 60px;
    border-radius: 6px;
    margin-bottom: 8px;
}

.recommend-name {
    font-size: 14px;
    color: #323233;
    margin-bottom: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.recommend-points {
    font-size: 12px;
    color: #ff9500;
    font-weight: 600;
}
</style>