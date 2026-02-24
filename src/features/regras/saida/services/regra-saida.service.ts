import api from '@/shared/api/api'
import { ElMessage } from 'element-plus'

export interface RegraStep {
  id?: string
  rota: string
  prioridade: number
  acao: string
  parametros: string
}

export interface ListRegraDto {
  id: string
  nome: string
  descricao: string
  tipo: string
  regra: RegraStep[]
}

export interface CreateRegraDto {
  nome: string
  descricao?: string
  tipo: 'saida'
  regra: Omit<RegraStep, 'id'>[]
}

export interface UpdateRegraDto {
  nome?: string
  descricao?: string
  tipo: 'saida'
  regra?: Omit<RegraStep, 'id'>[]
}

export type FindRegraDto = ListRegraDto

export interface RegraSaidaMetadata {
  appValues: { value: string; label: string }[]
  extenPatterns: string[]
}

function getErrorMessage(error: unknown, defaultMsg: string): string {
  const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message
  return msg && typeof msg === 'string' ? msg : defaultMsg
}

export const ListRegrasSaida = async (): Promise<ListRegraDto[]> => {
  try {
    const response = await api.get('/regra', { params: { tipo: 'saida' } })
    return response.data.data ?? response.data
  } catch (error) {
    ElMessage.error(getErrorMessage(error, 'Erro ao listar regras de saída.'))
    throw error
  }
}

export const FindRegra = async (id: string): Promise<FindRegraDto> => {
  try {
    const response = await api.get(`/regra/${id}`)
    return response.data.data ?? response.data
  } catch (error) {
    ElMessage.error(getErrorMessage(error, 'Erro ao buscar regra.'))
    throw error
  }
}

export const GetMetadataSaida = async (): Promise<RegraSaidaMetadata> => {
  try {
    const response = await api.get('/regra/saida/metadata')
    return response.data.data ?? response.data
  } catch (error) {
    throw error
  }
}

export const CreateRegra = async (data: CreateRegraDto): Promise<ListRegraDto> => {
  try {
    const response = await api.post('/regra/create', data)
    ElMessage.success('Regra de saída criada com sucesso.')
    return response.data.data ?? response.data
  } catch (error) {
    ElMessage.error(getErrorMessage(error, 'Erro ao criar regra de saída.'))
    throw error
  }
}

export const UpdateRegra = async (id: string, data: UpdateRegraDto): Promise<ListRegraDto> => {
  try {
    const response = await api.put(`/regra/${id}`, data)
    ElMessage.success('Regra de saída atualizada com sucesso.')
    return response.data.data ?? response.data
  } catch (error) {
    ElMessage.error(getErrorMessage(error, 'Erro ao atualizar regra de saída.'))
    throw error
  }
}

export const DeleteRegra = async (id: string): Promise<void> => {
  try {
    await api.delete(`/regra/${id}`)
    ElMessage.success('Regra de saída excluída com sucesso.')
  } catch (error) {
    ElMessage.error(getErrorMessage(error, 'Erro ao excluir regra de saída.'))
    throw error
  }
}
