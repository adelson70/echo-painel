import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
  ListFilas,
  CreateFila,
  UpdateFila,
  DeleteFila,
  ToggleMemberFila,
  FindFila,
  type ListFilaDto,
  type CreateFilaDto,
  type UpdateFilaDto,
} from '@/features/telefonia/filas/services/fila.service'

export const useFilaStore = defineStore('fila', () => {
  const filas = ref<ListFilaDto[]>([])
  const loading = ref(false)
  const searchQuery = ref('')

  const filteredFilas = computed(() => {
    if (!searchQuery.value) return filas.value
    const query = searchQuery.value.toString().toLowerCase()
    return filas.value.filter((f) => {
      const nome = (f.nome || '').toString().toLowerCase()
      const identificador = (f.nomeIdentificador || '').toString().toLowerCase()
      return nome.includes(query) || identificador.includes(query)
    })
  })

  async function fetchFilas() {
    loading.value = true
    try {
      filas.value = await ListFilas()
    } catch (error) {
      ElMessage.error('Erro ao carregar filas.')
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  async function createFila(data: CreateFilaDto) {
    const created = await CreateFila(data)
    filas.value.push(created)
  }

  async function updateFila(id: string, data: UpdateFilaDto) {
    const updated = await UpdateFila(id, data)
    const index = filas.value.findIndex((f) => f.id === id)
    if (index !== -1) {
      filas.value[index] = updated
    }
  }

  async function deleteFila(id: string) {
    await DeleteFila(id)
    filas.value = filas.value.filter((f) => f.id !== id)
  }

  async function toggleMemberFila(filaId: string, ramalId: string) {
    await ToggleMemberFila(filaId, ramalId)
    const fila = filas.value.find((f) => f.id === filaId)
    if (!fila) return
    const memberIndex = fila.ramais.indexOf(ramalId)
    if (memberIndex >= 0) {
      fila.ramais = fila.ramais.filter((id) => id !== ramalId)
    } else {
      fila.ramais = [...fila.ramais, ramalId]
    }
  }

  async function refreshFila(id: string) {
    const updated = await FindFila(id)
    const index = filas.value.findIndex((f) => f.id === id)
    if (index !== -1) {
      filas.value[index] = updated
    }
    return updated
  }

  return {
    filas,
    loading,
    searchQuery,
    filteredFilas,
    fetchFilas,
    createFila,
    updateFila,
    deleteFila,
    toggleMemberFila,
    refreshFila,
    findFila: FindFila,
  }
})
