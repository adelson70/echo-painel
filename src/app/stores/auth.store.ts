import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as loginService, type Usuario, me, logout as logoutService } from '@/features/login/services/auth.service'
import { ElMessage } from 'element-plus'

export const useAuthStore = defineStore('auth', () => {
    const usuario = ref<Usuario | null>(null)
    const accessToken = ref<string | null>(null)
    const loading = ref(false)

    const isAuthenticated = computed(() => !!accessToken.value)
    const setAccessToken = (token: string | null) => {
        accessToken.value = token
    }

    async function fecthMe() {
        try {
            const { usuario: usuarioData } = await me()
            usuario.value = usuarioData
        } catch (error) {
            usuario.value = null
            accessToken.value = null
        }
    }

    async function login(credentials: { email: string; password: string }) {
        loading.value = true

        try {
            const { accessToken: token, usuario: usuarioData, message } = await loginService(credentials)

            accessToken.value = token
            usuario.value = usuarioData

            ElMessage.success(message || "Login realizado com sucesso")
        } catch (err: any) {
            console.error('Login error:', err)
            ElMessage.error(err.response.data.message || "Falha ao efetuar login.")
            throw err
        } finally {
            loading.value = false
        }
    }

    async function logout() {
        accessToken.value = null
        usuario.value = null
        await logoutService()
    }

    return {
        usuario,
        accessToken,
        loading,
        isAuthenticated,
        setAccessToken,
        login,
        logout,
        fecthMe
    }
})
