import api from "@/shared/api/api";
import { ElMessage } from 'element-plus'

interface LoginReq {
    email: string;
    password: string;
}

interface LoginRes {
    accessToken: string;
    usuario: Usuario;
    message: string;
}

export interface Usuario {
    id: string;
    nome: string;
    email: string;
    is_admin: boolean;
    perfil_id: string;
    last_login: string | null;
}

export const login = async (credentials: LoginReq) => {
    const response = await api.post<LoginRes>("/auth/login", credentials);
    return { accessToken: response.data.accessToken, usuario: response.data.usuario, message: response.data.message };
}

export const me = async () => {
    const response = await api.get<Usuario>("/auth/me");
    return { usuario: response.data };
}