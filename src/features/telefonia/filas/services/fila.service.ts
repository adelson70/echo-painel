import api from '@/shared/api/api'
import { ElMessage } from 'element-plus'

export const EstrategiaFila = {
  RING_ALL: 'ringall',
  LEAST_RECENT: 'leastrecent',
  FEWEST_CALLS: 'fewestcalls',
  RANDOM: 'random',
  RR_MEMORY: 'rrmemory',
  LINEAR: 'linear',
  WRANDOM: 'wrandom',
  RR_ORDERED: 'rrordered',
} as const

export type EstrategiaFilaValue = (typeof EstrategiaFila)[keyof typeof EstrategiaFila]

export const MusicaDeEsperaFila = {
  DEFAULT: 'default',
  NO_MUSIC_WHEN_EMPTY: 'no-music-when-empty',
  MUSIC_ON_HOLD: 'music-on-hold',
} as const

export type MusicaDeEsperaFilaValue = (typeof MusicaDeEsperaFila)[keyof typeof MusicaDeEsperaFila]

export interface FilaDto {
  id: string
  nomeIdentificador: string
  nome: string
  estrategia: EstrategiaFilaValue
  tempoEspera?: number
  tentativas?: number
  musicaDeEspera?: MusicaDeEsperaFilaValue
}

export interface ListFilaDto extends FilaDto {
  ramais: string[]
}

export interface CreateFilaDto {
  nomeIdentificador: string
  nome: string
  estrategia: EstrategiaFilaValue
  tempoEspera?: number
  tentativas?: number
  musicaDeEspera?: MusicaDeEsperaFilaValue
}

export interface UpdateFilaDto {
  nome?: string
  estrategia?: EstrategiaFilaValue
  tempoEspera?: number
  tentativas?: number
  musicaDeEspera?: MusicaDeEsperaFilaValue
}

export type FindFilaDto = ListFilaDto

function getErrorMessage(error: unknown, defaultMsg: string): string {
  const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message
  return msg && typeof msg === 'string' ? msg : defaultMsg
}

export const ListFilas = async (): Promise<ListFilaDto[]> => {
  try {
    const response = await api.get('/fila')
    return response.data.data
  } catch (error) {
    ElMessage.error(getErrorMessage(error, 'Erro ao listar filas.'))
    throw error
  }
}

export const FindFila = async (id: string): Promise<FindFilaDto> => {
  try {
    const response = await api.get(`/fila/${id}`)
    return response.data.data
  } catch (error) {
    ElMessage.error(getErrorMessage(error, 'Erro ao buscar fila.'))
    throw error
  }
}

export const CreateFila = async (data: CreateFilaDto): Promise<ListFilaDto> => {
  try {
    const response = await api.post('/fila/create', data)
    ElMessage.success('Fila criada com sucesso.')
    return response.data.data
  } catch (error) {
    ElMessage.error(getErrorMessage(error, 'Erro ao criar fila.'))
    throw error
  }
}

export const UpdateFila = async (id: string, data: UpdateFilaDto): Promise<ListFilaDto> => {
  try {
    const response = await api.put(`/fila/${id}`, data)
    ElMessage.success('Fila atualizada com sucesso.')
    return response.data.data
  } catch (error) {
    ElMessage.error(getErrorMessage(error, 'Erro ao atualizar fila.'))
    throw error
  }
}

export const DeleteFila = async (id: string): Promise<void> => {
  try {
    await api.delete(`/fila/${id}`)
    ElMessage.success('Fila excluída com sucesso.')
  } catch (error) {
    ElMessage.error(getErrorMessage(error, 'Erro ao excluir fila.'))
    throw error
  }
}

export const ToggleMemberFila = async (
  filaId: string,
  ramalId: string
): Promise<{ message: string }> => {
  try {
    const response = await api.put(`/fila/${filaId}/member`, { ramal: ramalId })
    const message = response.data?.message ?? 'Membro atualizado.'
    ElMessage.success(message)
    return { message }
  } catch (error) {
    ElMessage.error(getErrorMessage(error, 'Erro ao adicionar/remover membro da fila.'))
    throw error
  }
}
