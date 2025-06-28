<template>
    <div class="login-container">
        <van-nav-bar title="會員登入" />

        <div class="login-content">
            <div class="logo-section">
                <van-icon name="user-circle-o" size="80" color="#1989fa" />
                <h2>會員紅利兌換系統</h2>
            </div>

            <van-form @submit="handleLogin">
                <van-cell-group inset>
                    <van-field v-model="form.username" name="username" label="帳號" placeholder="請輸入帳號"
                        :rules="[{ required: true, message: '請填寫帳號' }]" />
                    <van-field v-model="form.password" type="password" name="password" label="密碼" placeholder="請輸入密碼"
                        :rules="[{ required: true, message: '請填寫密碼' }]" />
                </van-cell-group>

                <div class="login-btn">
                    <van-button round block type="primary" native-type="submit" :loading="loading">
                        登入
                    </van-button>
                </div>
            </van-form>

            <div class="demo-accounts">
                <van-divider>測試帳號</van-divider>
                <p>帳號: test1 / 密碼: 123456 (1500點)</p>
                <p>帳號: test2 / 密碼: 123456 (2000點)</p>
                <p>帳號: admin / 密碼: 123456 (5000點)</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { showNotify } from 'vant'

const router = useRouter()
const userStore = useUserStore()

const form = ref({
    username: '',
    password: ''
})

const loading = ref(false)

const handleLogin = async () => {
    loading.value = true

    try {
        const success = userStore.login(form.value.username, form.value.password)

        if (success) {
            showNotify({ type: 'success', message: '登入成功！' })
            router.push('/dashboard')
        } else {
            showNotify({ type: 'danger', message: '帳號或密碼錯誤' })
        }
    } catch (error) {
        showNotify({ type: 'danger', message: '登入失敗，請稍後再試' })
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
.login-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-content {
    padding: 20px;
}

.logo-section {
    text-align: center;
    padding: 40px 0;
    color: white;
}

.logo-section h2 {
    margin: 20px 0 0 0;
    font-size: 24px;
    font-weight: 300;
}

.login-btn {
    margin: 30px 16px 20px;
}

.demo-accounts {
    margin-top: 30px;
    padding: 20px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: white;
    font-size: 14px;
}

.demo-accounts p {
    margin: 8px 0;
    text-align: center;
}
</style>