<template>
    <div class="product-list">
        <van-nav-bar title="商品兌換" left-arrow @click-left="$router.back()" />

        <!-- 搜尋欄 -->
        <div class="search-section">
            <van-search v-model="searchKeyword" placeholder="搜尋商品" @search="handleSearch" />
        </div>

        <!-- 篩選標籤 -->
        <div class="filter-section">
            <van-tabs v-model:active="activeFilter" @change="handleFilterChange">
                <van-tab title="全部商品" name="all" />
                <van-tab title="低點數" name="low" />
                <van-tab title="高點數" name="high" />
                <van-tab title="熱門" name="popular" />
            </van-tabs>
        </div>

        <!-- 商品列表 -->
        <div class="products-container">
            <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
                <van-list>
                    <div class="product-grid">
                        <div v-for="product in filteredProducts" :key="product.id" class="product-card"
                            @click="viewProduct(product.id)">
                            <div class="product-image">
                                <img :src="product.image" :alt="product.name" />
                                <div v-if="product.stock < 10" class="stock-warning">
                                    僅剩 {{ product.stock }} 件
                                </div>
                            </div>

                            <div class="product-info">
                                <h3>{{ product.name }}</h3>
                                <p class="description">{{ product.description }}</p>
                                <div class="product-footer">
                                    <span class="points">{{ product.points }} 點</span>
                                    <van-button type="primary" size="small"
                                        :disabled="userStore.userInfo.points < product.points"
                                        @click.stop="quickExchange(product)">
                                        {{ userStore.userInfo.points < product.points ? '點數不足' : '立即兌換' }} </van-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </van-list>
            </van-pull-refresh>
        </div>

        <!-- 我的點數顯示 -->
        <div class="points-bar">
            <span>我的點數：{{ userStore.userInfo.points }}</span>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useProductStore } from '../stores/products'
import { showConfirmDialog, showNotify } from 'vant'

const router = useRouter()
const userStore = useUserStore()
const productStore = useProductStore()

const searchKeyword = ref('')
const activeFilter = ref('all')
const refreshing = ref(false)

const filteredProducts = computed(() => {
    let products = [...productStore.products]

    // 搜尋過濾
    if (searchKeyword.value) {
        products = products.filter(product =>
            product.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
            product.description.toLowerCase().includes(searchKeyword.value.toLowerCase())
        )
    }

    // 分類過濾
    switch (activeFilter.value) {
        case 'low':
            products = products.filter(product => product.points <= 500)
            break
        case 'high':
            products = products.filter(product => product.points > 500)
            break
        case 'popular':
            products = products.slice(0, 4) // 假設前4個是熱門商品
            break
    }

    return products
})

const handleSearch = () => {
    // 搜尋功能已在 computed 中實現
}

const handleFilterChange = () => {
    // 篩選功能已在 computed 中實現
}

const onRefresh = () => {
    setTimeout(() => {
        refreshing.value = false
        showNotify({ type: 'success', message: '重新整理完成' })
    }, 1000)
}

const viewProduct = (productId) => {
    router.push(`/exchange/${productId}`)
}

const quickExchange = async (product) => {
    if (userStore.userInfo.points < product.points) {
        showNotify({ type: 'warning', message: '點數不足，無法兌換' })
        return
    }

    try {
        await showConfirmDialog({
            title: '確認兌換',
            message: `確定要兌換「${product.name}」嗎？\n需要 ${product.points} 點數`,
        })

        if (userStore.deductPoints(product.points)) {
            userStore.addExchangeRecord({
                productName: product.name,
                points: product.points,
                type: 'exchange'
            })

            showNotify({ type: 'success', message: '兌換成功！' })
        }
    } catch {
        // 取消兌換
    }
}
</script>

<style scoped>
.product-list {
    background-color: #f5f5f5;
    min-height: 100vh;
    padding-bottom: 60px;
}

.search-section {
    padding: 10px 16px;
    background: white;
}

.filter-section {
    background: white;
    border-bottom: 1px solid #eee;
}

.products-container {
    padding: 16px;
}

.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
}

.product-card {
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
}

.product-card:active {
    transform: scale(0.98);
}

.product-image {
    position: relative;
    height: 120px;
    overflow: hidden;
}

.product-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.stock-warning {
    position: absolute;
    top: 5px;
    right: 5px;
    background: #ff4444;
    color: white;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 12px;
}

.product-info {
    padding: 12px;
}

.product-info h3 {
    margin: 0 0 8px 0;
    font-size: 14px;
    font-weight: 500;
    color: #333;
}

.description {
    margin: 0 0 12px 0;
    font-size: 12px;
    color: #666;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.product-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.points {
    color: #ff6b6b;
    font-weight: bold;
    font-size: 14px;
}

.points-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #1989fa;
    color: white;
    padding: 12px 16px;
    text-align: center;
    font-weight: 500;
}
</style>