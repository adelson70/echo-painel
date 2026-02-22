import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
  ListPerfis,
  FindPerfil,
  CreatePerfil,
  UpdatePerfil,
  DeletePerfil,
  TogglePermissao,
  type ListPerfilDto,
  type CreatePerfilDto,
  type UpdatePerfilDto,
  type AddPermissaoPerfilDto
} from '@/features/sistema/perfis/services/perfil.service'

export const usePerfilStore = defineStore('perfil', () => {
  const perfis = ref<ListPerfilDto[]>([])
  const loading = ref(false)
  const searchQuery = ref('')

  const filteredPerfis = computed(() => {
    if (!searchQuery.value) return perfis.value
    const query = searchQuery.value.toString().toLowerCase()
    return perfis.value.filter(p => {
      const nome = (p.nome || '').toString().toLowerCase()
      const descricao = (p.descricao || '').toString().toLowerCase()
      return nome.includes(query) || descricao.includes(query)
    })
  })

  async function fetchPerfis() {
    loading.value = true
    try {
      perfis.value = await ListPerfis()
    } catch (error) {
      ElMessage.error('Erro ao carregar perfis.')
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  async function createPerfil(data: CreatePerfilDto) {
    const created = await CreatePerfil(data)
    perfis.value.push({
      id: created.id,
      nome: created.nome,
      descricao: created.descricao ?? '',
      quantidadeUsuarios: created.quantidadeUsuarios ?? 0
    })
  }

  async function updatePerfil(id: string, data: UpdatePerfilDto) {
    const updated = await UpdatePerfil(id, data)
    const index = perfis.value.findIndex(p => p.id === id)
    if (index !== -1) {
      perfis.value[index] = {
        ...perfis.value[index]!,
        nome: updated.nome ?? perfis.value[index]!.nome,
        descricao: updated.descricao ?? perfis.value[index]!.descricao
      }
    }
  }

  async function deletePerfil(id: string) {
    await DeletePerfil(id)
    perfis.value = perfis.value.filter(p => p.id !== id)
  }

  async function togglePermissao(data: AddPermissaoPerfilDto) {
    await TogglePermissao(data)
  }

  return {
    perfis,
    loading,
    searchQuery,
    filteredPerfis,
    fetchPerfis,
    createPerfil,
    updatePerfil,
    deletePerfil,
    togglePermissao,
    findPerfil: FindPerfil
  }
})
