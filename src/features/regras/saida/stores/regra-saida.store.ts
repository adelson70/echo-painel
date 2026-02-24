import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
  ListRegrasSaida,
  FindRegra,
  CreateRegra,
  UpdateRegra,
  DeleteRegra,
  GetMetadataSaida,
  type ListRegraDto,
  type CreateRegraDto,
  type UpdateRegraDto,
  type RegraSaidaMetadata,
} from '../services/regra-saida.service'

export const useRegraSaidaStore = defineStore('regraSaida', () => {
  const regras = ref<ListRegraDto[]>([])
  const loading = ref(false)
  const searchQuery = ref('')
  const metadata = ref<RegraSaidaMetadata | null>(null)

  const filteredRegras = computed(() => {
    if (!searchQuery.value) return regras.value
    const query = searchQuery.value.toString().toLowerCase()
    return regras.value.filter((r) => {
      const nome = (r.nome || '').toString().toLowerCase()
      const descricao = (r.descricao || '').toString().toLowerCase()
      return nome.includes(query) || descricao.includes(query)
    })
  })

  async function fetchRegras() {
    loading.value = true
    try {
      regras.value = await ListRegrasSaida()
    } catch (error) {
      ElMessage.error('Erro ao carregar regras de saída.')
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  async function fetchMetadata() {
    try {
      metadata.value = await GetMetadataSaida()
      return metadata.value
    } catch (error) {
      console.error(error)
      return null
    }
  }

  async function createRegra(data: CreateRegraDto) {
    const created = await CreateRegra(data)
    if (created?.id) {
      regras.value.push(created)
    } else {
      await fetchRegras()
    }
  }

  async function updateRegra(id: string, data: UpdateRegraDto) {
    const updated = await UpdateRegra(id, data)
    const index = regras.value.findIndex((r) => r.id === id)
    if (index !== -1) {
      regras.value[index] = { ...regras.value[index]!, ...updated }
    }
  }

  async function deleteRegra(id: string) {
    await DeleteRegra(id)
    regras.value = regras.value.filter((r) => r.id !== id)
  }

  return {
    regras,
    loading,
    searchQuery,
    metadata,
    filteredRegras,
    fetchRegras,
    fetchMetadata,
    createRegra,
    updateRegra,
    deleteRegra,
    findRegra: FindRegra,
  }
})
