<template>
  <div class="login-page">
    <el-card class="login-card">
      <h2 class="title">Echo PABX</h2>
      <p class="subtitle">Acesso ao painel</p>
      <el-form @submit.prevent="handleLogin" :model="form" label-position="top">
        <el-form-item label="E-mail">
          <el-input 
            v-model="form.email" 
            placeholder="Digite seu e-mail" 
            type="email"
            />
        </el-form-item>

        <el-form-item label="Senha">
          <el-input
            v-model="form.password"
            type="password"
            show-password
            placeholder="Digite sua senha"
          />
        </el-form-item>

        <el-button
          type="primary"
          class="login-button"
          :loading="loading"
          @click="handleLogin"
        >
          Entrar
        </el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useAuthStore } from '@/app/stores/auth.store'
import { useRouter } from 'vue-router'

const loading = ref(false)

const form = reactive({
  email: '',
  password: '',
})

const authStore = useAuthStore()
const router = useRouter()

const handleLogin = async () => {
  loading.value = true

  try {
    await authStore.login(form)
    router.push({ name: 'Dashboard' })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--el-bg-color-page);
}

.login-card {
  width: 360px;
  padding: 8px;
}

.title {
  text-align: center;
  margin-bottom: 4px;
}

.subtitle {
  text-align: center;
  margin-bottom: 16px;
  color: var(--el-text-color-secondary);
}

.login-button {
  width: 100%;
}
</style>
