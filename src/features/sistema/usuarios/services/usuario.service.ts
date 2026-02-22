import api from '@/shared/api/api'
import { ElMessage } from 'element-plus'
import type { PermissaoDto } from '@/features/sistema/perfis/services/perfil.service'

export interface ListUsuarioDto {
  id: string
  nome: string
  email: string
  is_admin: boolean
  perfil_id: string | null
  last_login: string | null
}

export interface FindUsuarioDto extends ListUsuarioDto {
  perfil?: { id: string; nome: string }
  permissoesUsuario?: { modulo: string; criar: boolean; ler: boolean; editar: boolean; deletar: boolean }[]
}

export interface CreateUsuarioDto {
  nome: string
  email: string
  senha: string
  is_admin: boolean
  perfil_id?: string
}

export interface UpdateUsuarioDto {
  nome?: string
  email?: string
  senha?: string
  is_admin?: boolean
  perfil_id?: string
}

export interface AddPermissaoUsuarioDto {
  usuario_id: string
  permissoes: PermissaoDto[]
}

function getErrorMessage(error: unknown, defaultMsg: string): string {
  const msg = (error as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message
  if (Array.isArray(msg) && msg.length > 0) return msg.join(' ')
  return msg && typeof msg === 'string' ? msg : defaultMsg
}

export const ListUsuarios = async (): Promise<ListUsuarioDto[]> => {
  try {
    const response = await api.get('/usuario')
    return response.data.data
  } catch (error) {
    ElMessage.error(getErrorMessage(error, 'Erro ao listar usuários.'))
    throw error
  }
}

export const FindUsuario = async (id: string): Promise<FindUsuarioDto> => {
  try {
    const response = await api.get(`/usuario/${id}`)
    return response.data.data
  } catch (error) {
    ElMessage.error(getErrorMessage(error, 'Erro ao buscar usuário.'))
    throw error
  }
}

export const CreateUsuario = async (data: CreateUsuarioDto): Promise<ListUsuarioDto> => {
  try {
    const response = await api.post('/usuario/create', data)
    ElMessage.success('Usuário criado com sucesso.')
    return response.data.data
  } catch (error) {
    ElMessage.error(getErrorMessage(error, 'Erro ao criar usuário.'))
    throw error
  }
}

export const UpdateUsuario = async (id: string, data: UpdateUsuarioDto): Promise<ListUsuarioDto> => {
  try {
    const response = await api.put(`/usuario/${id}`, data)
    ElMessage.success('Usuário atualizado com sucesso.')
    return response.data.data
  } catch (error) {
    ElMessage.error(getErrorMessage(error, 'Erro ao atualizar usuário.'))
    throw error
  }
}

export const DeleteUsuario = async (id: string): Promise<void> => {
  try {
    await api.delete(`/usuario/${id}`)
    ElMessage.success('Usuário excluído com sucesso.')
  } catch (error) {
    ElMessage.error(getErrorMessage(error, 'Erro ao excluir usuário.'))
    throw error
  }
}

export const TogglePermissao = async (data: AddPermissaoUsuarioDto): Promise<void> => {
  try {
    await api.post('/usuario/permissao/toggle', data)
    ElMessage.success('Permissões atualizadas com sucesso.')
  } catch (error) {
    ElMessage.error(getErrorMessage(error, 'Erro ao atualizar permissões.'))
    throw error
  }
}
