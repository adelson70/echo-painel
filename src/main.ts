import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useAuthStore } from './app/stores/auth.store'
import ElementPlus from 'element-plus'

import 'element-plus/dist/index.css'
import '@/styles/main.css'
import '@/styles/theme.css'

import App from './App.vue'
import router from './app/router'

const app = createApp(App)
app.use(createPinia())

const authStore = useAuthStore()
await authStore.fecthMe()

app.use(router)
app.use(ElementPlus)

app.mount('#app')
