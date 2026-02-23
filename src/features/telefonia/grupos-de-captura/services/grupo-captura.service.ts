import api from '@/shared/api/api'
import { ElMessage } from 'element-plus'

export interface ListGrupoDeCapturaDto {
  id: string
  nome: string
  membros: string[]
}

export interface CreateGrupoDeCapturaDto {
  nome: string
  membros?: string[]
}

export interface UpdateGrupoDeCapturaDto {
  nome: string
}

export interface ToggleGrupoDeCapturaDto {
  id: string
  membroId: string
}

export type FindGrupoDeCapturaDto = ListGrupoDeCapturaDto

function getErrorMessage(error: unknown, defaultMsg: string): string {
  const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message
  return msg && typeof msg === 'string' ? msg : defaultMsg
}

export const ListGruposDeCaptura = async (): Promise<ListGrupoDeCapturaDto[]> => {
  try {
    const response = await api.get('/grupo-de-captura')
    return response.data.data
  } catch (error) {
    ElMessage.error(getErrorMessage(error, 'Erro ao listar grupos de captura.'))
    throw error
  }
}

export const FindGrupoDeCaptura = async (id: string): Promise<FindGrupoDeCapturaDto> => {
  try {
    const response = await api.get(`/grupo-de-captura/${id}`)
    return response.data.data
  } catch (error) {
    ElMessage.error(getErrorMessage(error, 'Erro ao buscar grupo de captura.'))
    throw error
  }
}

export const CreateGrupoDeCaptura = async (
  data: CreateGrupoDeCapturaDto
): Promise<ListGrupoDeCapturaDto> => {
  try {
    const response = await api.post('/grupo-de-captura', data)
    ElMessage.success('Grupo de captura criado com sucesso.')
    return response.data.data
  } catch (error) {
    ElMessage.error(getErrorMessage(error, 'Erro ao criar grupo de captura.'))
    throw error
  }
}

export const UpdateGrupoDeCaptura = async (
  id: string,
  data: UpdateGrupoDeCapturaDto
): Promise<ListGrupoDeCapturaDto> => {
  try {
    const response = await api.put(`/grupo-de-captura/${id}`, data)
    ElMessage.success('Grupo de captura atualizado com sucesso.')
    return response.data.data
  } catch (error) {
    ElMessage.error(getErrorMessage(error, 'Erro ao atualizar grupo de captura.'))
    throw error
  }
}

export const DeleteGrupoDeCaptura = async (id: string): Promise<void> => {
  try {
    await api.delete(`/grupo-de-captura/${id}`)
    ElMessage.success('Grupo de captura excluído com sucesso.')
  } catch (error) {
    ElMessage.error(getErrorMessage(error, 'Erro ao excluir grupo de captura.'))
    throw error
  }
}

export const ToggleMembroGrupoDeCaptura = async (
  data: ToggleGrupoDeCapturaDto
): Promise<void> => {
  try {
    await api.post('/grupo-de-captura/toggle-membro', data)
    ElMessage.success('Membro atualizado.')
  } catch (error) {
    ElMessage.error(getErrorMessage(error, 'Erro ao adicionar/remover membro do grupo.'))
    throw error
  }
}
