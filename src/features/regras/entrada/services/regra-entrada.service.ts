import api from '@/shared/api/api'
import { ElMessage } from 'element-plus'

export interface RegraStepDto {
  id?: number
  rota: string
  prioridade: number
  acao: string
  parametros: string
}

export interface ListRegraEntradaDto {
  id: string
  nome: string
  descricao: string | null
  tipo: 'entrada'
  regra: RegraStepDto[]
}

export interface CreateRegraEntradaDto {
  nome: string
  descricao?: string | null
  tipo: 'entrada'
  regra: Omit<RegraStepDto, 'id'>[]
}

export interface UpdateRegraEntradaDto {
  nome?: string
  descricao?: string | null
  tipo: 'entrada'
  regra?: Omit<RegraStepDto, 'id'>[]
}

export type FindRegraEntradaDto = ListRegraEntradaDto

export interface ListFilaOptionDto {
  id?: string
  nomeIdentificador: string
  nome: string
  ramais?: string[]
}

export interface ListRamalOptionDto {
  ramal: string
  nome: string
}

export interface RegraEntradaFormData {
  nome: string
  descricao: string
  numero: string
  tipoDestino: 'ura' | 'fila' | 'ramal' | ''
  destinoValor: string
}

function getErrorMessage(error: unknown, defaultMsg: string): string {
  const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message
  return msg && typeof msg === 'string' ? msg : defaultMsg
}

export const ListRegrasEntrada = async (): Promise<ListRegraEntradaDto[]> => {
  try {
    const response = await api.get('/regra', { params: { tipo: 'entrada' } })
    return response.data.data ?? response.data
  } catch (error) {
    ElMessage.error(getErrorMessage(error, 'Erro ao listar regras de entrada.'))
    throw error
  }
}

export const FindRegraEntrada = async (id: string): Promise<FindRegraEntradaDto> => {
  try {
    const response = await api.get(`/regra/${id}`)
    return response.data.data ?? response.data
  } catch (error) {
    ElMessage.error(getErrorMessage(error, 'Erro ao buscar regra de entrada.'))
    throw error
  }
}

export const CreateRegraEntrada = async (
  data: CreateRegraEntradaDto
): Promise<ListRegraEntradaDto> => {
  try {
    const response = await api.post('/regra/create', data)
    ElMessage.success('Regra de entrada criada com sucesso.')
    return response.data.data ?? response.data
  } catch (error) {
    ElMessage.error(getErrorMessage(error, 'Erro ao criar regra de entrada.'))
    throw error
  }
}

export const UpdateRegraEntrada = async (
  id: string,
  data: UpdateRegraEntradaDto
): Promise<ListRegraEntradaDto> => {
  try {
    const response = await api.put(`/regra/${id}`, data)
    ElMessage.success('Regra de entrada atualizada com sucesso.')
    return response.data.data ?? response.data
  } catch (error) {
    ElMessage.error(getErrorMessage(error, 'Erro ao atualizar regra de entrada.'))
    throw error
  }
}

export const DeleteRegraEntrada = async (id: string): Promise<void> => {
  try {
    await api.delete(`/regra/${id}`)
    ElMessage.success('Regra de entrada excluída com sucesso.')
  } catch (error) {
    ElMessage.error(getErrorMessage(error, 'Erro ao excluir regra de entrada.'))
    throw error
  }
}

export const ListFilas = async (): Promise<ListFilaOptionDto[]> => {
  try {
    const response = await api.get('/fila')
    return response.data.data ?? []
  } catch (error) {
    ElMessage.error(getErrorMessage(error, 'Erro ao listar filas.'))
    throw error
  }
}

export const ListRamais = async (): Promise<ListRamalOptionDto[]> => {
  try {
    const response = await api.get('/ramal')
    const data = response.data.data ?? response.data ?? []
    return Array.isArray(data) ? data : []
  } catch (error) {
    ElMessage.error(getErrorMessage(error, 'Erro ao listar ramais.'))
    throw error
  }
}
