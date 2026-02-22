import api from '@/shared/api/api'
import { ElMessage } from 'element-plus'

export const MODULOS = [
  'RAMAL',
  'REGRA',
  'TRONCO',
  'FILA',
  'GRUPO_DE_CAPTURA',
  'USUARIO',
  'RELATORIO',
  'SISTEMA',
  'AUTH',
  'LOG',
  'PERFIL'
] as const

export type Modulos = (typeof MODULOS)[number]

export interface PermissaoDto {
  id?: string
  modulo: Modulos
  criar: boolean
  ler: boolean
  editar: boolean
  deletar: boolean
}

export interface ListPerfilDto {
  id: string
  nome: string
  descricao: string
  quantidadeUsuarios: number
}

export interface PerfilDto extends ListPerfilDto {
  permissoes: PermissaoDto[]
}

export interface CreatePerfilDto {
  nome: string
  descricao?: string
  permissoes: PermissaoDto[]
}

export interface UpdatePerfilDto {
  nome?: string
  descricao?: string
}

export interface AddPermissaoPerfilDto {
  perfil_id: string
  permissoes: PermissaoDto[]
}

export type FindPerfilDto = PerfilDto

function getErrorMessage(error: unknown, defaultMsg: string): string {
  const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message
  return msg && typeof msg === 'string' ? msg : defaultMsg
}

export const ListPerfis = async (): Promise<ListPerfilDto[]> => {
  try {
    const response = await api.get('/perfil')
    return response.data.data
  } catch (error) {
    ElMessage.error(getErrorMessage(error, 'Erro ao listar perfis.'))
    throw error
  }
}

export const FindPerfil = async (id: string): Promise<FindPerfilDto> => {
  try {
    const response = await api.get(`/perfil/${id}`)
    return response.data.data
  } catch (error) {
    ElMessage.error(getErrorMessage(error, 'Erro ao buscar perfil.'))
    throw error
  }
}

export const CreatePerfil = async (data: CreatePerfilDto): Promise<PerfilDto> => {
  try {
    const response = await api.post('/perfil/create', data)
    ElMessage.success('Perfil criado com sucesso.')
    return response.data.data
  } catch (error) {
    ElMessage.error(getErrorMessage(error, 'Erro ao criar perfil.'))
    throw error
  }
}

export const UpdatePerfil = async (id: string, data: UpdatePerfilDto): Promise<PerfilDto> => {
  try {
    const response = await api.put(`/perfil/${id}`, data)
    ElMessage.success('Perfil atualizado com sucesso.')
    return response.data.data
  } catch (error) {
    ElMessage.error(getErrorMessage(error, 'Erro ao atualizar perfil.'))
    throw error
  }
}

export const DeletePerfil = async (id: string): Promise<void> => {
  try {
    await api.delete(`/perfil/${id}`)
    ElMessage.success('Perfil excluído com sucesso.')
  } catch (error) {
    ElMessage.error(getErrorMessage(error, 'Erro ao excluir perfil.'))
    throw error
  }
}

export const TogglePermissao = async (data: AddPermissaoPerfilDto): Promise<void> => {
  try {
    await api.post('/perfil/permissao/toggle', data)
    ElMessage.success('Permissões atualizadas com sucesso.')
  } catch (error) {
    ElMessage.error(getErrorMessage(error, 'Erro ao atualizar permissões.'))
    throw error
  }
}
