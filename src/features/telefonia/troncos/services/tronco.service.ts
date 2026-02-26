import api from '@/shared/api/api'
import { ElMessage } from 'element-plus'

export interface TroncoDto {
    username: string
    password: string
    provedorHost: string
}

export interface CreateTroncoDto {
    username: string
    password: string
    provedorHost: string
}

export interface UpdateTroncoDto {
    username?: string
    password?: string
    provedorHost?: string
}

export const ListTroncos = async (): Promise<TroncoDto[]> => {
    try {
        const response = await api.get('/tronco')
        return response.data.data
    } catch (error) {
        ElMessage.error('Erro ao listar troncos.')
        throw error
    }
}

export const FindTronco = async (username: string): Promise<TroncoDto> => {
    try {
        const response = await api.get(`/tronco/${username}`)
        return response.data.data
    } catch (error) {
        ElMessage.error('Erro ao buscar tronco.')
        throw error
    }
}

export const CreateTronco = async (data: CreateTroncoDto): Promise<TroncoDto> => {
    try {
        const response = await api.post('/tronco', data)
        ElMessage.success('Tronco criado com sucesso.')
        return response.data.data
    } catch (error) {
        ElMessage.error('Erro ao criar tronco.')
        throw error
    }
}

export const UpdateTronco = async (username: string, data: UpdateTroncoDto): Promise<TroncoDto> => {
    try {
        const response = await api.put(`/tronco/${username}`, data)
        ElMessage.success('Tronco atualizado com sucesso.')
        return response.data.data
    } catch (error) {
        ElMessage.error('Erro ao atualizar tronco.')
        throw error
    }
}

export const DeleteTronco = async (username: string): Promise<void> => {
    try {
        await api.delete(`/tronco/${username}`)
        ElMessage.success('Tronco excluído com sucesso.')
    } catch (error) {
        ElMessage.error('Erro ao excluir tronco.')
        throw error
    }
}
