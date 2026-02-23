import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
  ListGruposDeCaptura,
  CreateGrupoDeCaptura,
  UpdateGrupoDeCaptura,
  DeleteGrupoDeCaptura,
  ToggleMembroGrupoDeCaptura,
  FindGrupoDeCaptura,
  type ListGrupoDeCapturaDto,
  type CreateGrupoDeCapturaDto,
  type UpdateGrupoDeCapturaDto,
} from '@/features/telefonia/grupos-de-captura/services/grupo-captura.service'

export const useGrupoCapturaStore = defineStore('grupoCaptura', () => {
  const grupos = ref<ListGrupoDeCapturaDto[]>([])
  const loading = ref(false)
  const searchQuery = ref('')

  const filteredGrupos = computed(() => {
    if (!searchQuery.value) return grupos.value
    const query = searchQuery.value.toString().toLowerCase()
    return grupos.value.filter((g) => {
      const nome = (g.nome || '').toString().toLowerCase()
      return nome.includes(query)
    })
  })

  async function fetchGrupos() {
    loading.value = true
    try {
      grupos.value = await ListGruposDeCaptura()
    } catch (error) {
      ElMessage.error('Erro ao carregar grupos de captura.')
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  async function createGrupo(data: CreateGrupoDeCapturaDto) {
    const created = await CreateGrupoDeCaptura(data)
    if (created?.id) {
      grupos.value.push(created)
    } else {
      await fetchGrupos()
    }
  }

  async function updateGrupo(id: string, data: UpdateGrupoDeCapturaDto) {
    const updated = await UpdateGrupoDeCaptura(id, data)
    const index = grupos.value.findIndex((g) => g.id === id)
    if (index !== -1) {
      grupos.value[index] = { ...grupos.value[index]!, ...updated }
    }
  }

  async function deleteGrupo(id: string) {
    await DeleteGrupoDeCaptura(id)
    grupos.value = grupos.value.filter((g) => g.id !== id)
  }

  async function toggleMembro(grupoId: string, membroId: string) {
    await ToggleMembroGrupoDeCaptura({ id: grupoId, membroId })
    const grupo = grupos.value.find((g) => g.id === grupoId)
    if (!grupo) return
    const memberIndex = grupo.membros.indexOf(membroId)
    if (memberIndex >= 0) {
      grupo.membros = grupo.membros.filter((id) => id !== membroId)
    } else {
      grupo.membros = [...grupo.membros, membroId]
    }
  }

  async function refreshGrupo(id: string) {
    const updated = await FindGrupoDeCaptura(id)
    const index = grupos.value.findIndex((g) => g.id === id)
    if (index !== -1) {
      grupos.value[index] = updated
    }
    return updated
  }

  return {
    grupos,
    loading,
    searchQuery,
    filteredGrupos,
    fetchGrupos,
    createGrupo,
    updateGrupo,
    deleteGrupo,
    toggleMembro,
    refreshGrupo,
    findGrupo: FindGrupoDeCaptura,
  }
})
