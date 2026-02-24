import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
  ListRegrasEntrada,
  FindRegraEntrada,
  CreateRegraEntrada,
  UpdateRegraEntrada,
  DeleteRegraEntrada,
  type ListRegraEntradaDto,
  type CreateRegraEntradaDto,
  type UpdateRegraEntradaDto
} from '@/features/regras/entrada/services/regra-entrada.service'

export const useRegraEntradaStore = defineStore('regraEntrada', () => {
  const regras = ref<ListRegraEntradaDto[]>([])
  const loading = ref(false)
  const searchQuery = ref('')

  const filteredRegras = computed(() => {
    if (!searchQuery.value) return regras.value
    const query = searchQuery.value.toString().toLowerCase()
    return regras.value.filter(r => {
      const nome = (r.nome || '').toString().toLowerCase()
      const descricao = (r.descricao || '').toString().toLowerCase()
      return nome.includes(query) || descricao.includes(query)
    })
  })

  async function fetchList() {
    loading.value = true
    try {
      regras.value = await ListRegrasEntrada()
    } catch {
      ElMessage.error('Erro ao carregar regras de entrada.')
      regras.value = []
    } finally {
      loading.value = false
    }
  }

  async function create(data: CreateRegraEntradaDto) {
    const created = await CreateRegraEntrada(data)
    regras.value.push(created)
  }

  async function update(id: string, data: UpdateRegraEntradaDto) {
    const updated = await UpdateRegraEntrada(id, data)
    const index = regras.value.findIndex(r => r.id === id)
    if (index !== -1) {
      regras.value[index] = updated
    }
  }

  async function remove(id: string) {
    await DeleteRegraEntrada(id)
    regras.value = regras.value.filter(r => r.id !== id)
  }

  return {
    regras,
    loading,
    searchQuery,
    filteredRegras,
    fetchList,
    create,
    update,
    remove,
    findRegra: FindRegraEntrada
  }
})
