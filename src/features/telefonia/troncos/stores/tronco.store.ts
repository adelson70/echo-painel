import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
  ListTroncos,
  CreateTronco,
  UpdateTronco,
  DeleteTronco,
  type TroncoDto,
  type CreateTroncoDto,
  type UpdateTroncoDto
} from '@/features/telefonia/troncos/services/tronco.service'

export const useTroncoStore = defineStore('tronco', () => {
  const troncos = ref<TroncoDto[]>([])
  const loading = ref(false)
  const searchQuery = ref('')

  const filteredTroncos = computed(() => {
    if (!searchQuery.value) return troncos.value
    const query = searchQuery.value.toString().toLowerCase()
    return troncos.value.filter(t => {
      const username = (t.username || '').toString().toLowerCase()
      const provedor = (t.provedorHost || '').toString().toLowerCase()
      return username.includes(query) || provedor.includes(query)
    })
  })

  async function fetchTroncos() {
    loading.value = true
    try {
      troncos.value = await ListTroncos()
    } catch (error) {
      ElMessage.error('Erro ao carregar troncos.')
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  async function createTronco(data: CreateTroncoDto) {
    const created = await CreateTronco(data)
    troncos.value.push(created)
  }

  async function updateTronco(username: string, data: UpdateTroncoDto) {
    const updated = await UpdateTronco(username, data)
    const index = troncos.value.findIndex(t => t.username === username)
    if (index !== -1) {
      if (updated.username === username) {
        troncos.value[index] = updated
      } else {
        troncos.value.splice(index, 1)
        troncos.value.push(updated)
      }
    }
  }

  async function deleteTronco(username: string) {
    await DeleteTronco(username)
    troncos.value = troncos.value.filter(t => t.username !== username)
  }

  return {
    troncos,
    loading,
    searchQuery,
    filteredTroncos,
    fetchTroncos,
    createTronco,
    updateTronco,
    deleteTronco
  }
})
