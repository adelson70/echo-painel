import api from "@/shared/api/api";
import { ElMessage } from 'element-plus'

export interface RamalDto {
  ramal: string;
  nome: string;
  senha: string;
  regraSaida: string;
  maximoContatos: number;
  dod: string | null;
  status?: string; // mocked for now
}

export interface CreateRamalDto {
  ramal: string;
  nome: string;
  senha: string;
  regraSaida: string;
  maximoContatos: number;
  dod?: string | null;
}

export interface CreateLoteRamalDto {
  quantidadeRamais: number;
  ramalInicial: string;
  nome?: string;
  senha?: string;
  regraSaida?: string;
  maximoContatos?: number;
  dod?: string | null;
}

export interface UpdateRamalDto {
  nome?: string;
  senha?: string;
  regraSaida?: string;
  maximoContatos?: number;
  dod?: string | null;
}

export interface ListRamalDto extends RamalDto {}
export interface FindRamalDto extends RamalDto {}

export const ListRamais = async (): Promise<RamalDto[]> => {
  try {
    const response = await api.get('/ramal');
    return response.data.data;
  } catch (error) {
    ElMessage.error('Erro ao listar ramais.');
    throw error;
  }
};

export const FindRamal = async (ramal: string): Promise<FindRamalDto> => {
    try {
        const response = await api.get(`/ramal/${ramal}`);
        return response.data.data;
    } catch (error) {
        ElMessage.error('Erro ao buscar ramal.');
        throw error;
    }
};

export const CreateRamal = async (data: CreateRamalDto): Promise<CreateRamalDto> => {
    try {
        const response = await api.post('/ramal/create', data);
        ElMessage.success('Ramal criado com sucesso.');
        return response.data.data;
    } catch (error) {
        ElMessage.error('Erro ao criar ramal.');
        throw error;
    }
};

export const CreateLoteRamal = async (data: CreateLoteRamalDto): Promise<RamalDto[]> => {
    try {
        const response = await api.post('/ramal/create-lote', data);
        return response.data.data;
    } catch (error) {
        ElMessage.error('Erro ao criar lote de ramais.');
        throw error;
    }
};

export const UpdateRamal = async (ramal: string, data: UpdateRamalDto): Promise<UpdateRamalDto> => {
    try {
        const response = await api.put(`/ramal/${ramal}`, data);
        return response.data.data;
    } catch (error) {
        ElMessage.error('Erro ao atualizar ramal.');
        throw error;
    }
};

export const DeleteRamal = async (ramal: string): Promise<void> => {
    try {
        await api.delete(`/ramal/${ramal}`);
    } catch (error) {
        ElMessage.error('Erro ao deletar ramal.');
        throw error;
    }
};