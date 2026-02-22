import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
  ListUsuarios,
  FindUsuario,
  CreateUsuario,
  UpdateUsuario,
  DeleteUsuario,
  TogglePermissao,
  type ListUsuarioDto,
  type CreateUsuarioDto,
  type UpdateUsuarioDto,
  type AddPermissaoUsuarioDto
} from '@/features/sistema/usuarios/services/usuario.service'

export const useUsuarioStore = defineStore('usuario', () => {
  const usuarios = ref<ListUsuarioDto[]>([])
  const loading = ref(false)
  const searchQuery = ref('')

  const filteredUsuarios = computed(() => {
    if (!searchQuery.value) return usuarios.value
    const query = searchQuery.value.toString().toLowerCase()
    return usuarios.value.filter(u => {
      const nome = (u.nome || '').toString().toLowerCase()
      const email = (u.email || '').toString().toLowerCase()
      return nome.includes(query) || email.includes(query)
    })
  })

  async function fetchUsuarios() {
    loading.value = true
    try {
      usuarios.value = await ListUsuarios()
    } catch (error) {
      ElMessage.error('Erro ao carregar usuários.')
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  async function createUsuario(data: CreateUsuarioDto) {
    const created = await CreateUsuario(data)
    usuarios.value.push({
      id: created.id,
      nome: created.nome,
      email: created.email,
      is_admin: created.is_admin,
      perfil_id: created.perfil_id ?? null,
      last_login: created.last_login ?? null
    })
  }

  async function updateUsuario(id: string, data: UpdateUsuarioDto) {
    const updated = await UpdateUsuario(id, data)
    const index = usuarios.value.findIndex(u => u.id === id)
    if (index !== -1) {
      usuarios.value[index] = {
        ...usuarios.value[index]!,
        nome: updated.nome ?? usuarios.value[index]!.nome,
        email: updated.email ?? usuarios.value[index]!.email,
        is_admin: updated.is_admin ?? usuarios.value[index]!.is_admin,
        perfil_id: updated.perfil_id !== undefined ? updated.perfil_id : usuarios.value[index]!.perfil_id,
        last_login: usuarios.value[index]!.last_login
      }
    }
  }

  async function deleteUsuario(id: string) {
    await DeleteUsuario(id)
    usuarios.value = usuarios.value.filter(u => u.id !== id)
  }

  async function togglePermissao(data: AddPermissaoUsuarioDto) {
    await TogglePermissao(data)
  }

  return {
    usuarios,
    loading,
    searchQuery,
    filteredUsuarios,
    fetchUsuarios,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    togglePermissao,
    findUsuario: FindUsuario
  }
})
